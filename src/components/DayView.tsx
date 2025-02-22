'use client'

import React from "react"
import type { Entry, Ingredient, Symptom, Supplement } from "@/types"
import { useIngredients } from "@/hooks/useIngredients"
import { useSymptoms } from "@/hooks/useSymptoms"
import { useSupplements } from "@/hooks/useSupplements"
import { useSafeUnsafeIngredients } from "@/hooks/useSafeUnsafeIngredients"
import { useEntryIngredients } from "@/hooks/useEntryIngredients"
import { useEntrySymptoms } from "@/hooks/useEntrySymptoms"
import { useEntrySupplements } from "@/hooks/useEntrySupplements"
import { Autocomplete } from "./Autocomplete"
import { NotesModal } from "./NotesModal"

interface DayViewProps {
  date: Date
  entry: Entry | undefined
  onCreateEntry: (date: Date) => Promise<Entry>
}

const DayView: React.FC<DayViewProps> = ({ date, entry, onCreateEntry }) => {
  const { ingredients, searchTerm: ingredientSearch, setSearchTerm: setIngredientSearch, addIngredient } = useIngredients()
  const { symptoms, searchTerm: symptomSearch, setSearchTerm: setSymptomSearch, addSymptom } = useSymptoms()
  const { supplements, searchTerm: supplementSearch, setSearchTerm: setSupplementSearch, addSupplement } = useSupplements()
  const { safeIngredients, unsafeIngredients, markAsSafe, markAsUnsafe, removeSafeIngredient, removeUnsafeIngredient } = useSafeUnsafeIngredients()
  const { entryIngredients, addIngredient: addEntryIngredient, removeIngredient, updateNotes: updateIngredientNotes } = useEntryIngredients(entry?.id)
  const { entrySymptoms, addSymptom: addEntrySymptom, removeSymptom, updateNotes: updateSymptomNotes } = useEntrySymptoms(entry?.id)
  const { entrySupplements, addSupplement: addEntrySupplement, removeSupplement } = useEntrySupplements(entry?.id)

  const [selectedItem, setSelectedItem] = React.useState<{ type: 'ingredient' | 'symptom' | 'supplement', id: number, notes: string } | null>(null)

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

  const handleAddSupplement = async (supplement: Supplement) => {
    let currentEntry = entry
    if (!currentEntry) {
      currentEntry = await onCreateEntry(date)
    }
    await addEntrySupplement({
      supplementId: supplement.id
    })
    setSupplementSearch("")
  }

  const handleAddNewSupplement = async (name: string) => {
    const newSupplement = await addSupplement(name)
    await handleAddSupplement(newSupplement)
  }

  const handleSaveNotes = async (notes: string) => {
    if (!selectedItem) return

    try {
      if (selectedItem.type === 'ingredient') {
        await updateIngredientNotes(selectedItem.id, notes)
      } else if (selectedItem.type === 'symptom') {
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
                items={ingredients}
                getItemText={(item) => item.name}
                placeholder="Add Food & Drink..."
                label="Ingredient"
                hideLabel={true}
              />
              <div className={`space-y-2 ${entryIngredients.length > 10 ? 'max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-dark-elevated scrollbar-track-dark-base' : ''}`}>
                {entryIngredients.map((ei) => {
                  const ingredient = ingredients.find((i) => i.id === ei.ingredientId)
                  if (!ingredient?.name) return null
                  return (
                    <div
                      key={ei.ingredientId}
                      className="group flex items-center justify-between p-3 bg-dark-elevated rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-dark-primary">{ingredient.name}</span>
                        {ei.notes && (
                          <svg 
                            className="w-4 h-4 text-dark-secondary" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <title>Has notes</title>
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={async () => {
                            try {
                              const isSafe = safeIngredients?.some(i => i.id === ei.ingredientId) ?? false
                              if (isSafe) {
                                await removeSafeIngredient(ei.ingredientId)
                              } else {
                                await markAsSafe(ei.ingredientId)
                              }
                            } catch (error) {
                              console.error('Error toggling safe status:', error)
                            }
                          }}
                          className={`p-1 transition-colors ${
                            safeIngredients?.some(i => i.id === ei.ingredientId)
                              ? 'text-green-500 hover:text-dark-secondary'
                              : 'text-dark-secondary hover:text-green-500'
                          }`}
                          title={safeIngredients?.some(i => i.id === ei.ingredientId) ? "Remove Safe Mark" : "Mark as Safe"}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const isUnsafe = unsafeIngredients?.some(i => i.id === ei.ingredientId) ?? false
                              if (isUnsafe) {
                                await removeUnsafeIngredient(ei.ingredientId)
                              } else {
                                await markAsUnsafe(ei.ingredientId)
                              }
                            } catch (error) {
                              console.error('Error toggling unsafe status:', error)
                            }
                          }}
                          className={`p-1 transition-colors ${
                            unsafeIngredients?.some(i => i.id === ei.ingredientId)
                              ? 'text-red-500 hover:text-dark-secondary'
                              : 'text-dark-secondary hover:text-red-500'
                          }`}
                          title={unsafeIngredients?.some(i => i.id === ei.ingredientId) ? "Remove Unsafe Mark" : "Mark as Unsafe"}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            setSelectedItem({
                              type: 'ingredient',
                              id: ei.ingredientId,
                              notes: ei.notes,
                            })
                          }
                          className="p-1 text-dark-secondary hover:text-dark-primary transition-colors"
                          title="Edit Notes"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeIngredient(ei.ingredientId)}
                          className="p-1 text-dark-secondary hover:text-red-400 transition-colors"
                          title="Delete"
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
            <h3 className="text-lg font-medium text-dark-primary mb-4">Supplements & Medications</h3>
            <div className="space-y-4">
              <Autocomplete<Supplement>
                id="supplement-search"
                value={supplementSearch}
                onChange={setSupplementSearch}
                onSelect={handleAddSupplement}
                onAddNew={handleAddNewSupplement}
                items={supplements}
                getItemText={(item) => item.name}
                placeholder="Add Supplements..."
                label="Supplement"
                hideLabel={true}
              />
              <div className="space-y-2">
                {entrySupplements?.map((es) => {
                  const supplement = supplements.find((s) => s.id === es.supplementId)
                  if (!supplement) return null
                  return (
                    <div
                      key={es.supplementId}
                      className="group flex items-center justify-between p-3 bg-dark-elevated rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-dark-primary">{supplement.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => removeSupplement(es.supplementId)}
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
                items={symptoms}
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
                          <svg 
                            className="w-4 h-4 text-dark-secondary" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <title>Has notes</title>
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                            />
                          </svg>
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
                          title="Edit Notes"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeSymptom(es.symptomId)}
                          className="p-1 text-dark-secondary hover:text-red-400 transition-colors"
                          title="Delete"
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
            : selectedItem?.type === 'symptom'
              ? symptoms.find((s) => s.id === selectedItem?.id)?.title
              : supplements.find((s) => s.id === selectedItem?.id)?.name
        }`}
        notes={selectedItem?.notes || ''}
        onSave={handleSaveNotes}
      />
    </div>
  )
}

export default DayView
