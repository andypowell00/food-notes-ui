'use client'

import { useState, useEffect } from 'react'
import type { Symptom } from '@/types'
import * as api from '@/lib/api'

export function useSymptoms() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSymptoms = async () => {
      setIsLoading(true)
      try {
        const data = await api.getSymptoms()
        setSymptoms(data)
        setError(null)
      } catch (err) {
        setError('Failed to load symptoms')
        console.error('Error loading symptoms:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSymptoms()
  }, [])

  const addSymptom = async (title: string): Promise<Symptom> => {
    try {
      const newSymptom = await api.createSymptom(title)
      setSymptoms(prev => [...prev, newSymptom])
      return newSymptom
    } catch (err) {
      console.error('Error adding symptom:', err)
      throw new Error('Failed to add symptom')
    }
  }

  const filteredSymptoms = symptoms.filter(symptom =>
    symptom.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
