import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

const REVIEW_DEMO_PATH_PREFIX = 'demo-review'

function photoKey(photo) {
  return photo.filename
}

function photoPath(photo) {
  return `${REVIEW_DEMO_PATH_PREFIX}/${photo.filename}`
}

export function useReviewDecisions(reviewPhotos) {
  const { user } = useAuth()
  const [photoRowsByKey, setPhotoRowsByKey] = useState({})
  const [decisionsByKey, setDecisionsByKey] = useState({})
  const [cleanupQueueKeys, setCleanupQueueKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const photosByPath = useMemo(() => {
    return reviewPhotos.reduce((map, photo) => {
      map[photoPath(photo)] = photo
      return map
    }, {})
  }, [reviewPhotos])

  const loadReviewState = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const paths = reviewPhotos.map(photoPath)
      const { data: existingPhotos, error: photosError } = await supabase
        .from('photos')
        .select('id, file_name, file_path')
        .eq('user_id', user.id)
        .in('file_path', paths)

      if (photosError) throw photosError

      const existingPathSet = new Set((existingPhotos ?? []).map(photo => photo.file_path))
      const missingPhotos = reviewPhotos
        .filter(photo => !existingPathSet.has(photoPath(photo)))
        .map(photo => ({
          user_id: user.id,
          file_name: photo.filename,
          file_path: photoPath(photo),
          mime_type: photo.filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
          metadata: {
            source: 'review_demo',
            recommendation: photo.reason,
          },
        }))

      let insertedPhotos = []
      if (missingPhotos.length > 0) {
        const { data, error: insertError } = await supabase
          .from('photos')
          .insert(missingPhotos)
          .select('id, file_name, file_path')

        if (insertError) throw insertError
        insertedPhotos = data ?? []
      }

      const allPhotos = [...(existingPhotos ?? []), ...insertedPhotos]
      const rowsByKey = allPhotos.reduce((map, row) => {
        const sourcePhoto = photosByPath[row.file_path]
        if (sourcePhoto) map[photoKey(sourcePhoto)] = row
        return map
      }, {})

      setPhotoRowsByKey(rowsByKey)

      const photoIds = Object.values(rowsByKey).map(row => row.id)
      if (photoIds.length === 0) {
        setDecisionsByKey({})
        setCleanupQueueKeys([])
        return
      }

      const [{ data: decisions, error: decisionsError }, { data: queueItems, error: queueError }] = await Promise.all([
        supabase
          .from('user_decisions')
          .select('*')
          .eq('user_id', user.id)
          .in('photo_id', photoIds),
        supabase
          .from('cleanup_queue_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'queued')
          .in('photo_id', photoIds),
      ])

      if (decisionsError) throw decisionsError
      if (queueError) throw queueError

      const keyByPhotoId = Object.entries(rowsByKey).reduce((map, [key, row]) => {
        map[row.id] = key
        return map
      }, {})

      setDecisionsByKey((decisions ?? []).reduce((map, decision) => {
        const key = keyByPhotoId[decision.photo_id]
        if (key) map[key] = decision
        return map
      }, {}))

      setCleanupQueueKeys((queueItems ?? [])
        .map(item => keyByPhotoId[item.photo_id])
        .filter(Boolean))
    } catch (err) {
      setError(err.message || 'Could not load review decisions.')
    } finally {
      setLoading(false)
    }
  }, [photosByPath, reviewPhotos, user])

  useEffect(() => {
    loadReviewState()
  }, [loadReviewState])

  const saveDecision = useCallback(async (photo, decision, note) => {
    if (!user) return { error: new Error('Please log in to save review decisions.') }

    const key = photoKey(photo)
    const photoRow = photoRowsByKey[key]
    if (!photoRow) return { error: new Error('Review photo is not ready yet. Please try again.') }

    const previousDecisions = decisionsByKey
    const previousQueueKeys = cleanupQueueKeys
    const now = new Date().toISOString()

    setError('')
    setDecisionsByKey(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] ?? {}),
        user_id: user.id,
        photo_id: photoRow.id,
        decision,
        note: note ?? null,
        decided_at: now,
      },
    }))

    if (decision === 'remove') {
      setCleanupQueueKeys(prev => (prev.includes(key) ? prev : [...prev, key]))
    }

    if (decision === 'undo') {
      setCleanupQueueKeys(prev => prev.filter(item => item !== key))
    }

    try {
      const { error: decisionError } = await supabase
        .from('user_decisions')
        .upsert(
          {
            user_id: user.id,
            photo_id: photoRow.id,
            decision,
            note: note ?? null,
            decided_at: now,
          },
          { onConflict: 'photo_id,user_id' }
        )

      if (decisionError) throw decisionError

      if (decision === 'remove') {
        const { error: queueError } = await supabase
          .from('cleanup_queue_items')
          .upsert(
            {
              user_id: user.id,
              photo_id: photoRow.id,
              status: 'queued',
              queued_at: now,
              updated_at: now,
            },
            { onConflict: 'photo_id,user_id' }
          )

        if (queueError) throw queueError
      }

      if (decision === 'undo') {
        const { error: deleteError } = await supabase
          .from('cleanup_queue_items')
          .delete()
          .eq('user_id', user.id)
          .eq('photo_id', photoRow.id)

        if (deleteError) throw deleteError
      }

      return { error: null }
    } catch (err) {
      setDecisionsByKey(previousDecisions)
      setCleanupQueueKeys(previousQueueKeys)
      setError(err.message || 'Could not save your review decision. Please try again.')
      return { error: err }
    }
  }, [cleanupQueueKeys, decisionsByKey, photoRowsByKey, user])

  const cleanupQueue = useMemo(() => {
    return reviewPhotos.filter(photo => cleanupQueueKeys.includes(photoKey(photo)))
  }, [cleanupQueueKeys, reviewPhotos])

  return {
    decisions: decisionsByKey,
    cleanupQueue,
    loading,
    error,
    clearError: () => setError(''),
    saveDecision,
    refresh: loadReviewState,
  }
}
