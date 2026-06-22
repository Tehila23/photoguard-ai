import { useState, useCallback } from 'react'
import { useScanSessions } from './useScanSessions'
import { useAnalysisResults, buildAnalysisResult } from './useAnalysisResults'
 
const initialProgress = {
  total: 0,
  scanned: 0,
  currentPhotoName: null,
  percent: 0,
}
 
export function useScan() {
  const { startSession, updateProgress, completeSession, failSession } =
    useScanSessions()
  const { saveResult, results } = useAnalysisResults()
 
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(initialProgress)
  const [error, setError] = useState(null)
 
  // analyzePhoto: async (photo) => { risk_score, findings, model_version? }
  const runScan = useCallback(async (photos, analyzePhoto) => {
    if (!photos.length || scanning) return
 
    setScanning(true)
    setError(null)
    setProgress({ total: photos.length, scanned: 0, currentPhotoName: null, percent: 0 })
 
    // 1. Create session row
    const session = await startSession(photos.length)
    if (!session) {
      setError('Failed to create scan session')
      setScanning(false)
      return
    }
 
    try {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
 
        setProgress({
          total: photos.length,
          scanned: i,
          currentPhotoName: photo.file_name,
          percent: Math.round((i / photos.length) * 100),
        })
 
        // 2. Call the AI function provided by the caller
        const start = performance.now()
        const aiOutput = await analyzePhoto(photo)
        const processing_ms = Math.round(performance.now() - start)
 
        // 3. Build and persist the result row
        const payload = buildAnalysisResult(photo.id, session.id, {
          ...aiOutput,
          processing_ms,
        })
        await saveResult(payload)
 
        // 4. Tick the progress counter
        await updateProgress(session.id, i + 1)
      }
 
      // 5. Mark session complete
      await completeSession(session.id)
 
      setProgress({
        total: photos.length,
        scanned: photos.length,
        currentPhotoName: null,
        percent: 100,
      })
    } catch (err) {
      setError(err.message)
      await failSession(session.id, err.message)
    } finally {
      setScanning(false)
    }
  }, [scanning, startSession, saveResult, updateProgress, completeSession, failSession])
 
  return { scanning, progress, results, error, runScan }
}