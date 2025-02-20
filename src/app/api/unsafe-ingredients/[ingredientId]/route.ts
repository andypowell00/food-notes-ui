import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as api from '@/lib/api'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ingredientId: string }> }
) {
  try {
    const { ingredientId } = await params
    await api.removeUnsafeIngredient(parseInt(ingredientId))
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error removing unsafe ingredient:', error)
    return NextResponse.json({ error: 'Failed to remove unsafe ingredient' }, { status: 500 })
  }
}
