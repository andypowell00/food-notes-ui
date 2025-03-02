'use client'

import { useState, useEffect } from 'react'
import * as api from '@/lib/api'
import type { EntryIngredient } from '@/types'
import { handleError } from '@/lib/errorHandling'

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
        const response = await api.getEntryIngredients(entryId)
        
        if (response.error) {
          setError('Failed to load ingredients')
          handleError(response.error, 'Failed to load ingredients')
          setEntryIngredients([])
          return
        }

        setEntryIngredients(response.data || [])
      } catch (err) {
        setError('Failed to load ingredients')
        handleError(err, 'Failed to load ingredients')
      } finally {
        setIsLoading(false)
      }
    }

    loadEntryIngredients()
  }, [entryId])

  const addIngredient = async ({ ingredientId, notes }: { ingredientId: number, notes: string }) => {
    if (!entryId) return

    try {
      const response = await api.addEntryIngredient(entryId, ingredientId, notes)
      if (response.error) {
        handleError(response.error, 'Failed to add ingredient')
        setError('Failed to add ingredient')
        return
      }
      
      setEntryIngredients(prev => [...prev, { entryId, ingredientId, notes }])
      setError(null)
    } catch (err) {
      handleError(err, 'Failed to add ingredient')
      setError('Failed to add ingredient')
    }
  }

  const removeIngredient = async (ingredientId: number) => {
    if (!entryId) return

    try {
      const response = await api.deleteEntryIngredient(entryId, ingredientId)
      if (response.error) {
        handleError(response.error, 'Failed to remove ingredient')
        setError('Failed to remove ingredient')
        return
      }
      
      setEntryIngredients(prev => prev.filter(ei => ei.ingredientId !== ingredientId))
      setError(null)
    } catch (err) {
      handleError(err, 'Failed to remove ingredient')
      setError('Failed to remove ingredient')
    }
  }

  const updateNotes = async (ingredientId: number, notes: string) => {
    if (!entryId) return

    try {
      const response = await api.updateEntryIngredientNotes(entryId, ingredientId, notes)
      if (response.error) {
        handleError(response.error, 'Failed to update notes')
        setError('Failed to update notes')
        return
      }
      
      setEntryIngredients(prev => prev.map(ei => 
        ei.ingredientId === ingredientId 
          ? { ...ei, notes } 
          : ei
      ))
      setError(null)
    } catch (err) {
      handleError(err, 'Failed to update notes')
      setError('Failed to update notes')
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
