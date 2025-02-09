import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIngredients, createIngredient } from '@/lib/api'

export async function GET() {
  try {
    const ingredients = await getIngredients()
    return NextResponse.json(ingredients)
  } catch (error) {
    console.error('Error fetching ingredients:', error)
    return NextResponse.json({ error: 'Failed to fetch ingredients' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()
    const ingredient = await createIngredient(name)
    return NextResponse.json(ingredient)
  } catch (error) {
    console.error('Error creating ingredient:', error)
    return NextResponse.json({ error: 'Failed to create ingredient' }, { status: 500 })
  }
}
