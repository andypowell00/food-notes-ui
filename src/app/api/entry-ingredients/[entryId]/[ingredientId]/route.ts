import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateEntryIngredientNotes, deleteEntryIngredient } from '@/lib/api'


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string; ingredientId: string }> }  
) {
  try {
    const entryId = parseInt((await params).entryId, 10)
    const ingredientId = parseInt((await params).ingredientId, 10)
    const { notes } = await request.json()
    
    const response = await updateEntryIngredientNotes(entryId, ingredientId, notes)
    
    if (response.error) {
      return NextResponse.json({ 
        error: response.error
      }, { status: 400 })
    }

    if (!response.data) {
      return NextResponse.json({ 
        error: 'Failed to update ingredient notes'
      }, { status: 500 })
    }
    
    return NextResponse.json({
      id: response.data.ingredientId,
      entryId: response.data.entryId,
      ingredientId: response.data.ingredientId,
      notes: response.data.notes
    })
  } catch (error) {
    console.error('Error updating entry ingredient notes:', error)
    return NextResponse.json({ 
      error: 'Failed to update ingredient notes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string; ingredientId: string }> }
) {
  try {
    const entryId = parseInt((await params).entryId, 10)
    const ingredientId = parseInt((await params).ingredientId, 10)
    
    const response = await deleteEntryIngredient(entryId, ingredientId)
    
    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: 400 })
    }
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting entry ingredient:', error)
    return NextResponse.json({ error: 'Failed to delete ingredient' }, { status: 500 })
  }
}