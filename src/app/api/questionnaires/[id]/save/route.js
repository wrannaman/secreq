import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@/utils/supabase/server'

export async function POST(req, { params }) {
  try {
    const { id } = params
    const body = await req.json()
    const { rows, meta = {} } = body || {}
    if (!id || !Array.isArray(rows)) {
      return NextResponse.json({ error: 'id and rows required' }, { status: 400 })
    }

    const supabase = await createServiceClient()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const path = `questionnaires/${id}/snapshots/${timestamp}.json`
    const file = new Blob([JSON.stringify({ rows, meta, saved_at: new Date().toISOString() }, null, 2)], { type: 'application/json' })

    const { error } = await supabase.storage.from('secreq').upload(path, file, { upsert: false, contentType: 'application/json' })
    if (error) throw error

    return NextResponse.json({ success: true, path, version: timestamp })
  } catch (err) {
    console.error('❌ /api/questionnaires/[id]/save failed:', err)
    return NextResponse.json({ error: err.message || 'Save failed' }, { status: 500 })
  }
}


