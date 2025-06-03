"use client"

import { useState, useEffect } from "react"
import type { FixedIntervalData, FixedIntervalResults } from "../types/inventory"

// Hook para calcular el Stock de Seguridad y el Inventario Máximo
// basado en el modelo de intervalo fijo, usando los datos de entrada proporcionados.
export function useFixedIntervalCalculation(data: FixedIntervalData): FixedIntervalResults {
  // Estado local para almacenar los resultados calculados
  const [results, setResults] = useState<FixedIntervalResults>({
    stockSeguridad: 0,   // Stock de seguridad calculado
    inventarioMaximo: 0, // Inventario máximo calculado
  })

  // useEffect se ejecuta cada vez que cambian los datos de entrada 'data'
  useEffect(() => {
    // Validar que los valores de entrada sean válidos (positivos y lógicos)
    if (
      data.demandaPromedioDiaria <= 0 ||
      data.tiempoEntrega <= 0 ||
      data.intervaloRevision <= 0 ||
      data.nivelServicio <= 0 ||
      data.desviacionDemanda < 0
    ) {
      // Si alguna condición no se cumple, no realizar cálculos y salir
      return
    }

    // Determinar el factor Z según el nivel de servicio
    // Factor Z es el valor crítico de la distribución normal estándar
    // que corresponde al nivel de servicio deseado
    let factorZ = 0
    if (data.nivelServicio >= 99.9) factorZ = 3.09
    else if (data.nivelServicio >= 99) factorZ = 2.33
    else if (data.nivelServicio >= 98) factorZ = 2.05
    else if (data.nivelServicio >= 97) factorZ = 1.88
    else if (data.nivelServicio >= 96) factorZ = 1.75
    else if (data.nivelServicio >= 95) factorZ = 1.65
    else if (data.nivelServicio >= 90) factorZ = 1.28
    else if (data.nivelServicio >= 85) factorZ = 1.04
    else if (data.nivelServicio >= 80) factorZ = 0.84
    else if (data.nivelServicio >= 75) factorZ = 0.67
    else factorZ = 0.5

    // Cálculo del Stock de Seguridad (SS)
    // Fórmula: SS = Z * σ * sqrt(P + L)
    // Donde:
    // - Z: factor de seguridad según nivel de servicio
    // - σ: desviación estándar de la demanda diaria
    // - P: intervalo de revisión (días)
    // - L: tiempo de entrega (días)
    const stockSeguridad = factorZ * data.desviacionDemanda * Math.sqrt(data.intervaloRevision + data.tiempoEntrega)

    // Cálculo del Inventario Máximo (M)
    // Fórmula: M = d * (P + L) + SS
    // Donde:
    // - d: demanda promedio diaria
    // - P: intervalo de revisión (días)
    // - L: tiempo de entrega (días)
    // - SS: stock de seguridad
    const inventarioMaximo = data.demandaPromedioDiaria * (data.intervaloRevision + data.tiempoEntrega) + stockSeguridad

    // Actualizar el estado con los resultados redondeados
    setResults({
      stockSeguridad: Math.round(stockSeguridad),
      inventarioMaximo: Math.round(inventarioMaximo),
    })
  }, [data]) // Se recalcula si cambian los datos de entrada

  // Retorna el objeto con stock de seguridad e inventario máximo calculados
  return results
}
