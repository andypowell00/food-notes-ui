import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as api from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> }
) {
  try {
    const { entryId } = await params
    const entrySupplements = await api.getEntrySupplements(parseInt(entryId))
    return NextResponse.json(entrySupplements)
  } catch (error) {
    console.error('Error fetching entry supplements:', error)
    return NextResponse.json({ error: 'Failed to fetch entry supplements' }, { status: 500 })
  }
}
