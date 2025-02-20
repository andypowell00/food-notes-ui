import type { Entry, Ingredient, Symptom, EntryIngredient, EntrySymptom, Supplement, EntrySupplement } from "@/types"

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
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null as unknown as T;
  }
  return response.json()
}

// API client functions
export async function getSymptoms(): Promise<Symptom[]> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/symptoms`)
  return handleResponse(response)
}

export async function createSymptom(title: string): Promise<Symptom> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/symptoms`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
  return handleResponse(response)
}

export async function getEntries(): Promise<Entry[]> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entries`)
  return handleResponse(response)
}

export async function createEntry(date: Date, symptomatic: boolean = false): Promise<Entry> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entries`, {
    method: 'POST',
    body: JSON.stringify({ 
      date: date.toISOString(),
      symptomatic 
    }),
  })
  return handleResponse(response)
}

export async function getEntryIngredients(entryId: number): Promise<EntryIngredient[]> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-ingredients/by-entry/${entryId}`)
  return handleResponse(response)
}

export async function addEntryIngredient(
  entryId: number, 
  ingredientId: number, 
  notes?: string
): Promise<EntryIngredient> {
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

export async function updateEntryIngredientNotes(entryId: number, ingredientId: number, notes: string): Promise<EntryIngredient> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-ingredients/${entryId}/${ingredientId}`, {
    method: 'PUT',
    body: JSON.stringify({ notes }),
  })
  return handleResponse(response)
}

export async function deleteEntryIngredient(entryId: number, ingredientId: number): Promise<void> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-ingredients/${entryId}/${ingredientId}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}

// Similar functions for symptoms
export async function getEntrySymptoms(entryId: number): Promise<EntrySymptom[]> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-symptoms/by-entry/${entryId}`)
  return handleResponse(response)
}

export async function addEntrySymptom(
  entryId: number, 
  symptomId: number, 
  notes?: string
): Promise<EntrySymptom> {
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

export async function updateEntrySymptomNotes(entryId: number, symptomId: number, notes: string): Promise<EntrySymptom> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-symptoms/${entryId}/${symptomId}`, {
    method: 'PUT',
    body: JSON.stringify({ notes }),
  })
  return handleResponse(response)
}

export async function removeEntrySymptom(entryId: number, symptomId: number): Promise<void> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-symptoms/${entryId}/${symptomId}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}

export async function getIngredients(): Promise<Ingredient[]> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/ingredients`)
  return handleResponse(response)
}

export async function createIngredient(name: string): Promise<Ingredient> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/ingredients`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return handleResponse(response)
}

// Supplements API methods
export async function getSupplements(): Promise<Supplement[]> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/supplements`)
  return handleResponse(response)
}

export async function createSupplement(name: string): Promise<Supplement> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/supplements`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return handleResponse(response)
}

export async function getSupplement(id: number): Promise<Supplement> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/supplements/${id}`)
  return handleResponse(response)
}

export async function deleteSupplement(id: number): Promise<void> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/supplements/${id}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}

// Entry Supplements API methods
export async function getEntrySupplements(entryId: number): Promise<EntrySupplement[]> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-supplements/by-entry/${entryId}`)
  return handleResponse(response)
}

export async function addEntrySupplement(
  entryId: number,
  supplementId: number
): Promise<EntrySupplement> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-supplements`, {
    method: 'POST',
    body: JSON.stringify({ 
      entryId,
      supplementId
    }),
  })
  return handleResponse(response)
}

export async function removeEntrySupplement(entryId: number, supplementId: number): Promise<void> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/entry-supplements/${entryId}/${supplementId}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}

// Safe Ingredients API methods
export async function getSafeIngredients(): Promise<Ingredient[]> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/safe-ingredients`)
  return handleResponse(response)
}

export async function markIngredientAsSafe(ingredientId: number): Promise<void> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/safe-ingredients`, {
    method: 'POST',
    body: JSON.stringify({ ingredientId }),
  })
  return handleResponse(response)
}

export async function removeSafeIngredient(ingredientId: number): Promise<void> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/safe-ingredients/${ingredientId}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}

// Unsafe Ingredients API methods
export async function getUnsafeIngredients(): Promise<Ingredient[]> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/unsafe-ingredients`)
  return handleResponse(response)
}

export async function markIngredientAsUnsafe(ingredientId: number): Promise<void> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/unsafe-ingredients`, {
    method: 'POST',
    body: JSON.stringify({ ingredientId }),
  })
  return handleResponse(response)
}

export async function removeUnsafeIngredient(ingredientId: number): Promise<void> {
  const response = await fetchWithApiKey(`${API_BASE_URL}/unsafe-ingredients/${ingredientId}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}
