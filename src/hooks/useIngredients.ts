'use client'

import { useState, useEffect } from 'react'
import type { Ingredient } from '@/types'
import * as api from '@/lib/api'
import { handleError } from '@/lib/errorHandling'

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadIngredients = async () => {
      setIsLoading(true)
      try {
        const response = await api.getIngredients()
        if (response.error) {
          setError('Failed to load ingredients')
          handleError(response.error, 'Failed to load ingredients')
        } else {
          setIngredients(response.data || [])
          setError(null)
        }
      } catch (err) {
        setError('Failed to load ingredients')
        handleError(err, 'Failed to load ingredients')
      } finally {
        setIsLoading(false)
      }
    }

    loadIngredients()
  }, [])

  const addIngredient = async (name: string): Promise<Ingredient> => {
    try {
      const response = await api.createIngredient(name)
      if (response.error) {
        handleError(response.error, 'Failed to add ingredient')
        // Return a default ingredient to avoid breaking the UI
        return { id: -1, name: name }
      }
      
      const newIngredient = response.data as Ingredient
      setIngredients(prev => [...prev, newIngredient])
      return newIngredient
    } catch (err) {
      handleError(err, 'Failed to add ingredient')
      // Return a default ingredient to avoid breaking the UI
      return { id: -1, name: name }
    }
  }

  const filteredIngredients = ingredients.filter(ingredient => {
    // Add null checks to prevent toLowerCase errors
    if (!ingredient || !ingredient.name || !searchTerm) return false
    return ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return {
    ingredients,
    filteredIngredients,
    searchTerm,
    setSearchTerm,
    addIngredient,
    isLoading,
    error
  }
}
