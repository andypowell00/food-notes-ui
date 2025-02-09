'use client'

import { useState, useEffect } from 'react'
import * as api from '@/lib/api'
import type { EntryIngredient } from '@/types'
import { fetchWithApiKey, API_BASE_URL } from '@/lib/api'

export function useEntryIngredients(entryId?: number) {
  const [entryIngredients, setEntryIngredients] = useState<EntryIngredient[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadEntryIngredients = async () => {
      if (!entryId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchWithApiKey(`${API_BASE_URL}/entry-ingredients/by-entry/${entryId}`)
        
        // Check if response is ok
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response text:', errorText)
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
        }

        // If response is empty or 204, set empty array
        if (response.status === 204 || response.headers.get('content-length') === '0') {
          setEntryIngredients([])
          return
        }

        // Try to parse JSON, with fallback
        try {
          const data = await response.json()
          setEntryIngredients(data)
        } catch (jsonError) {
          console.warn('Response is not valid JSON, setting empty array', jsonError)
          setEntryIngredients([])
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load entry ingredients'
        setError(errorMessage)
        console.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadEntryIngredients()
  }, [entryId])

  const addIngredient = async ({ ingredientId, notes }: { ingredientId: number, notes: string }) => {
    if (!entryId) return

    try {
      await api.addEntryIngredient(entryId, ingredientId, notes)
      setEntryIngredients(prev => [...prev, { entryId, ingredientId, notes }])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add ingredient to entry'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const removeIngredient = async (ingredientId: number) => {
    if (!entryId) return

    try {
      await api.deleteEntryIngredient(entryId, ingredientId)
      setEntryIngredients(prev => prev.filter(ei => ei.ingredientId !== ingredientId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove ingredient from entry'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateNotes = async (ingredientId: number, notes: string) => {
    if (!entryId) return

    try {
      const response = await fetchWithApiKey(`${API_BASE_URL}/entry-ingredients/${entryId}/${ingredientId}`, {
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
        setEntryIngredients(prev => prev.map(ei => 
          ei.ingredientId === ingredientId 
            ? { ...ei, notes } 
            : ei
        ))
        return
      }

      // Update local state directly
      setEntryIngredients(prev => prev.map(ei => 
        ei.ingredientId === ingredientId 
          ? { ...ei, notes } 
          : ei
      ))

      return
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update ingredient notes'
      console.error('Full error:', err)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    entryIngredients,
    addIngredient,
    removeIngredient,
    updateNotes,
    error,
    isLoading
  }
}
