import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

export const DEFAULT_MEMORY_SHIELD_CATEGORIES = ['family', 'wedding', 'pets']

export function useMemoryShieldPreferences() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState(DEFAULT_MEMORY_SHIELD_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadPreferences = useCallback(async () => {
    if (!user) {
      setPreferences([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('memory_shield_preferences')
      .select('protected_categories')
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchError) {
      setError(fetchError.message)
      setPreferences(DEFAULT_MEMORY_SHIELD_CATEGORIES)
    } else {
      setPreferences(data?.protected_categories ?? DEFAULT_MEMORY_SHIELD_CATEGORIES)
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    loadPreferences()
  }, [loadPreferences])

  const savePreferences = useCallback(async nextPreferences => {
    if (!user) return { error: new Error('Not authenticated') }

    setPreferences(nextPreferences)
    setError(null)

    const { error: upsertError } = await supabase
      .from('memory_shield_preferences')
      .upsert(
        {
          user_id: user.id,
          protected_categories: nextPreferences,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (upsertError) {
      setError(upsertError.message)
    }

    return { error: upsertError }
  }, [user])

  const togglePreference = useCallback(id => {
    const next = preferences.includes(id)
      ? preferences.filter(item => item !== id)
      : [...preferences, id]

    savePreferences(next)
  }, [preferences, savePreferences])

  const resetPreferences = useCallback(() => savePreferences([]), [savePreferences])

  return {
    preferences,
    loading,
    error,
    savePreferences,
    togglePreference,
    resetPreferences,
    refreshPreferences: loadPreferences,
  }
}
