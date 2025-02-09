'use client'

import { useState, useEffect } from 'react'
import * as api from '@/lib/api'
import type { EntrySymptom } from '@/types'
import { fetchWithApiKey, API_BASE_URL } from '@/lib/api'

export function useEntrySymptoms(entryId?: number) {
  const [entrySymptoms, setEntrySymptoms] = useState<EntrySymptom[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadEntrySymptoms = async () => {
      if (!entryId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchWithApiKey(`${API_BASE_URL}/entry-symptoms/by-entry/${entryId}`)
        
        // Check if response is ok
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response text:', errorText)
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
        }

        // If response is empty or 204, set empty array
        if (response.status === 204 || response.headers.get('content-length') === '0') {
          setEntrySymptoms([])
          return
        }

        // Try to parse JSON, with fallback
        try {
          const data = await response.json()
          setEntrySymptoms(data)
        } catch (jsonError) {
          console.warn('Response is not valid JSON, setting empty array', jsonError)
          setEntrySymptoms([])
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load entry symptoms'
        setError(errorMessage)
        console.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadEntrySymptoms()
  }, [entryId])

  const addSymptom = async ({ symptomId, notes }: { symptomId: number, notes: string }) => {
    if (!entryId) return

    try {
      await api.addEntrySymptom(entryId, symptomId, notes)
      setEntrySymptoms(prev => [...prev, { entryId, symptomId, notes }])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add symptom to entry'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const removeSymptom = async (symptomId: number) => {
    if (!entryId) return

    try {
      await api.removeEntrySymptom(entryId, symptomId)
      setEntrySymptoms(prev => prev.filter(es => es.symptomId !== symptomId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove symptom from entry'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateNotes = async (symptomId: number, notes: string) => {
    if (!entryId) return

    try {
      const response = await fetchWithApiKey(`${API_BASE_URL}/entry-symptoms/${entryId}/${symptomId}`, {
        method: 'PUT',
        body: JSON.stringify({ notes })
      })

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response text:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      // If response is a 204 No Content or similar, just update local state
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        setEntrySymptoms(prev => prev.map(es => 
          es.symptomId === symptomId 
            ? { ...es, notes } 
            : es
        ))
        return
      }

      // Update local state directly
      setEntrySymptoms(prev => prev.map(es => 
        es.symptomId === symptomId 
          ? { ...es, notes } 
          : es
      ))

      return
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update symptom notes'
      console.error('Full error:', err)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    entrySymptoms,
    addSymptom,
    removeSymptom,
    updateNotes,
    error,
    isLoading
  }
}
