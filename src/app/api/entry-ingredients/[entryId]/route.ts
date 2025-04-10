import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getEntryIngredients, addEntryIngredient, deleteEntryIngredient } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string; ingredientId: string }> }
) {
  try {
    const entryId = parseInt((await params).entryId, 10)
    const ingredients = await getEntryIngredients(entryId)
    return NextResponse.json(ingredients)
  } catch (error) {
    console.error('Error fetching entry ingredients:', error)
    return NextResponse.json({ error: 'Failed to fetch entry ingredients' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string; ingredientId: string }> }
) {
  try {
    const entryId = parseInt((await params).entryId, 10)
    const { ingredientId } = await request.json()
    const ingredient = await addEntryIngredient(entryId, ingredientId)
    return NextResponse.json(ingredient)
  } catch (error) {
    console.error('Error adding entry ingredient:', error)
    return NextResponse.json({ error: 'Failed to add entry ingredient' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string; ingredientId: string }> }
) {
  try {
    const entryId = parseInt((await params).entryId, 10)
    const ingredientId = parseInt((await params).ingredientId, 10)
    await deleteEntryIngredient(entryId, ingredientId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting entry ingredient:', error)
    return new NextResponse(null, { status: 500 })
  }
}