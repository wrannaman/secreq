import { NextResponse } from 'next/server'

export async function POST(req, { params }) {
  try {
    const { id } = params
    const { rows, filename = `questionnaire-${id}.csv` } = await req.json()
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'rows required' }, { status: 400 })
    }

    // Create CSV (basic; preserves visible grid up to provided cells)
    const csv = rows.map(r => (r.cells || []).map(c => {
      const v = c?.value == null ? '' : String(c.value)
      if (v.includes('"') || v.includes(',') || v.includes('\n')) {
        return '"' + v.replace(/"/g, '""') + '"'
      }
      return v
    }).join(',')).join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (err) {
    console.error('❌ /api/questionnaires/[id]/export failed:', err)
    return NextResponse.json({ error: err.message || 'Export failed' }, { status: 500 })
  }
}


