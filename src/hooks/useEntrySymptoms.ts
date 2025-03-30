'use client'

import { useState, useEffect } from 'react'
import * as api from '@/lib/api'
import type { EntrySymptom } from '@/types'
import { fetchWithApiKey, API_BASE_URL } from '@/lib/api'
import { handleError } from '@/lib/errorHandling'

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
          const errorMessage = `HTTP error! status: ${response.status}, message: ${errorText}`
          setError(errorMessage)
          handleError(new Error(errorMessage), errorMessage)
          return
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
        handleError(err, errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadEntrySymptoms()
  }, [entryId])

  const addSymptom = async ({ symptomId, notes }: { symptomId: number, notes: string }) => {
    if (!entryId) return

    try {
      const response = await api.addEntrySymptom(entryId, symptomId, notes)
      if (response.error) {
        setError('Failed to add symptom to entry')
        handleError(response.error, 'Failed to add symptom to entry')
        return
      }
      
      // Find the symptom title from the response or from the symptoms list
      let symptomData: EntrySymptom
      
      if (response.data && response.data.symptomTitle) {
        // If API returned the new entry with title, use it directly
        symptomData = response.data
      } else {
        // Otherwise try to find the symptom by ID from all symptoms
        try {
          const symptomsResponse = await api.getSymptoms()
          const symptom = symptomsResponse.data?.find(s => s.id === symptomId)
          
          if (symptom) {
            symptomData = { 
              entryId, 
              symptomId, 
              notes,
              symptomTitle: symptom.title 
            }
          } else {
            // Fallback if we can't get the title
            symptomData = { entryId, symptomId, notes }
          }
        } catch (error) {
          // Fallback if API call fails
          setError('Failed to add symptom to entry')
          handleError(error, 'Failed to add symptom to entry')
          
          symptomData = { entryId, symptomId, notes }
        }
      }

      setEntrySymptoms(prev => [...prev, symptomData])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add symptom to entry'
      setError('Failed to add symptom to entry')
      handleError(err, errorMessage)
    }
  }

  const removeSymptom = async (symptomId: number) => {
    if (!entryId) return

    try {
      const response = await api.removeEntrySymptom(entryId, symptomId)
      if (response.error) {
        setError('Failed to remove symptom from entry')
        handleError(response.error, 'Failed to remove symptom from entry')
        return
      }
      setEntrySymptoms(prev => prev.filter(es => es.symptomId !== symptomId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove symptom from entry'
      setError('Failed to remove symptom from entry')
      handleError(err, errorMessage)
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
        const errorMessage = `HTTP error! status: ${response.status}, message: ${errorText}`
        setError('Failed to update symptom notes')
        handleError(new Error(errorMessage), 'Failed to update symptom notes')
        return
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
      setError('Failed to update symptom notes')
      handleError(err, errorMessage)
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
