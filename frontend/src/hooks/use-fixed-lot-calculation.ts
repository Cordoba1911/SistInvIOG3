"use client"

import { useState, useEffect } from "react"
import type { FixedLotData, FixedLotResults } from "../types/inventory"

// Función para obtener el valor Z según el nivel de servicio
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

export function useFixedLotCalculation(data: FixedLotData): FixedLotResults {
  const [results, setResults] = useState<FixedLotResults>({
    loteOptimo: 0,
    puntoPedido: 0,
    stockSeguridad: 0,
  })

  useEffect(() => {
    if (
      data.demandaAnual <= 0 ||
      data.costoOrden <= 0 ||
      data.costoMantenimiento <= 0 ||
      data.costoUnitario <= 0 ||
      data.tiempoEntrega <= 0 ||
      data.diasLaborables <= 0 ||
      data.nivelServicio <= 0 ||
      data.desviacionDemanda < 0
    ) {
      return
    }

    const H = (data.costoMantenimiento / 100) * data.costoUnitario
    const loteOptimo = Math.sqrt((2 * data.demandaAnual * data.costoOrden) / H)

    const factorZ = calcularFactorZ(data.nivelServicio)
    const stockSeguridad = factorZ * data.desviacionDemanda * Math.sqrt(data.tiempoEntrega)

    const demandaDiaria = data.demandaAnual / data.diasLaborables
    const puntoPedido = demandaDiaria * data.tiempoEntrega + stockSeguridad

    // Validación extra para evitar NaN o Infinity
    if (
      !Number.isFinite(loteOptimo) ||
      !Number.isFinite(stockSeguridad) ||
      !Number.isFinite(puntoPedido)
    ) {
      return
    }

    setResults({
      loteOptimo: Math.round(loteOptimo),
      puntoPedido: Math.round(puntoPedido),
      stockSeguridad: Math.round(stockSeguridad),
    })
  }, [data])

  return results
}
