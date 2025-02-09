import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getEntrySymptoms, addEntrySymptom } from '@/lib/api'

export async function GET(
  request: NextRequest, 
  { params }: { params: { entryId: string } }
) {
  try {
    const entryId = parseInt(params.entryId, 10)
    const symptoms = await getEntrySymptoms(entryId)
    return NextResponse.json(symptoms)
  } catch (error) {
    console.error('Error fetching entry symptoms:', error)
    return NextResponse.json({ error: 'Failed to fetch entry symptoms' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest, 
  { params }: { params: { entryId: string } }
) {
  try {
    const entryId = parseInt(params.entryId, 10)
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
  { params }: { params: { entryId: string, symptomId: string } }
) {
  const res = await fetch(`https://localhost:7271/api/entry-symptoms/${params.entryId}/${params.symptomId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(request.headers.get('Authorization')
        ? { 'Authorization': request.headers.get('Authorization')! }
        : {})
    },
  })
  return new NextResponse(null, { status: res.status })
}
