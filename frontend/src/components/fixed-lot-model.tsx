"use client"

import type React from "react"
import { useState } from "react"
import type { FixedLotData } from "../types/inventory"
import { useFixedLotCalculation } from "../hooks/use-fixed-lot-calculation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"

/**
 * Componente que implementa el modelo de inventario de Lote Fijo (EOQ).
 * Permite al usuario ingresar parámetros y calcula:
 * - Lote óptimo de pedido (EOQ)
 * - Punto de pedido
 * - Stock de seguridad
 */
export function FixedLotModel() {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState<FixedLotData>({
    demandaAnual: 1000,
    costoOrden: 50,
    costoMantenimiento: 20,
    costoUnitario: 10,
    tiempoEntrega: 7,
    diasLaborables: 250,
    nivelServicio: 95,
    desviacionDemanda: 5,
  })

  // Hook personalizado que realiza los cálculos del modelo de lote fijo
  const results = useFixedLotCalculation(formData)

  // Maneja los cambios en los inputs y actualiza el estado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }))
  }

  return (
    <Card>
      {/* Encabezado del card con título y descripción */}
      <CardHeader>
        <CardTitle>Modelo de Lote Fijo</CardTitle>
        <CardDescription>Calcula el Lote Óptimo, Punto de Pedido y Stock de Seguridad</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Contenedor con layout en 2 columnas para datos de entrada y resultados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sección de datos de entrada */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos de Entrada</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Input: demanda anual */}
              <div className="space-y-2">
                <Label htmlFor="demandaAnual">Demanda Anual (unidades)</Label>
                <Input
                  id="demandaAnual"
                  name="demandaAnual"
                  type="number"
                  value={formData.demandaAnual}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input: costo por orden */}
              <div className="space-y-2">
                <Label htmlFor="costoOrden">Costo de Orden ($)</Label>
                <Input
                  id="costoOrden"
                  name="costoOrden"
                  type="number"
                  value={formData.costoOrden}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input: costo de mantenimiento anual (%) */}
              <div className="space-y-2">
                <Label htmlFor="costoMantenimiento">Costo de Mantenimiento (%)</Label>
                <Input
                  id="costoMantenimiento"
                  name="costoMantenimiento"
                  type="number"
                  value={formData.costoMantenimiento}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input: costo unitario del artículo */}
              <div className="space-y-2">
                <Label htmlFor="costoUnitario">Costo Unitario ($)</Label>
                <Input
                  id="costoUnitario"
                  name="costoUnitario"
                  type="number"
                  value={formData.costoUnitario}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input: tiempo de entrega en días */}
              <div className="space-y-2">
                <Label htmlFor="tiempoEntrega">Tiempo de Entrega (días)</Label>
                <Input
                  id="tiempoEntrega"
                  name="tiempoEntrega"
                  type="number"
                  value={formData.tiempoEntrega}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input: días laborables por año */}
              <div className="space-y-2">
                <Label htmlFor="diasLaborables">Días Laborables por Año</Label>
                <Input
                  id="diasLaborables"
                  name="diasLaborables"
                  type="number"
                  value={formData.diasLaborables}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input: nivel de servicio deseado */}
              <div className="space-y-2">
                <Label htmlFor="nivelServicio">Nivel de Servicio (%)</Label>
                <Input
                  id="nivelServicio"
                  name="nivelServicio"
                  type="number"
                  value={formData.nivelServicio}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input: desviación estándar de la demanda diaria */}
              <div className="space-y-2">
                <Label htmlFor="desviacionDemanda">Desviación Estándar (demanda diaria)</Label>
                <Input
                  id="desviacionDemanda"
                  name="desviacionDemanda"
                  type="number"
                  value={formData.desviacionDemanda}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Sección de resultados */}
          <div>
            <h3 className="text-lg font-medium mb-4">Resultados</h3>
            <div className="rounded-md border p-6 space-y-4">
              {/* Resultado: lote óptimo (EOQ) */}
              <div>
                <p className="text-sm text-muted-foreground">Lote Óptimo (EOQ)</p>
                <p className="text-2xl font-bold">{results.loteOptimo} unidades</p>
              </div>

              <Separator />

              {/* Resultado: punto de pedido */}
              <div>
                <p className="text-sm text-muted-foreground">Punto de Pedido</p>
                <p className="text-2xl font-bold">{results.puntoPedido} unidades</p>
              </div>

              <Separator />

              {/* Resultado: stock de seguridad */}
              <div>
                <p className="text-sm text-muted-foreground">Stock de Seguridad</p>
                <p className="text-2xl font-bold">{results.stockSeguridad} unidades</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
