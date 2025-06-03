"use client"

import { useState, useEffect } from "react"
import type { FixedLotData, FixedLotResults } from "../types/inventory"

// Hook para calcular el Lote Óptimo, Punto de Pedido y Stock de Seguridad
// basado en el modelo de lote fijo (EOQ y control de inventarios).
export function useFixedLotCalculation(data: FixedLotData): FixedLotResults {
  // Estado local para almacenar los resultados calculados
  const [results, setResults] = useState<FixedLotResults>({
    loteOptimo: 0,      // Cantidad óptima de pedido (EOQ)
    puntoPedido: 0,     // Nivel en el que se debe hacer un nuevo pedido
    stockSeguridad: 0,  // Stock de seguridad para proteger contra incertidumbres
  })

  // useEffect para recalcular resultados cuando cambian los datos de entrada
  useEffect(() => {
    // Validar que todos los valores de entrada sean positivos y tengan sentido
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
      // Si alguna validación falla, salir sin actualizar resultados
      return
    }

    // Cálculo del Lote Óptimo (EOQ - Economic Order Quantity)
    // EOQ = sqrt(2 * D * S / (I * C))
    // D = Demanda anual
    // S = Costo de ordenar por pedido
    // I = Costo de mantenimiento como porcentaje del costo unitario
    // C = Costo unitario del producto
    const loteOptimo = Math.sqrt(
      (2 * data.demandaAnual * data.costoOrden) / ((data.costoMantenimiento / 100) * data.costoUnitario),
    )

    // Cálculo del factor Z (valor crítico normal) basado en el nivel de servicio
    // Factor Z se usa para calcular el stock de seguridad y depende del nivel deseado de servicio
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

    // Cálculo del Stock de Seguridad
    // Fórmula: SS = Z * σ * sqrt(L)
    // Z = factor de seguridad
    // σ = desviación estándar diaria de la demanda
    // L = tiempo de entrega en días
    const stockSeguridad = factorZ * data.desviacionDemanda * Math.sqrt(data.tiempoEntrega)

    // Cálculo del Punto de Pedido
    // Fórmula: PP = (D / días laborables) * L + SS
    // D = demanda anual
    // L = tiempo de entrega en días
    // SS = stock de seguridad
    const demandaDiaria = data.demandaAnual / data.diasLaborables
    const puntoPedido = demandaDiaria * data.tiempoEntrega + stockSeguridad

    // Actualizar el estado con los resultados redondeados
    setResults({
      loteOptimo: Math.round(loteOptimo),
      puntoPedido: Math.round(puntoPedido),
      stockSeguridad: Math.round(stockSeguridad),
    })
  }, [data]) // Se ejecuta cada vez que cambia el objeto data

  // Retorna los resultados calculados para su uso en componentes
  return results
}
