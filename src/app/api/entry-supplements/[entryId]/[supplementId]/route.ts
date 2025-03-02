import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as api from '@/lib/api'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string; supplementId: string }> }
) {
  try {
    const { entryId, supplementId } = await params
    const response = await api.removeEntrySupplement(parseInt(entryId), parseInt(supplementId))
    
    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: 400 })
    }
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error removing entry supplement:', error)
    return NextResponse.json({ error: 'Failed to remove supplement from entry' }, { status: 500 })
  }
}
