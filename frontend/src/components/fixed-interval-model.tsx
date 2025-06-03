"use client"

import type React from "react"
import { useState } from "react"
import type { FixedIntervalData } from "../types/inventory"
import { useFixedIntervalCalculation } from "../hooks/use-fixed-interval-calculation"
import { Card, CardHeader, CardTitle } from "react-bootstrap"
import { CardContent, CardDescription } from "./ui/card"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"
import { Label } from "./ui/label"

/**
 * Componente que representa el Modelo de Intervalo Fijo.
 * Permite ingresar parámetros del sistema de inventario y calcula:
 * - Stock de Seguridad
 * - Inventario Máximo
 */
export function FixedIntervalModel() {
  // Estado para almacenar los datos de entrada del formulario
  const [formData, setFormData] = useState<FixedIntervalData>({
    demandaPromedioDiaria: 40,
    tiempoEntrega: 5,
    intervaloRevision: 14,
    nivelServicio: 95,
    desviacionDemanda: 8,
  })

  // Calcula los resultados del modelo basado en los datos de entrada
  const results = useFixedIntervalCalculation(formData)

  // Maneja cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modelo de Intervalo Fijo</CardTitle>
        <CardDescription>Calcula el Stock de Seguridad e Inventario Máximo</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sección de entrada de datos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos de Entrada</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Demanda promedio diaria */}
              <div className="space-y-2">
                <Label htmlFor="demandaPromedioDiaria">Demanda Promedio Diaria</Label>
                <Input
                  id="demandaPromedioDiaria"
                  name="demandaPromedioDiaria"
                  type="number"
                  value={formData.demandaPromedioDiaria}
                  onChange={handleInputChange}
                />
              </div>

              {/* Tiempo de entrega en días */}
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

              {/* Intervalo de revisión en días */}
              <div className="space-y-2">
                <Label htmlFor="intervaloRevision">Intervalo de Revisión (días)</Label>
                <Input
                  id="intervaloRevision"
                  name="intervaloRevision"
                  type="number"
                  value={formData.intervaloRevision}
                  onChange={handleInputChange}
                />
              </div>

              {/* Nivel de servicio deseado */}
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

              {/* Desviación estándar de la demanda diaria */}
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
              {/* Resultado: Stock de seguridad */}
              <div>
                <p className="text-sm text-muted-foreground">Stock de Seguridad</p>
                <p className="text-2xl font-bold">{results.stockSeguridad} unidades</p>
              </div>

              <Separator />

              {/* Resultado: Inventario máximo */}
              <div>
                <p className="text-sm text-muted-foreground">Inventario Máximo</p>
                <p className="text-2xl font-bold">{results.inventarioMaximo} unidades</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
