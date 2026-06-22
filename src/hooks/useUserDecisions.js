import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
 
export function useUserDecisions() {
  // Keyed by photo_id for O(1) lookup in render
  const [decisions, setDecisions] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
 
  // ─── Save / upsert a decision ──────────────────────────────
 
  const saveDecision = useCallback(async (photoId, decision, note) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
 
      const { data, error: upsertError } = await supabase
        .from('user_decisions')
        .upsert(
          {
            photo_id: photoId,
            user_id: user.id,
            decision,
            note: note ?? null,
            decided_at: new Date().toISOString(),
          },
          { onConflict: 'photo_id,user_id' }
        )
        .select()
        .single()
 
      if (upsertError) throw upsertError
 
      setDecisions(prev => ({ ...prev, [photoId]: data }))
      return data
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [])
 
  // ─── Batch-fetch decisions for a list of photo IDs ─────────
 
  const fetchDecisionsForSession = useCallback(async (photoIds) => {
    if (!photoIds.length) return
 
    setLoading(true)
    setError(null)
 
    const { data, error: fetchError } = await supabase
      .from('user_decisions')
      .select('*')
      .in('photo_id', photoIds)
 
    if (fetchError) {
      setError(fetchError.message)
    } else {
      const map = {}
      for (const row of data ?? []) {
        map[row.photo_id] = row
      }
      setDecisions(prev => ({ ...prev, ...map }))
    }
 
    setLoading(false)
  }, [])
 
  const getDecisionForPhoto = useCallback(
    (photoId) => decisions[photoId],
    [decisions]
  )
 
  return {
    decisions,
    loading,
    error,
    saveDecision,
    fetchDecisionsForSession,
    getDecisionForPhoto,
  }
}
 