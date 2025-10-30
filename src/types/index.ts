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

export interface Meal {
  id: number
  name: string
  ingredients: Ingredient[]
}

export interface CreateMeal {
  name: string
  ingredientIds: number[]
}

export interface UpdateMeal {
  id: number
  name?: string
  ingredientIds?: number[]
}

export interface EntryMeal {
  entryId: number
  mealId: number
}

export interface MealIngredient {
  mealId: number
  ingredientId: number
  ingredientName: string
}

export interface EntryMealDetail {
  id: number
  mealId: number
  mealName: string
  ingredients: string[]
}
