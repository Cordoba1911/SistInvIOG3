"use client"

import { useState, useEffect } from "react"
import type { CGIItem, CGIResults } from "../types/inventory"

export function useCGICalculation(items: CGIItem[]): CGIResults {
  const [results, setResults] = useState<CGIResults>({
    items: [],
    totalValorAnual: 0,
  })

  useEffect(() => {
    if (items.length === 0) {
      setResults({
        items: [],
        totalValorAnual: 0,
      })
      return
    }

    // Filtrar solo items válidos con valorAnual numérico y positivo
    const validItems = items.filter((item) => Number.isFinite(item.valorAnual) && item.valorAnual > 0)

    const totalValorAnual = validItems.reduce((sum, item) => sum + item.valorAnual, 0)

    if (!Number.isFinite(totalValorAnual) || totalValorAnual === 0) {
      setResults({
        items: [],
        totalValorAnual: 0,
      })
      return
    }

    const sortedItems = [...validItems].sort((a, b) => b.valorAnual - a.valorAnual)
    let acumulado = 0

    const classifiedItems = sortedItems.map((item) => {
      acumulado += item.valorAnual
      const porcentajeAcumulado = (acumulado / totalValorAnual) * 100

      let clasificacion: "A" | "B" | "C"
      if (porcentajeAcumulado <= 80) clasificacion = "A"
      else if (porcentajeAcumulado <= 95) clasificacion = "B"
      else clasificacion = "C"

      return { ...item, clasificacion }
    })

    setResults({
      items: classifiedItems,
      totalValorAnual,
    })
  }, [items])

  return results
}
