import { NextResponse } from 'next/server'
import ExcelJS from 'exceljs'

export async function POST(req, { params }) {
  try {
    const { id } = params
    const { rows, columnWidths = [], merges = [], filename = `questionnaire-${id}.xlsx` } = await req.json()
    if (!Array.isArray(rows)) {
      return NextResponse.json({ error: 'rows required' }, { status: 400 })
    }

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

    // Apply merges (best-effort rendering like viewer)
    merges.forEach(m => {
      if (!m || !m.rowSpan || !m.colSpan) return
      const r1 = m.row
      const c1 = m.col
      const r2 = r1 + m.rowSpan - 1
      const c2 = c1 + m.colSpan - 1
      ws.mergeCells(r1, c1, r2, c2)
    })
    const buffer = await wb.xlsx.writeBuffer()
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (err) {
    console.error('❌ /api/questionnaires/[id]/export failed:', err)
    return NextResponse.json({ error: err.message || 'Export failed' }, { status: 500 })
  }
}


