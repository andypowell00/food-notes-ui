import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateEntrySymptomNotes, removeEntrySymptom } from '@/lib/api'

export async function PUT(
  request: NextRequest,
  { params }: { params: { entryId: string; symptomId: string } }
) {
  try {
    const entryId = parseInt(params.entryId, 10)
    const symptomId = parseInt(params.symptomId, 10)
    const { notes } = await request.json()
    
    const updatedSymptom = await updateEntrySymptomNotes(entryId, symptomId, notes)
    
    return NextResponse.json({
      id: updatedSymptom.symptomId,
      entryId: updatedSymptom.entryId,
      symptomId: updatedSymptom.symptomId,
      notes: updatedSymptom.notes
    })
  } catch (error) {
    console.error('Error updating entry symptom notes:', error)
    return NextResponse.json({ 
      error: 'Failed to update symptom notes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { entryId: string; symptomId: string } }
) {
  try {
    const entryId = parseInt(params.entryId, 10)
    const symptomId = parseInt(params.symptomId, 10)
    
    await removeEntrySymptom(entryId, symptomId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error removing entry symptom:', error)
    return NextResponse.json({ error: 'Failed to remove symptom' }, { status: 500 })
  }
}