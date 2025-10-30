'use client'

import { useState, useEffect } from 'react'
import * as api from '@/lib/api'
import type { Meal } from '@/types'
import { handleError } from '@/lib/errorHandling'

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMeals = async () => {
      setIsLoading(true)
      try {
        const response = await api.getMeals()
        if (response.error) {
          setError('Failed to load meals')
          handleError(response.error, 'Failed to load meals')
        } else {
          // Fetch ingredients for each meal if not already present
          const mealsWithIngredients = await Promise.all(
            (response.data || []).map(async (meal: Meal) => {
              // If meal.ingredients is missing or empty, fetch it
              if (!meal.ingredients || meal.ingredients.length === 0) {
                try {
                  // Try to fetch ingredients for this meal
                  const res = await api.getMeals(); // fallback: get all meals (API may need a getMealById)
                  const found = res.data?.find((m: Meal) => m.id === meal.id)
                  if (found && found.ingredients) {
                    return { ...meal, ingredients: found.ingredients }
                  }
                } catch (e) {
                  // fallback: just return meal as-is
                }
              }
              return meal
            })
          )
          setMeals(mealsWithIngredients)
          setError(null)
        }
      } catch (err) {
        setError('Failed to load meals')
        handleError(err, 'Failed to load meals')
      } finally {
        setIsLoading(false)
      }
    }

    loadMeals()
  }, [])

  const addMeal = async (name: string) => {
    try {
      const response = await api.createMeal({ name, ingredientIds: [] })
      if (response.error) {
        handleError(response.error, 'Failed to add meal')
        return { id: -1, name, ingredients: [] } as Meal
      }

      const newMeal = response.data as Meal
      setMeals(prev => [...prev, newMeal])
      return newMeal
    } catch (err) {
      handleError(err, 'Failed to add meal')
      return { id: -1, name, ingredients: [] } as Meal
    }
  }

  const addIngredientToMeal = async (mealId: number, ingredientId: number) => {
    try {
      const response = await api.addMealIngredient(mealId, ingredientId)
      if (response.error) {
        handleError(response.error, 'Failed to add ingredient to meal')
        return false
      }

      // Optimistically update local meal ingredients
      setMeals(prev => prev.map(m => m.id === mealId ? { ...m, ingredients: [...(m.ingredients || []), { id: ingredientId, name: '' }] } : m))
      return true
    } catch (err) {
      handleError(err, 'Failed to add ingredient to meal')
      return false
    }
  }

  const removeIngredientFromMeal = async (mealId: number, ingredientId: number) => {
    try {
      const response = await api.deleteMealIngredient(mealId, ingredientId)
      if (response.error) {
        handleError(response.error, 'Failed to remove ingredient from meal')
        return false
      }

      setMeals(prev => prev.map(m => m.id === mealId ? { ...m, ingredients: (m.ingredients || []).filter(i => i.id !== ingredientId) } : m))
      return true
    } catch (err) {
      handleError(err, 'Failed to remove ingredient from meal')
      return false
    }
  }

  return {
    meals,
    searchTerm,
    setSearchTerm,
    addMeal,
    addIngredientToMeal,
    removeIngredientFromMeal,
    isLoading,
    error
  }
}
