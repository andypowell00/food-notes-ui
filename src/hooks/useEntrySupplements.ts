import { useState, useEffect } from 'react'
import { EntrySupplement } from '@/types'
import * as api from '@/lib/api'

export function useEntrySupplements(entryId?: number) {
  const [entrySupplements, setEntrySupplements] = useState<EntrySupplement[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadEntrySupplements = async () => {
      if (!entryId) return
      setIsLoading(true)
      try {
        const data = await api.getEntrySupplements(entryId)
        setEntrySupplements(data)
        setError(null)
      } catch (err) {
        setError('Failed to load supplements')
        console.error('Error loading supplements:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadEntrySupplements()
  }, [entryId])

  const addSupplement = async ({ supplementId }: { supplementId: number }) => {
    if (!entryId) return
    try {
      const newEntrySupplement = await api.addEntrySupplement(entryId, supplementId)
      setEntrySupplements(prev => [...prev, newEntrySupplement])
      setError(null)
    } catch (err) {
      setError('Failed to add supplement')
      console.error('Error adding supplement:', err)
      throw err
    }
  }

  const removeSupplement = async (supplementId: number) => {
    if (!entryId) return
    try {
      await api.removeEntrySupplement(entryId, supplementId)
      setEntrySupplements(prev => prev.filter(es => es.supplementId !== supplementId))
      setError(null)
    } catch (err) {
      setError('Failed to remove supplement')
      console.error('Error removing supplement:', err)
      throw err
    }
  }

  return {
    entrySupplements,
    isLoading,
    error,
    addSupplement,
    removeSupplement
  }
}
