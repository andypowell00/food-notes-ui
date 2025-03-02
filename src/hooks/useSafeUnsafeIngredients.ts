'use client'

import { useState, useEffect } from 'react'
import { Ingredient } from '@/types'
import * as api from '@/lib/api'
import { handleError } from '@/lib/errorHandling'

interface SafeUnsafeIngredientResponse {
  id: number
  ingredientId: number
  ingredient: Ingredient
}

export function useSafeUnsafeIngredients() {
  const [safeIngredients, setSafeIngredients] = useState<Ingredient[]>([])
  const [unsafeIngredients, setUnsafeIngredients] = useState<Ingredient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadIngredients = async () => {
      setIsLoading(true)
      try {
        const [safeResponse, unsafeResponse] = await Promise.all([
          api.getSafeIngredients(),
          api.getUnsafeIngredients()
        ])

        // Check for API errors
        if (safeResponse.error) {
          handleError(safeResponse.error, 'Error loading safe ingredients')
          setError('Failed to load safe ingredients')
        } else if (unsafeResponse.error) {
          handleError(unsafeResponse.error, 'Error loading unsafe ingredients')
          setError('Failed to load unsafe ingredients')
        } else {
          // Helper to process response that could be either format
          const processResponse = (response: { data?: Ingredient[] | SafeUnsafeIngredientResponse[] }): Ingredient[] => {
            if (!response || !response.data) return []
            const data = response.data
            
            if (!Array.isArray(data)) return []
            if (data.length === 0) return []
            
            // Check if it's the nested format
            if (data.length > 0 && 'ingredient' in data[0]) {
              return (data as SafeUnsafeIngredientResponse[])
                .map(item => item.ingredient)
                .filter((ing, index, self) => 
                  index === self.findIndex(i => i.id === ing.id)
                )
            }
            
            // It's already Ingredient[]
            return data as Ingredient[]
          }

          setSafeIngredients(processResponse(safeResponse))
          setUnsafeIngredients(processResponse(unsafeResponse))
          setError(null)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError('Failed to load safe/unsafe ingredients')
        handleError(err, 'Failed to load safe/unsafe ingredients: ' + errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadIngredients()
  }, [])

  const markAsSafe = async (ingredientId: number) => {
    try {
      await api.markIngredientAsSafe(ingredientId)
      const ingredient = unsafeIngredients.find(i => i.id === ingredientId)
      if (ingredient) {
        setUnsafeIngredients(prev => prev.filter(i => i.id !== ingredientId))
        setSafeIngredients(prev => [...prev, ingredient])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError('Failed to mark ingredient as safe')
      handleError(err, 'Failed to mark ingredient as safe: ' + errorMessage)
    }
  }

  const markAsUnsafe = async (ingredientId: number) => {
    try {
      await api.markIngredientAsUnsafe(ingredientId)
      const ingredient = safeIngredients.find(i => i.id === ingredientId)
      if (ingredient) {
        setSafeIngredients(prev => prev.filter(i => i.id !== ingredientId))
        setUnsafeIngredients(prev => [...prev, ingredient])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError('Failed to mark ingredient as unsafe')
      handleError(err, 'Failed to mark ingredient as unsafe: ' + errorMessage)
    }
  }

  const removeSafeIngredient = async (ingredientId: number) => {
    try {
      await api.removeSafeIngredient(ingredientId)
      setSafeIngredients(prev => prev.filter(i => i.id !== ingredientId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError('Failed to remove safe ingredient')
      handleError(err, 'Failed to remove safe ingredient: ' + errorMessage)
    }
  }

  const removeUnsafeIngredient = async (ingredientId: number) => {
    try {
      await api.removeUnsafeIngredient(ingredientId)
      setUnsafeIngredients(prev => prev.filter(i => i.id !== ingredientId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError('Failed to remove unsafe ingredient')
      handleError(err, 'Failed to remove unsafe ingredient: ' + errorMessage)
    }
  }

  return {
    safeIngredients,
    unsafeIngredients,
    markAsSafe,
    markAsUnsafe,
    removeSafeIngredient,
    removeUnsafeIngredient,
    isLoading,
    error
  }
}
