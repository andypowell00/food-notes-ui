import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateEntrySymptomNotes, removeEntrySymptom } from '@/lib/api'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string; symptomId: string }> }
) {
  try {
    const entryId = parseInt((await params).entryId, 10)
    const symptomId = parseInt((await params).symptomId, 10)
    const { notes } = await request.json()
    
    const response = await updateEntrySymptomNotes(entryId, symptomId, notes)
    
    if (response.error) {
      return NextResponse.json({ 
        error: response.error
      }, { status: 400 })
    }

    if (!response.data) {
      return NextResponse.json({ 
        error: 'Failed to update symptom notes'
      }, { status: 500 })
    }
    
    return NextResponse.json({
      id: response.data.symptomId,
      entryId: response.data.entryId,
      symptomId: response.data.symptomId,
      notes: response.data.notes
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
  { params }: { params: Promise<{ entryId: string; symptomId: string }> }
) {
  try {
    const entryId = parseInt((await params).entryId, 10)
    const symptomId = parseInt((await params).symptomId, 10)
    
    const response = await removeEntrySymptom(entryId, symptomId)
    
    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: 400 })
    }
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error removing entry symptom:', error)
    return NextResponse.json({ error: 'Failed to remove symptom' }, { status: 500 })
  }
}