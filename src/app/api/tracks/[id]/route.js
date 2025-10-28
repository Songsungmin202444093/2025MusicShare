// app/api/tracks/[id]/route.js
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { getTrack } from '../../../../lib/tracks'

export async function GET(_, { params }) {
    const row = await getTrack(params.id)
    if (!row) return new NextResponse(null, { status: 404 }) // 없는 경우 404
    return NextResponse.json(row)
}
