import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
 
export function useAnalysisResults() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
 
  // ─── Save a single AI result ───────────────────────────────
 
  const saveResult = useCallback(async (payload) => {
    try {
      const { data, error: insertError } = await supabase
        .from('analysis_results')
        .upsert(payload, { onConflict: 'photo_id,session_id' })
        .select()
        .single()
 
      if (insertError) throw insertError
 
      setResults(prev => {
        const idx = prev.findIndex(r => r.id === data.id)
        return idx >= 0
          ? prev.map(r => r.id === data.id ? data : r)
          : [...prev, data]
      })
 
      return data
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [])
 
  // ─── Fetch all results for a scan session ─────────────────
 
  const fetchBySession = useCallback(async (sessionId) => {
    setLoading(true)
    setError(null)
 
    const { data, error: fetchError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
 
    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return []
    }
 
    const rows = data ?? []
    setResults(rows)
    setLoading(false)
    return rows
  }, [])
 
  // ─── Fetch all results for a single photo ─────────────────
 
  const fetchByPhoto = useCallback(async (photoId) => {
    setLoading(true)
    setError(null)
 
    const { data, error: fetchError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('photo_id', photoId)
      .order('created_at', { ascending: false })
 
    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return []
    }
 
    setLoading(false)
    return data ?? []
  }, [])
 
  // ─── Look up cached result by photo id ────────────────────
 
  const getResultForPhoto = useCallback(
    (photoId) => results.find(r => r.photo_id === photoId),
    [results]
  )
 
  return {
    results,
    loading,
    error,
    saveResult,
    fetchBySession,
    fetchByPhoto,
    getResultForPhoto,
  }
}
 
// ─────────────────────────────────────────────────────────────
// Utility: build a result payload from raw AI output
// ─────────────────────────────────────────────────────────────
 
export function buildAnalysisResult(photoId, sessionId, aiOutput) {
  const score = aiOutput.risk_score
 
  const risk_level =
    score >= 0.8 ? 'high'
    : score >= 0.5 ? 'medium'
    : score >= 0.2 ? 'low'
    : 'safe'
 
  return {
    photo_id: photoId,
    session_id: sessionId,
    risk_level,
    risk_score: score,
    findings: aiOutput.findings ?? [],
    model_version: aiOutput.model_version ?? null,
    processing_ms: aiOutput.processing_ms ?? null,
    raw_response: aiOutput.raw_response ?? {},
  }
}
 