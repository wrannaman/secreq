import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@/utils/supabase/server'
import ExcelJS from 'exceljs'

export async function POST(req, { params }) {
  try {
    const { id } = params
    const body = await req.json()
    const { rows = [], columnWidths = [], merges = [], filename } = body || {}
    if (!id || !Array.isArray(rows)) {
      return NextResponse.json({ error: 'id and rows required' }, { status: 400 })
    }
    console.log('💾 [Save] Saving version', { rowCount: rows.length, maxCols: Math.max(...rows.map(r => (r.cells || []).length), 0) })

    // Create workbook exactly as UI grid
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet('Sheet1')
    const maxCols = Math.max(...rows.map(r => (r.cells || []).length), 0)
    ws.columns = Array.from({ length: maxCols }, (_, i) => ({ width: Math.max(8, Math.min(60, (columnWidths?.[i] || 140) / 7)) }))
    for (const r of rows) {
      const values = []
      for (let c = 0; c < maxCols; c++) {
        const cell = r.cells?.[c]
        values.push(cell?.value ?? '')
      }
      ws.addRow(values)
    }
    merges.forEach(m => {
      if (!m || !m.rowSpan || !m.colSpan) return
      const r1 = m.row
      const c1 = m.col
      const r2 = r1 + m.rowSpan - 1
      const c2 = c1 + m.colSpan - 1
      try { ws.mergeCells(r1, c1, r2, c2) } catch (_) { }
    })

    const buffer = await wb.xlsx.writeBuffer()

    const supabase = await createServiceClient()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const path = `questionnaires/${id}/versions/${timestamp}.xlsx`
    const { error } = await supabase.storage
      .from('secreq')
      .upload(path, Buffer.from(buffer), {
        upsert: false,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    if (error) throw error

    return NextResponse.json({ success: true, path, version: timestamp, filename: filename || `${id}-${timestamp}.xlsx` })
  } catch (err) {
    console.error('❌ /api/questionnaires/[id]/save failed:', err)
    return NextResponse.json({ error: err.message || 'Save failed' }, { status: 500 })
  }
}


