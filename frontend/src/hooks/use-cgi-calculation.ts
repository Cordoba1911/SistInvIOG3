"use client"

import { useState, useEffect } from "react"
import type { CGIItem, CGIResults } from "../types/inventory"

// Hook personalizado que recibe un array de items y calcula la clasificación ABC (CGI)
export function useCGICalculation(items: CGIItem[]): CGIResults {
  // Estado local para almacenar los resultados del cálculo: items clasificados y total valor anual
  const [results, setResults] = useState<CGIResults>({
    items: [],            // Array de items con clasificación ABC
    totalValorAnual: 0,   // Suma total del valor anual de todos los items
  })

  // useEffect se ejecuta cada vez que cambia el array 'items'
  useEffect(() => {
    // Si no hay items, resetear resultados a estado inicial
    if (items.length === 0) {
      setResults({
        items: [],
        totalValorAnual: 0,
      })
      return // Salir del efecto
    }

    // Calcular el valor total anual sumando valorAnual de todos los items
    const totalValorAnual = items.reduce((sum, item) => sum + item.valorAnual, 0)

    // Crear una copia de items ordenada de mayor a menor según valorAnual
    const sortedItems = [...items].sort((a, b) => b.valorAnual - a.valorAnual)

    // Variable para acumular el valor anual a medida que recorremos los items
    let acumulado = 0

    // Mapear cada item para asignarle su clasificación ABC según porcentaje acumulado
    const classifiedItems = sortedItems.map((item) => {
      acumulado += item.valorAnual
      const porcentajeAcumulado = (acumulado / totalValorAnual) * 100

      // Determinar la categoría ABC según porcentaje acumulado
      let clasificacion: "A" | "B" | "C"
      if (porcentajeAcumulado <= 80) {
        clasificacion = "A"  // Los primeros 80% del valor acumulado son clase A
      } else if (porcentajeAcumulado <= 95) {
        clasificacion = "B"  // Siguiente 15% son clase B
      } else {
        clasificacion = "C"  // Últimos 5% son clase C
      }

      // Devolver el item original con la propiedad nueva 'clasificacion'
      return {
        ...item,
        clasificacion,
      }
    })

    // Actualizar el estado con los items clasificados y el total calculado
    setResults({
      items: classifiedItems,
      totalValorAnual,
    })
  }, [items]) // Dependencia: se vuelve a calcular si cambia 'items'

  // Retornar los resultados para que el componente que use este hook pueda acceder a ellos
  return results
}
