import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as api from '@/lib/api'

export async function GET() {
  try {
    const supplements = await api.getSupplements()
    return NextResponse.json(supplements)
  } catch (error) {
    console.error('Error fetching supplements:', error)
    return NextResponse.json({ error: 'Failed to fetch supplements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()
    const supplement = await api.createSupplement(name)
    return NextResponse.json(supplement)
  } catch (error) {
    console.error('Error creating supplement:', error)
    return NextResponse.json({ error: 'Failed to create supplement' }, { status: 500 })
  }
}
