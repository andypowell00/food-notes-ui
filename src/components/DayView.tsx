'use client'

import React from "react"
import type { Entry, Ingredient, Symptom } from "@/types"
import { useIngredients } from "@/hooks/useIngredients"
import { useSymptoms } from "@/hooks/useSymptoms"
import { useEntryIngredients } from "@/hooks/useEntryIngredients"
import { useEntrySymptoms } from "@/hooks/useEntrySymptoms"
import { Autocomplete } from "./Autocomplete"
import { NotesModal } from "./NotesModal"

interface DayViewProps {
  date: Date
  entry: Entry | undefined
  onCreateEntry: (date: Date) => Promise<Entry>
}

const DayView: React.FC<DayViewProps> = ({ date, entry, onCreateEntry }) => {
  const { ingredients, filteredIngredients, searchTerm: ingredientSearch, setSearchTerm: setIngredientSearch, addIngredient } = useIngredients()
  const { symptoms, filteredSymptoms, searchTerm: symptomSearch, setSearchTerm: setSymptomSearch, addSymptom } = useSymptoms()
  const { entryIngredients, addIngredient: addEntryIngredient, removeIngredient, updateNotes: updateIngredientNotes } = useEntryIngredients(entry?.id)
  const { entrySymptoms, addSymptom: addEntrySymptom, removeSymptom, updateNotes: updateSymptomNotes } = useEntrySymptoms(entry?.id)

  const [selectedItem, setSelectedItem] = React.useState<{ type: 'ingredient' | 'symptom', id: number, notes: string } | null>(null)

  React.useEffect(() => {
    if (selectedItem?.type === 'ingredient') {
      const ingredient = entryIngredients.find(ei => ei.ingredientId === selectedItem.id)
      if (ingredient && ingredient.notes !== selectedItem.notes) {
        setSelectedItem(prev => prev ? { ...prev, notes: ingredient.notes } : null)
      }
    } else if (selectedItem?.type === 'symptom') {
      const symptom = entrySymptoms.find(es => es.symptomId === selectedItem.id)
      if (symptom && symptom.notes !== selectedItem.notes) {
        setSelectedItem(prev => prev ? { ...prev, notes: symptom.notes } : null)
      }
    }
  }, [entryIngredients, entrySymptoms, selectedItem])

  const handleAddIngredient = async (ingredient: Ingredient) => {
    let currentEntry = entry
    if (!currentEntry) {
      currentEntry = await onCreateEntry(date)
    }
    await addEntryIngredient({
      ingredientId: ingredient.id,
      notes: ""
    })
    setIngredientSearch("")
  }

  const handleAddNewIngredient = async (name: string) => {
    const newIngredient = await addIngredient(name)
    await handleAddIngredient(newIngredient)
  }

  const handleAddSymptom = async (symptom: Symptom) => {
    let currentEntry = entry
    if (!currentEntry) {
      currentEntry = await onCreateEntry(date)
    }
    await addEntrySymptom({
      symptomId: symptom.id,
      notes: ""
    })
    setSymptomSearch("")
  }

  const handleAddNewSymptom = async (title: string) => {
    const newSymptom = await addSymptom(title)
    await handleAddSymptom(newSymptom)
  }

  const handleSaveNotes = async (notes: string) => {
    if (!selectedItem) return

    try {
      if (selectedItem.type === 'ingredient') {
        await updateIngredientNotes(selectedItem.id, notes)
      } else {
        await updateSymptomNotes(selectedItem.id, notes)
      }
    } catch (error) {
      console.error('Failed to update notes:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-dark-primary">
          {date.toLocaleDateString()}
        </h2>
        {!entry && (
          <button
            onClick={() => onCreateEntry(date)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Create Entry
          </button>
        )}
      </div>

      {entry && (
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-dark-primary">Food & Drink</h3>
            </div>
            <div className="space-y-4">
              <Autocomplete<Ingredient>
                id="ingredient-search"
                value={ingredientSearch}
                onChange={setIngredientSearch}
                onSelect={handleAddIngredient}
                onAddNew={handleAddNewIngredient}
                items={filteredIngredients}
                getItemText={(item) => item.name}
                placeholder="Add Food & Drink..."
                label="Ingredient"
                hideLabel={true}
              />
              <div className="space-y-2">
                {entryIngredients.map((ei) => {
                  const ingredient = ingredients.find((i) => i.id === ei.ingredientId)
                  if (!ingredient) return null
                  return (
                    <div
                      key={ei.ingredientId}
                      className="group flex items-center justify-between p-3 bg-dark-elevated rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-dark-primary">{ingredient.name}</span>
                        {ei.notes && (
                          <span className="text-dark-secondary text-sm">
                            {ei.notes}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            setSelectedItem({
                              type: 'ingredient',
                              id: ei.ingredientId,
                              notes: ei.notes,
                            })
                          }
                          className="p-1 text-dark-secondary hover:text-dark-primary transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeIngredient(ei.ingredientId)}
                          className="p-1 text-dark-secondary hover:text-red-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium text-dark-primary mb-4">Symptoms</h3>
            <div className="space-y-4">
              <Autocomplete<Symptom>
                id="symptom-search"
                value={symptomSearch}
                onChange={setSymptomSearch}
                onSelect={handleAddSymptom}
                onAddNew={handleAddNewSymptom}
                items={filteredSymptoms}
                getItemText={(item) => item.title}
                placeholder="Add Symptoms..."
                label="Symptom"
                hideLabel={true}
              />
              <div className="space-y-2">
                {entrySymptoms.map((es) => {
                  const symptom = symptoms.find((s) => s.id === es.symptomId)
                  if (!symptom) return null
                  return (
                    <div
                      key={es.symptomId}
                      className="group flex items-center justify-between p-3 bg-dark-elevated rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-dark-primary">{symptom.title}</span>
                        {es.notes && (
                          <span className="text-dark-secondary text-sm">
                            {es.notes}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            setSelectedItem({
                              type: 'symptom',
                              id: es.symptomId,
                              notes: es.notes,
                            })
                          }
                          className="p-1 text-dark-secondary hover:text-dark-primary transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeSymptom(es.symptomId)}
                          className="p-1 text-dark-secondary hover:text-red-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      )}

      <NotesModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        title={`Edit Notes for ${
          selectedItem?.type === 'ingredient'
            ? ingredients.find((i) => i.id === selectedItem.id)?.name
            : symptoms.find((s) => s.id === selectedItem?.id)?.title
        }`}
        notes={selectedItem?.notes || ''}
        onSave={handleSaveNotes}
      />
    </div>
  )
}

export default DayView
