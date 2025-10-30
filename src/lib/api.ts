import type { Entry, Ingredient, Symptom, EntryIngredient, EntrySymptom, Supplement, EntrySupplement, CreateMeal, Meal, EntryMeal } from "@/types"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ''

export const fetchWithApiKey = async (url: string, options: RequestInit = {}) => {
  const defaultHeaders = {
    'Authorization': `ApiKey ${API_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers
  }

  return fetch(url, {
    ...options,
    headers: defaultHeaders
  })
}

// Utility function to handle API responses
export async function handleResponse<T>(response: Response): Promise<{ data?: T; error?: string }> {
  if (!response.ok) {
    //const errorText = await response.text();
    //console.error('API Error:', `Status: ${response.status}, URL: ${response.url}, Error: ${errorText || 'No error message'}`);
    return { error: `Request failed with status ${response.status}` };
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return { data: null as unknown as T };
  }
  
  try {
    const data = await response.json();
    return { data };
  } catch (err) {
    console.error('JSON parsing error:', err);
    return { error: 'Invalid response format' };
  }
}

// API client functions
export async function getSymptoms(): Promise<{ data?: Symptom[]; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/symptoms`)
  return handleResponse(response)
}

export async function createSymptom(title: string): Promise<{ data?: Symptom; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/symptoms`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
  return handleResponse(response)
}

export async function getEntries(): Promise<{ data?: Entry[]; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entries`)
  return handleResponse(response)
}

export async function createEntry(date: Date, symptomatic: boolean = false): Promise<{ data?: Entry; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entries`, {
    method: 'POST',
    body: JSON.stringify({ 
      date: date.toISOString(),
      symptomatic 
    }),
  })
  return handleResponse(response)
}

export async function getEntryIngredients(entryId: number): Promise<{ data?: EntryIngredient[]; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-ingredients/by-entry/${entryId}`)
  return handleResponse(response)
}

import type { EntryMealDetail } from '@/types'

export async function getEntryMeals(entryId: number): Promise<{ data?: EntryMealDetail[]; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entrymeals/entry/${entryId}`)
  return handleResponse(response)
}

export async function addEntryIngredient(
  entryId: number, 
  ingredientId: number, 
  notes?: string
): Promise<{ data?: EntryIngredient; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-ingredients`, {
    method: 'POST',
    body: JSON.stringify({ 
      entryId, 
      ingredientId, 
      notes 
    }),
  })
  return handleResponse(response)
}

export async function addEntryMeal(
  createEntryMealDto : EntryMeal
): Promise<{ data?: EntryMeal; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entrymeals`, {
    method: 'POST',
    body: JSON.stringify(createEntryMealDto),
  })
  return handleResponse(response)
}

export async function deleteEntryMeal(entryId: number, mealId: number): Promise<{ data?: void; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entrymeals/entry/${entryId}/meal/${mealId}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}

export async function updateEntryIngredientNotes(entryId: number, ingredientId: number, notes: string): Promise<{ data?: EntryIngredient; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-ingredients/${entryId}/${ingredientId}`, {
    method: 'PUT',
    body: JSON.stringify({ notes }),
  })
  return handleResponse(response)
}

export async function deleteEntryIngredient(entryId: number, ingredientId: number): Promise<{ data?: void; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-ingredients/${entryId}/${ingredientId}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}

// Similar functions for symptoms
export async function getEntrySymptoms(entryId: number): Promise<{ data?: EntrySymptom[]; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-symptoms/by-entry/${entryId}`)
  return handleResponse(response)
}

export async function addEntrySymptom(
  entryId: number, 
  symptomId: number, 
  notes?: string
): Promise<{ data?: EntrySymptom; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-symptoms`, {
    method: 'POST',
    body: JSON.stringify({ 
      entryId, 
      symptomId, 
      notes 
    }),
  })
  return handleResponse(response)
}

export async function updateEntrySymptomNotes(entryId: number, symptomId: number, notes: string): Promise<{ data?: EntrySymptom; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-symptoms/${entryId}/${symptomId}`, {
    method: 'PUT',
    body: JSON.stringify({ notes }),
  })
  return handleResponse(response)
}

export async function removeEntrySymptom(entryId: number, symptomId: number): Promise<{ data?: void; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-symptoms/${entryId}/${symptomId}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}

export async function getIngredients(): Promise<{ data?: Ingredient[]; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/ingredients`)
  return handleResponse(response)
}

export async function createIngredient(name: string): Promise<{ data?: Ingredient; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/ingredients`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return handleResponse(response)
}
export async function createMeal(createmealDto: CreateMeal): Promise<{ data?: Meal; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/meals`, {
    method: 'POST', 
    body: JSON.stringify(createmealDto),
  })
  return handleResponse(response)
}

export async function getMeals(): Promise<{ data?: Meal[]; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/meals`)
  return handleResponse(response)
}

export async function addMealIngredient(
  id: number, // meal id
  ingredientId: number
): Promise<{ data?: void; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/meals/${id}/ingredients`, {
    method: 'POST', 
    body: JSON.stringify(ingredientId),
  })
  return handleResponse(response)
}

export async function deleteMealIngredient(
  id: number, // meal id
  ingredientId: number  
): Promise<{ data?: void; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/meals/${id}/ingredients/${ingredientId}`, {
    method: 'DELETE', 
  })
  return handleResponse(response)
}

export async function deleteMeal(id: number): Promise<{ data?: void; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/meals/${id}`, {
    method: 'DELETE', 
  })
  return handleResponse(response)
} 


// Supplements API methods
export async function getSupplements(): Promise<{ data?: Supplement[]; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/supplements`)
  return handleResponse(response)
}

export async function createSupplement(name: string): Promise<{ data?: Supplement; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/supplements`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return handleResponse(response)
}

export async function getSupplement(id: number): Promise<{ data?: Supplement; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/supplements/${id}`)
  return handleResponse(response)
}

export async function deleteSupplement(id: number): Promise<{ data?: void; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/supplements/${id}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}

// Entry Supplements API methods
export async function getEntrySupplements(entryId: number): Promise<{ data?: EntrySupplement[]; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-supplements/by-entry/${entryId}`)
  return handleResponse(response)
}

export async function addEntrySupplement(
  entryId: number,
  supplementId: number
): Promise<{ data?: EntrySupplement; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-supplements`, {
    method: 'POST',
    body: JSON.stringify({ 
      entryId,
      supplementId
    }),
  })
  return handleResponse(response)
}

export async function removeEntrySupplement(entryId: number, supplementId: number): Promise<{ data?: void; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-supplements/${entryId}/${supplementId}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}

// Safe Ingredients API methods
export async function getSafeIngredients(): Promise<{ data?: Ingredient[]; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/safe-ingredients`)
  return handleResponse(response)
}

export async function markIngredientAsSafe(ingredientId: number): Promise<{ data?: void; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/safe-ingredients`, {
    method: 'POST',
    body: JSON.stringify({ ingredientId }),
  })
  return handleResponse(response)
}

export async function removeSafeIngredient(ingredientId: number): Promise<{ data?: void; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/safe-ingredients/${ingredientId}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}

// Unsafe Ingredients API methods
export async function getUnsafeIngredients(): Promise<{ data?: Ingredient[]; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/unsafe-ingredients`)
  return handleResponse(response)
}

export async function markIngredientAsUnsafe(ingredientId: number): Promise<{ data?: void; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/unsafe-ingredients`, {
    method: 'POST',
    body: JSON.stringify({ ingredientId }),
  })
  return handleResponse(response)
}

export async function removeUnsafeIngredient(ingredientId: number): Promise<{ data?: void; error?: string }> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/unsafe-ingredients/${ingredientId}`, {
    method: 'DELETE', 
  })
  return handleResponse(response)
}
