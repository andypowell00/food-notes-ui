'use client'

import React, { useState, useEffect } from 'react'

interface NotesModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  notes: string
  onSave: (notes: string) => void
}

export function NotesModal({ isOpen, onClose, title, notes, onSave }: NotesModalProps) {
  const [currentNotes, setCurrentNotes] = useState(notes)

  useEffect(() => {
    setCurrentNotes(notes)
  }, [notes])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-elevated rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-dark-primary mb-1">
              {title}
            </h2>
            <p className="text-sm text-dark-secondary">
              Add or edit notes for this item
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-dark-secondary hover:text-dark-primary p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <textarea
          value={currentNotes}
          onChange={(e) => setCurrentNotes(e.target.value)}
          placeholder="Enter notes here..."
          className="w-full h-32 p-3 bg-dark-base text-dark-primary rounded-lg mb-4 resize-none focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-dark-secondary hover:text-dark-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(currentNotes)
              onClose()
            }}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  )
}
