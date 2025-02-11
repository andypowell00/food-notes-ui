import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateEntryIngredientNotes, deleteEntryIngredient } from '@/lib/api'

type Params = {
  entryId: string;
  ingredientId: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const entryId = parseInt(params.entryId, 10)
    const ingredientId = parseInt(params.ingredientId, 10)
    const { notes } = await request.json()
    
    const updatedIngredient = await updateEntryIngredientNotes(entryId, ingredientId, notes)
    
    return NextResponse.json({
      id: updatedIngredient.ingredientId,
      entryId: updatedIngredient.entryId,
      ingredientId: updatedIngredient.ingredientId,
      notes: updatedIngredient.notes
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
  { params }: { params: Params }  
) {
  try {
    const entryId = parseInt(params.entryId, 10)
    const ingredientId = parseInt(params.ingredientId, 10)
    
    await deleteEntryIngredient(entryId, ingredientId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting entry ingredient:', error)
    return NextResponse.json({ error: 'Failed to delete ingredient' }, { status: 500 })
  }
}