"use client"

import { useState, useEffect } from "react"
import type { FixedIntervalData, FixedIntervalResults } from "../types/inventory"

// Reutilizamos la función para calcular el factor Z según el nivel de servicio
function calcularFactorZ(nivelServicio: number): number {
  if (nivelServicio >= 99.9) return 3.09
  if (nivelServicio >= 99) return 2.33
  if (nivelServicio >= 98) return 2.05
  if (nivelServicio >= 97) return 1.88
  if (nivelServicio >= 96) return 1.75
  if (nivelServicio >= 95) return 1.65
  if (nivelServicio >= 90) return 1.28
  if (nivelServicio >= 85) return 1.04
  if (nivelServicio >= 80) return 0.84
  if (nivelServicio >= 75) return 0.67
  return 0.5
}

export function useFixedIntervalCalculation(data: FixedIntervalData): FixedIntervalResults {
  const [results, setResults] = useState<FixedIntervalResults>({
    stockSeguridad: 0,
    inventarioMaximo: 0,
  })

  useEffect(() => {
    if (
      data.demandaPromedioDiaria <= 0 ||
      data.tiempoEntrega <= 0 ||
      data.intervaloRevision <= 0 ||
      data.nivelServicio <= 0 ||
      data.desviacionDemanda < 0
    ) {
      return
    }

    const factorZ = calcularFactorZ(data.nivelServicio)
    const periodoTotal = data.intervaloRevision + data.tiempoEntrega

    const stockSeguridad = factorZ * data.desviacionDemanda * Math.sqrt(periodoTotal)
    const inventarioMaximo = data.demandaPromedioDiaria * periodoTotal + stockSeguridad

    if (
      !Number.isFinite(stockSeguridad) ||
      !Number.isFinite(inventarioMaximo)
    ) {
      return
    }

    setResults({
      stockSeguridad: Math.round(stockSeguridad),
      inventarioMaximo: Math.round(inventarioMaximo),
    })
  }, [data])

  return results
}
