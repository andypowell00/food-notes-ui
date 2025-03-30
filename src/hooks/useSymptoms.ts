'use client'

import { useState, useEffect } from 'react'
import type { Symptom } from '@/types'
import * as api from '@/lib/api'
import { handleError } from '@/lib/errorHandling'

export function useSymptoms() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSymptoms = async () => {
      setIsLoading(true)
      try {
        const response = await api.getSymptoms()
        if (response.error) {
          setError('Failed to load symptoms')
          handleError(response.error, 'Failed to load symptoms')
          return
        }
        setSymptoms(response.data || [])
        setError(null)
      } catch (err) {
        setError('Failed to load symptoms')
        handleError(err, 'Failed to load symptoms')
      } finally {
        setIsLoading(false)
      }
    }

    loadSymptoms()
  }, [])

  const addSymptom = async (title: string): Promise<Symptom> => {
    try {
      const response = await api.createSymptom(title)
      if (response.error) {
        handleError(response.error, 'Failed to add symptom')
        // Return a default symptom to avoid breaking the UI
        return { id: -1, title: title }
      }
      const newSymptom = response.data
      if (!newSymptom) {
        handleError(new Error('No data returned'), 'Failed to add symptom')
        // Return a default symptom to avoid breaking the UI
        return { id: -1, title: title }
      }
      setSymptoms(prev => [...prev, newSymptom])
      return newSymptom
    } catch (err) {
      handleError(err, 'Failed to add symptom')
      // Return a default symptom to avoid breaking the UI
      return { id: -1, title: title }
    }
  }

  const filteredSymptoms = symptoms.filter(symptom => {
    // Add null checks to prevent toLowerCase errors
    if (!symptom || !symptom.title || !searchTerm) return false
    return symptom.title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return {
    symptoms,
    filteredSymptoms,
    searchTerm,
    setSearchTerm,
    addSymptom,
    isLoading,
    error
  }
}
