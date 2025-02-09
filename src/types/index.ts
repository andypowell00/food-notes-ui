export interface Entry {
  id: number
  date: string
  symptomatic: boolean
}

export interface Ingredient {
  id: number
  name: string
}

export interface Symptom {
  id: number
  title: string
}

export interface EntryIngredient {
  entryId: number
  ingredientId: number
  notes: string
}

export interface EntrySymptom {
  entryId: number
  symptomId: number
  notes: string
}
