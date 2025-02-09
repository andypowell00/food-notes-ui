'use client'

import React, { useEffect, useRef } from 'react'

interface NotesModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  notes: string
  onSave: (notes: string) => Promise<void>
}

export const NotesModal: React.FC<NotesModalProps> = ({
  isOpen,
  onClose,
  title,
  notes: initialNotes,
  onSave,
}) => {
  const [notes, setNotes] = React.useState(initialNotes)
  const [isSaving, setIsSaving] = React.useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setNotes(initialNotes)
  }, [initialNotes])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(notes)
      onClose()
    } catch (error) {
      console.error('Failed to save notes:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-dark-elevated rounded-lg shadow-xl max-w-lg w-full p-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-dark-primary">{title}</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-32 p-2 mb-4 rounded-md bg-dark-base border-dark-border text-dark-primary placeholder-dark-secondary focus:border-primary-500 focus:ring-primary-500"
          placeholder="Add notes..."
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-dark-secondary hover:text-dark-primary transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
