'use client'

import React, { useRef, useEffect } from 'react'

interface AutocompleteProps<T> {
  id: string
  value: string
  onChange: (value: string) => void
  onSelect: (item: T) => void
  onAddNew: (value: string) => void
  items: T[]
  getItemText: (item: T) => string
  placeholder: string
  label: string
  hideLabel?: boolean
}

export function Autocomplete<T>({
  id,
  value,
  onChange,
  onSelect,
  onAddNew,
  items,
  getItemText,
  placeholder,
  label,
  hideLabel
}: AutocompleteProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => Math.min(prev + 1, items.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex === items.length) {
        onAddNew(value)
      } else if (highlightedIndex >= 0 && items[highlightedIndex]) {
        onSelect(items[highlightedIndex])
      }
      setIsOpen(false)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {!hideLabel && (
        <label 
          htmlFor={id} 
          className="block text-xs font-medium text-dark-secondary uppercase tracking-wider mb-2 animate-fade-in"
        >
          {label}
        </label>
      )}
      <input
        type="text"
        id={id}
        value={value}
        onChange={e => {
          onChange(e.target.value)
          setIsOpen(true)
          setHighlightedIndex(-1)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="block w-full rounded-xl bg-dark-elevated border border-dark-border/10 text-dark-primary 
        placeholder-dark-secondary shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500/50 
        py-3 px-4 text-sm transition-all duration-300 ease-in-out animate-slide-up
        hover:border-dark-border/30"
        placeholder={placeholder}
      />
      {isOpen && (value.trim() !== '' || items.length > 0) && (
        <div className="absolute z-10 mt-2 w-full rounded-xl bg-dark-surface shadow-medium border border-dark-border/10 overflow-hidden animate-slide-up">
          <ul className="max-h-60 py-1.5 text-sm overflow-auto focus:outline-none">
            {items.map((item, index) => (
              <li
                key={getItemText(item)}
                className={`cursor-pointer select-none relative px-4 py-3
                  ${index === highlightedIndex 
                    ? 'bg-primary-700 text-white' 
                    : 'text-dark-primary hover:bg-dark-elevated'}
                  transition-colors duration-200 ease-in-out
                  first:rounded-t-xl last:rounded-b-xl
                  group
                `}
                onClick={() => {
                  onSelect(item)
                  setIsOpen(false)
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <span>{getItemText(item)}</span>
                  <span className="text-xs text-dark-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    Select
                  </span>
                </div>
              </li>
            ))}
            {value.trim() !== '' && (
              <li
                className={`cursor-pointer select-none relative px-4 py-3
                  ${items.length === highlightedIndex 
                    ? 'bg-primary-700 text-white' 
                    : 'text-dark-primary hover:bg-dark-elevated'}
                  transition-colors duration-200 ease-in-out
                  first:rounded-t-xl last:rounded-b-xl
                  group
                `}
                onClick={() => {
                  onAddNew(value)
                  setIsOpen(false)
                }}
                onMouseEnter={() => setHighlightedIndex(items.length)}
              >
                <div className="flex items-center justify-between">
                  <span>Add "{value}"</span>
                  <span className="text-xs text-dark-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    Create
                  </span>
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
