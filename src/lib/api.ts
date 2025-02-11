import type { Entry, Ingredient, Symptom, EntryIngredient, EntrySymptom } from "@/types"

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
