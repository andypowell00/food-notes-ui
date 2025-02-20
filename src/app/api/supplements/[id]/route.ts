import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as api from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supplement = await api.getSupplement(parseInt(id))
    return NextResponse.json(supplement)
  } catch (error) {
    console.error('Error fetching supplement:', error)
    return NextResponse.json({ error: 'Failed to fetch supplement' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await api.deleteSupplement(parseInt(id))
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting supplement:', error)
    return NextResponse.json({ error: 'Failed to delete supplement' }, { status: 500 })
  }
}
