import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getEntries, createEntry } from '@/lib/api'

export async function GET() {
  try {
    const entries = await getEntries()
    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching entries:', error)
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { date, symptomatic = false } = await request.json()
    const entry = await createEntry(new Date(date), symptomatic)
    return NextResponse.json(entry)
  } catch (error) {
    console.error('Error creating entry:', error)
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 })
  }
}
