import { useState, useEffect } from 'react'
import { Supplement } from '@/types'
import * as api from '@/lib/api'

export function useSupplements() {
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSupplements = async () => {
      setIsLoading(true)
      try {
        const data = await api.getSupplements()
        setSupplements(data)
        setError(null)
      } catch (err) {
        setError('Failed to load supplements')
        console.error('Error loading supplements:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSupplements()
  }, [])

  const addSupplement = async (name: string): Promise<Supplement> => {
    try {
      const newSupplement = await api.createSupplement(name)
      setSupplements(prev => [...prev, newSupplement])
      return newSupplement
    } catch (err) {
      setError('Failed to add supplement')
      console.error('Error adding supplement:', err)
      throw err
    }
  }

  const deleteSupplement = async (id: number): Promise<void> => {
    try {
      await api.deleteSupplement(id)
      setSupplements(prev => prev.filter(supplement => supplement.id !== id))
    } catch (err) {
      setError('Failed to delete supplement')
      console.error('Error deleting supplement:', err)
      throw err
    }
  }

  const filteredSupplements = supplements.filter(supplement => 
    supplement.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
