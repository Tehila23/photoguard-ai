import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
 
const BUCKET = 'photos'
 
// ─── Storage helpers ──────────────────────────────────────────
 
async function uploadToStorage(file, userId) {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${crypto.randomUUID()}.${ext}`
 
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false })
 
  if (error) throw error
  return path
}
 
async function removeFromStorage(filePath) {
  const { error } = await supabase.storage.from(BUCKET).remove([filePath])
  if (error) throw error
}
 
// ─── Image dimensions helper ──────────────────────────────────
 
function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = reject
    img.src = url
  })
}
 
// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────
 
export function usePhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
 
  // ─── Fetch ─────────────────────────────────────────────────
 
  const fetchPhotos = useCallback(async () => {
    setLoading(true)
    setError(null)
 
    const { data, error: fetchError } = await supabase
      .from('photos')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
 
    if (fetchError) {
      setError(fetchError.message)
    } else {
      setPhotos(data ?? [])
    }
 
    setLoading(false)
  }, [])
 
  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])
 
  // ─── Real-time subscription ────────────────────────────────
 
  useEffect(() => {
    const channel = supabase
      .channel('photos-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'photos' },
        () => fetchPhotos()
      )
      .subscribe()
 
    return () => { supabase.removeChannel(channel) }
  }, [fetchPhotos])
 
  // ─── Upload ────────────────────────────────────────────────
 
  const uploadPhoto = useCallback(async (file) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
 
      const [filePath, dimensions] = await Promise.all([
        uploadToStorage(file, user.id),
        getImageDimensions(file),
      ])
 
      const { data, error: insertError } = await supabase
        .from('photos')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type || 'image/jpeg',
          width: dimensions.width,
          height: dimensions.height,
          metadata: {},
        })
        .select()
        .single()
 
      if (insertError) throw insertError
 
      setPhotos(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [])
 
  // ─── Soft delete ───────────────────────────────────────────
 
  const deletePhoto = useCallback(async (id) => {
    try {
      const { error: updateError } = await supabase
        .from('photos')
        .update({ is_deleted: true })
        .eq('id', id)
 
      if (updateError) throw updateError
 
      const photo = photos.find(p => p.id === id)
      if (photo?.file_path) {
        await removeFromStorage(photo.file_path)
      }
 
      setPhotos(prev => prev.filter(p => p.id !== id))
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }, [photos])
 
  return {
    photos,
    loading,
    error,
    uploadPhoto,
    deletePhoto,
    refreshPhotos: fetchPhotos,
  }
}
 