export interface Entry {
  id: number
  date: string
  symptomatic: boolean
  supplements?: EntrySupplement[]
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
  symptomTitle?: string
}

export interface Supplement {
  id: number
  name: string
}

export interface EntrySupplement {
  entryId: number
  supplementId: number
  supplementName?: string
  supplementTitle?: string
}
