'use client'

import { useState, useEffect } from 'react'
import * as api from '@/lib/api'
import type { EntrySupplement } from '@/types'
import { handleError } from '@/lib/errorHandling'

export function useEntrySupplements(entryId?: number) {
  const [entrySupplements, setEntrySupplements] = useState<EntrySupplement[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadEntrySupplements = async () => {
      if (!entryId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await api.getEntrySupplements(entryId)
        
        if (response.error) {
          setError('Failed to load supplements')
          handleError(response.error, 'Failed to load supplements')
          return
        }

        setEntrySupplements(response.data || [])
      } catch (err) {
        setError('Failed to load supplements')
        handleError(err, 'Failed to load supplements')
      } finally {
        setIsLoading(false)
      }
    }

    loadEntrySupplements()
  }, [entryId])

  const addSupplement = async (supplementId: number) => {
    if (!entryId) return

    try {
      const response = await api.addEntrySupplement(entryId, supplementId)
      
      if (response.error) {
        setError('Failed to add supplement')
        handleError(response.error, 'Failed to add supplement')
        return
      }

      setEntrySupplements(prev => [...prev, { entryId, supplementId }])
      setError(null)
    } catch (err) {
      setError('Failed to add supplement')
      handleError(err, 'Failed to add supplement')
    }
  }

  const removeSupplement = async (supplementId: number) => {
    if (!entryId) return

    try {
      const response = await api.removeEntrySupplement(entryId, supplementId)
      
      if (response.error) {
        setError('Failed to remove supplement')
        handleError(response.error, 'Failed to remove supplement')
        return
      }

      setEntrySupplements(prev => prev.filter(es => es.supplementId !== supplementId))
      setError(null)
    } catch (err) {
      setError('Failed to remove supplement')
      handleError(err, 'Failed to remove supplement')
    }
  }

  return {
    entrySupplements,
    addSupplement,
    removeSupplement,
    error,
    isLoading
  }
}
