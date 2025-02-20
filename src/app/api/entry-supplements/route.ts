import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as api from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const { entryId, supplementId } = await request.json()
    const entrySupplement = await api.addEntrySupplement(entryId, supplementId)
    return NextResponse.json(entrySupplement)
  } catch (error) {
    console.error('Error adding entry supplement:', error)
    return NextResponse.json({ error: 'Failed to add supplement to entry' }, { status: 500 })
  }
}
