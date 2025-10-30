'use client'

import { useState, useEffect } from 'react'
import * as api from '@/lib/api'
import type { EntryMealDetail } from '@/types'
import { handleError } from '@/lib/errorHandling'

export function useEntryMeals(entryId?: number) {
  const [entryMeals, setEntryMeals] = useState<EntryMealDetail[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadEntryMeals = async () => {
      if (!entryId) return

      setIsLoading(true)
      try {
        const response = await api.getEntryMeals(entryId)
        if (response.error) {
          setError('Failed to load entry meals')
          handleError(response.error, 'Failed to load entry meals')
          setEntryMeals([])
          return
        }

        // response.data is expected to be an array of EntryMealDetail
        setEntryMeals(response.data || [])
      } catch (err) {
        setError('Failed to load entry meals')
        handleError(err, 'Failed to load entry meals')
      } finally {
        setIsLoading(false)
      }
    }

    loadEntryMeals()
  }, [entryId])

  const addMealToEntry = async (mealId: number) => {
    if (!entryId) return false

    try {
      const response = await api.addEntryMeal({ entryId, mealId })
      if (response.error) {
        handleError(response.error, 'Failed to add meal to entry')
        return false
      }

      // refresh authoritative list from server
      const refreshed = await api.getEntryMeals(entryId)
      if (!refreshed.error) setEntryMeals(refreshed.data || [])
      return true
    } catch (err) {
      handleError(err, 'Failed to add meal to entry')
      return false
    }
  }

  const removeMealFromEntry = async (mealId: number) => {
    if (!entryId) return false

    try {
      const response = await api.deleteEntryMeal(entryId, mealId)
      if (response.error) {
        handleError(response.error, 'Failed to remove meal from entry')
        return false
      }

      // refresh authoritative list from server
      const refreshed = await api.getEntryMeals(entryId)
      if (!refreshed.error) setEntryMeals(refreshed.data || [])
      return true
    } catch (err) {
      handleError(err, 'Failed to remove meal from entry')
      return false
    }
  }

  return {
    entryMeals,
    addMealToEntry,
    removeMealFromEntry,
    // allow consumers to refresh
    reload: async () => {
      if (!entryId) return
      const refreshed = await api.getEntryMeals(entryId)
      if (!refreshed.error) setEntryMeals(refreshed.data || [])
    },
    isLoading,
    error
  }
}
