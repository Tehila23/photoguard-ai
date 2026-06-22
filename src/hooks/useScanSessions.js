import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
 
export function useScanSessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
 
  const activeSession = sessions.find(
    s => s.status === 'pending' || s.status === 'running'
  ) ?? null
 
  // ─── Fetch ─────────────────────────────────────────────────
 
  const fetchSessions = useCallback(async () => {
    setLoading(true)
    setError(null)
 
    const { data, error: fetchError } = await supabase
      .from('scan_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
 
    if (fetchError) {
      setError(fetchError.message)
    } else {
      setSessions(data ?? [])
    }
 
    setLoading(false)
  }, [])
 
  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])
 
  // ─── Real-time: subscribe to active session updates ────────
 
  useEffect(() => {
    if (!activeSession) return
 
    const channel = supabase
      .channel(`session-${activeSession.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'scan_sessions',
          filter: `id=eq.${activeSession.id}`,
        },
        (payload) => {
          setSessions(prev =>
            prev.map(s => s.id === payload.new.id ? payload.new : s)
          )
        }
      )
      .subscribe()
 
    return () => { supabase.removeChannel(channel) }
  }, [activeSession?.id])
 
  // ─── Shared status updater ─────────────────────────────────
 
  const setStatus = useCallback(async (id, status, extra = {}) => {
    const { error: updateError } = await supabase
      .from('scan_sessions')
      .update({ status, ...extra })
      .eq('id', id)
 
    if (updateError) throw updateError
 
    setSessions(prev =>
      prev.map(s => s.id === id ? { ...s, status, ...extra } : s)
    )
  }, [])
 
  // ─── Actions ───────────────────────────────────────────────
 
  const startSession = useCallback(async (totalPhotos) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
 
      const { data, error: insertError } = await supabase
        .from('scan_sessions')
        .insert({
          user_id: user.id,
          status: 'running',
          total_photos: totalPhotos,
          scanned_photos: 0,
          started_at: new Date().toISOString(),
        })
        .select()
        .single()
 
      if (insertError) throw insertError
 
      setSessions(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [])
 
  const updateProgress = useCallback(async (id, scanned) => {
    try {
      await setStatus(id, 'running', { scanned_photos: scanned })
    } catch (err) {
      setError(err.message)
    }
  }, [setStatus])
 
  const completeSession = useCallback(async (id) => {
    try {
      await setStatus(id, 'completed', {
        completed_at: new Date().toISOString(),
      })
    } catch (err) {
      setError(err.message)
    }
  }, [setStatus])
 
  const failSession = useCallback(async (id, message) => {
    try {
      await setStatus(id, 'failed', { error_message: message })
    } catch (err) {
      setError(err.message)
    }
  }, [setStatus])
 
  return {
    sessions,
    activeSession,
    loading,
    error,
    startSession,
    updateProgress,
    completeSession,
    failSession,
    refreshSessions: fetchSessions,
  }
}
 