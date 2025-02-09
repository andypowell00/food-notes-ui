'use client'

import { useState, useEffect } from 'react'
import type { Ingredient } from '@/types'
import * as api from '@/lib/api'

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadIngredients = async () => {
      setIsLoading(true)
      try {
        const data = await api.getIngredients()
        setIngredients(data)
        setError(null)
      } catch (err) {
        setError('Failed to load ingredients')
        console.error('Error loading ingredients:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadIngredients()
  }, [])

  const addIngredient = async (name: string): Promise<Ingredient> => {
    try {
      const newIngredient = await api.createIngredient(name)
      setIngredients(prev => [...prev, newIngredient])
      return newIngredient
    } catch (err) {
      throw new Error('Failed to add ingredient')
    }
  }

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
