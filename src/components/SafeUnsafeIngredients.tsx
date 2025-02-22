'use client'

import React, { useState } from 'react'
import { useSafeUnsafeIngredients } from '@/hooks/useSafeUnsafeIngredients'
import type { Ingredient } from '@/types'

type Tab = 'safe' | 'unsafe'

export default function SafeUnsafeIngredients() {
  const [activeTab, setActiveTab] = useState<Tab>('safe')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { safeIngredients, unsafeIngredients, removeSafeIngredient, removeUnsafeIngredient } = useSafeUnsafeIngredients()

  const renderIngredientList = (ingredients: Ingredient[] | null, onRemove: (id: number) => Promise<void>) => {
    if (!ingredients?.length) {
      return (
        <div className="text-dark-secondary text-sm py-4">
          No ingredients in this list
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {ingredients.map((ingredient) => {
          return (
            <div
              key={ingredient.id}
              className="group flex items-center justify-between p-3 bg-dark-elevated rounded-lg"
            >
              <span className="text-dark-primary">
                {ingredient.name || `Ingredient ${ingredient.id}`}
              </span>
              <button
                onClick={() => onRemove(ingredient.id)}
                className="p-1 text-dark-secondary hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="p-6 bg-dark-base rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-dark-primary font-medium">Food & Drink Tracker</h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-dark-secondary hover:text-dark-primary transition-colors rounded-full hover:bg-dark-elevated"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12M6 12h12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h12" />
            )}
          </svg>
        </button>
      </div>
      
      <div className={`transition-all duration-300 ${isCollapsed ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'}`}>
        <div className="flex space-x-4 border-b border-dark-elevated">
          <button
            onClick={() => setActiveTab('safe')}
            className={`pb-2 px-4 text-sm font-medium transition-colors ${
              activeTab === 'safe'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-dark-secondary hover:text-dark-primary'
            }`}
          >
            Safe
          </button>
          <button
            onClick={() => setActiveTab('unsafe')}
            className={`pb-2 px-4 text-sm font-medium transition-colors ${
              activeTab === 'unsafe'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-dark-secondary hover:text-dark-primary'
            }`}
          >
            Unsafe
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'safe' ? (
            renderIngredientList(safeIngredients, removeSafeIngredient)
          ) : (
            renderIngredientList(unsafeIngredients, removeUnsafeIngredient)
          )}
        </div>
      </div>
    </div>
  )
}
