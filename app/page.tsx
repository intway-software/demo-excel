"use client"

import { useState, useRef, type KeyboardEvent } from "react"

export default function ExcelGrid() {
  const rows = 20
  const cols = 10
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  const cellRefs = useRef<{ [key: string]: HTMLInputElement | HTMLSelectElement | null }>({})

  const getColumnLetter = (index: number) => {
    return String.fromCharCode(65 + index)
  }

  const columnTitles = [
    "Transporte",
    "R.E Chofer",
    "Desde",
    "Hasta",
    "Cliente",
    "Peaje coche",
    "Peaje cliente",
    "H. Exced.",
    "Observaciones",
    "Total",
  ]

  const isDropdownColumn = (colIndex: number) => {
    return colIndex === 1 || colIndex === 4 // Categoría y Estado
  }

  const handleKeyDown = (e: KeyboardEvent, rowIndex: number, colIndex: number) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const nextCol = colIndex + 1
      if (nextCol < cols) {
        const nextCellId = `${getColumnLetter(nextCol)}${rowIndex + 1}`
        const nextCell = cellRefs.current[nextCellId]
        if (nextCell) {
          nextCell.focus()
          setSelectedCell(nextCellId)
        }
      } else if (rowIndex + 1 < rows) {
        // Move to first cell of next row
        const nextCellId = `${getColumnLetter(0)}${rowIndex + 2}`
        const nextCell = cellRefs.current[nextCellId]
        if (nextCell) {
          nextCell.focus()
          setSelectedCell(nextCellId)
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-4 text-2xl font-semibold">Grilla Estilo Excel</h1>

        <div className="max-h-[600px] overflow-auto rounded-lg border border-border bg-white shadow-sm">
          <table className="w-full border-collapse font-mono text-[11px]">
            <thead className="sticky top-0 z-20">
              <tr>
                <th className="sticky left-0 z-30 w-12 border border-border bg-muted p-0 text-center font-normal text-muted-foreground"></th>
                {Array.from({ length: cols }).map((_, i) => (
                  <th
                    key={i}
                    className="border border-border bg-muted px-2 py-1 text-center font-semibold text-foreground"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-muted-foreground">{getColumnLetter(i)}</span>
                      <span className="text-[11px]">{columnTitles[i]}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="sticky left-0 z-10 border border-border bg-muted px-2 py-1 text-center font-semibold text-muted-foreground">
                    {rowIndex + 1}
                  </td>
                  {Array.from({ length: cols }).map((_, colIndex) => {
                    const cellId = `${getColumnLetter(colIndex)}${rowIndex + 1}`
                    const isSelected = selectedCell === cellId

                    return (
                      <td
                        key={colIndex}
                        className={`border border-border px-2 py-1 text-left transition-colors hover:bg-accent ${
                          isSelected ? "bg-primary/10 ring-2 ring-primary ring-inset" : "bg-white"
                        }`}
                        onClick={() => setSelectedCell(cellId)}
                      >
                        {isDropdownColumn(colIndex) ? (
                          <select
                            ref={(el) => { cellRefs.current[cellId] = el }}
                            className="w-full bg-transparent outline-none"
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                            onFocus={() => setSelectedCell(cellId)}
                          >
                            <option value=""></option>
                            {colIndex === 1 ? (
                              <>
                                <option value="electrónica">ALBORNOZ JUAN LEONARDO</option>
                                <option value="ropa">ALDERETE NICOLAS ALBERTO</option>
                                <option value="alimentos">ARAGONA AGUSTIN</option>
                                <option value="hogar">ARRIAZA CRISTHIAN GASTON</option>
                              </>
                            ) : (
                              <>
                                <option value="activo">ASOFARMA</option>
                                <option value="inactivo">BACUER</option>
                                <option value="pendiente">BASIGALUPO</option>
                              </>
                            )}
                          </select>
                        ) : (
                          <input
                            ref={(el) => { cellRefs.current[cellId] = el }}
                            type="text"
                            className="w-full bg-transparent outline-none"
                            placeholder=""
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                            onFocus={() => setSelectedCell(cellId)}
                          />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCell && (
          <div className="mt-4 text-sm text-muted-foreground">
            Celda seleccionada: <span className="font-semibold text-foreground">{selectedCell}</span>
          </div>
        )}
      </div>
    </div>
  )
}
