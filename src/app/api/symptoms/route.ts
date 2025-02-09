import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSymptoms, createSymptom } from '@/lib/api'

export async function GET() {
  try {
    const symptoms = await getSymptoms()
    return NextResponse.json(symptoms)
  } catch (error) {
    console.error('Error fetching symptoms:', error)
    return NextResponse.json({ error: 'Failed to fetch symptoms' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()
    const symptom = await createSymptom(title)
    return NextResponse.json(symptom)
  } catch (error) {
    console.error('Error creating symptom:', error)
    return NextResponse.json({ error: 'Failed to create symptom' }, { status: 500 })
  }
}
