import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as api from '@/lib/api'

export async function GET() {
  try {
    const safeIngredients = await api.getSafeIngredients()
    return NextResponse.json(safeIngredients)
  } catch (error) {
    console.error('Error fetching safe ingredients:', error)
    return NextResponse.json({ error: 'Failed to fetch safe ingredients' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ingredientId } = await request.json()
    await api.markIngredientAsSafe(ingredientId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error marking ingredient as safe:', error)
    return NextResponse.json({ error: 'Failed to mark ingredient as safe' }, { status: 500 })
  }
}
