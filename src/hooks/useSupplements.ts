import { useState, useEffect } from 'react'
import { Supplement } from '@/types'
import * as api from '@/lib/api'
import { handleError } from '@/lib/errorHandling'

export function useSupplements() {
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSupplements = async () => {
      setIsLoading(true)
      try {
        const response = await api.getSupplements()
        if (response.error) {
          setError('Failed to load supplements')
          handleError(response.error, 'Failed to load supplements')
          return
        }
        setSupplements(response.data || [])
        setError(null)
      } catch (err) {
        setError('Failed to load supplements')
        handleError(err, 'Failed to load supplements')
      } finally {
        setIsLoading(false)
      }
    }

    loadSupplements()
  }, [])

  const addSupplement = async (name: string): Promise<Supplement> => {
    try {
      const response = await api.createSupplement(name)
      if (response.error) {
        handleError(response.error, 'Failed to add supplement')
        // Return a default supplement to avoid breaking the UI
        return { id: -1, name: name }
      }
      const newSupplement = response.data
      if (!newSupplement) {
        handleError(new Error('No data returned'), 'Failed to add supplement')
        // Return a default supplement to avoid breaking the UI
        return { id: -1, name: name }
      }
      setSupplements(prev => [...prev, newSupplement])
      return newSupplement
    } catch (err) {
      setError('Failed to add supplement')
      handleError(err, 'Failed to add supplement')
      // Return a default supplement to avoid breaking the UI
      return { id: -1, name: name }
    }
  }

  const deleteSupplement = async (id: number): Promise<void> => {
    try {
      const response = await api.deleteSupplement(id)
      if (response.error) {
        handleError(response.error, 'Failed to delete supplement')
        return
      }
      setSupplements(prev => prev.filter(supplement => supplement.id !== id))
    } catch (err) {
      setError('Failed to delete supplement')
      handleError(err, 'Failed to delete supplement')
    }
  }

  const filteredSupplements = supplements.filter(supplement => {
    // Add null checks to prevent toLowerCase errors
    if (!supplement || !supplement.name || !searchTerm) return false
    return supplement.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return {
    supplements: filteredSupplements,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    addSupplement,
    deleteSupplement
  }
}
