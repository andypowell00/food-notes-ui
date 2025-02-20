import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as api from '@/lib/api'

export async function GET() {
  try {
    const unsafeIngredients = await api.getUnsafeIngredients()
    return NextResponse.json(unsafeIngredients)
  } catch (error) {
    console.error('Error fetching unsafe ingredients:', error)
    return NextResponse.json({ error: 'Failed to fetch unsafe ingredients' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ingredientId } = await request.json()
    await api.markIngredientAsUnsafe(ingredientId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error marking ingredient as unsafe:', error)
    return NextResponse.json({ error: 'Failed to mark ingredient as unsafe' }, { status: 500 })
  }
}
