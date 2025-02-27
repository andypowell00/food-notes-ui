import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getEntrySymptoms, addEntrySymptom, removeEntrySymptom } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string; symptomId: string }> }
) {
  try {
    const entryId = parseInt((await params).entryId, 10)
    const symptoms = await getEntrySymptoms(entryId)
    return NextResponse.json(symptoms)
  } catch (error) {
    console.error('Error fetching entry symptoms:', error)
    return NextResponse.json({ error: 'Failed to fetch entry symptoms' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string; symptomId: string }> }
) {
  try {
    const entryId = parseInt((await params).entryId, 10)
    const { symptomId } = await request.json()
    const symptom = await addEntrySymptom(entryId, symptomId)
    return NextResponse.json(symptom)
  } catch (error) {
    console.error('Error adding entry symptom:', error)
    return NextResponse.json({ error: 'Failed to add entry symptom' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string; symptomId: string }> }
) {
  try {
    const entryId = parseInt((await params).entryId, 10)
    const symptomId = parseInt((await params).symptomId, 10)
    await removeEntrySymptom(entryId, symptomId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error removing entry symptom:', error)
    return NextResponse.json({ error: 'Failed to remove symptom' }, { status: 500 })
  }
}