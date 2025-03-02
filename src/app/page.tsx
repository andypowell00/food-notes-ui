'use client'

import { useState, useEffect } from "react"
import DayView from '@/components/DayView'
import Calendar from '@/components/Calendar'
import SafeUnsafeIngredients from '@/components/SafeUnsafeIngredients'
import type { Entry } from "@/types"
import { createEntry, getEntries } from "@/lib/api"
import { handleError } from "@/lib/errorHandling"

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const response = await getEntries()
        if (response.error) {
          handleError(response.error, 'Failed to load entries')
          setEntries([])
        } else {
          setEntries(response.data || [])
        }
      } catch (error) {
        handleError(error, 'Failed to load entries')
        setEntries([])
      } finally {
        setLoading(false)
      }
    }
    loadEntries()
  }, [])

  const handleCreateEntry = async (date: Date) => {
    try {
      const response = await createEntry(date)
      if (response.error) {
        handleError(response.error, 'Failed to create entry')
        return null
      }
      
      const newEntry = response.data as Entry
      setEntries(prev => [...prev, newEntry])
      return newEntry
    } catch (error) {
      handleError(error, 'Failed to create entry')
      return null
    }
  }

  const currentEntry = selectedDate 
    ? entries.find(e => new Date(e.date).toDateString() === selectedDate.toDateString())
    : undefined

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-base text-dark-primary flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-base text-dark-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <div className="space-y-8">
                <div className="bg-dark-surface rounded-xl shadow-soft p-4">
                  <Calendar 
                    entries={entries}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                  />
                </div>
                <div className="bg-dark-surface rounded-xl shadow-soft p-6">
                  <SafeUnsafeIngredients />
                </div>
              </div>
            </div>
            <div className="lg:col-span-8">
              {selectedDate && (
                <div className="bg-dark-surface rounded-xl shadow-soft p-6">
                  <DayView 
                    date={selectedDate}
                    entry={currentEntry}
                    onCreateEntry={handleCreateEntry}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
