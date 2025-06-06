// Declaración para usar React en modo cliente (útil en Next.js con App Router)
"use client"

// Importación de tipos de React
import type React from "react"

// Importación de hooks y componentes necesarios
import { useState } from "react"

import { Input } from "./ui/input"
import type { CGIItem } from "../types/inventory"
import { useCGICalculation } from "../hooks/use-cgi-calculation"
import { Badge, Button, Card, CardHeader, CardTitle, Table } from "react-bootstrap"
import { CardContent, CardDescription } from "./ui/card"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

// Componente principal para calcular el CGI (Clasificación ABC)
export function CGICalculation() {
  // Estado que contiene la lista de artículos actuales
  const [items, setItems] = useState<CGIItem[]>([
   
  ])

  // Estado para el nuevo artículo que se está ingresando
  const [newItem, setNewItem] = useState<{ nombre: string; valorAnual: number }>({
    nombre: "",
    valorAnual: 0,
  })

  // Cálculo de clasificación ABC usando el custom hook
  const results = useCGICalculation(items)

  // Función para agregar un nuevo artículo
  const handleAddItem = () => {
    if (newItem.nombre && newItem.valorAnual > 0) {
      const id = `item-${Date.now()}`
      setItems([...items, { id, ...newItem }])
      setNewItem({ nombre: "", valorAnual: 0 })
    }
  }

  // Función para eliminar un artículo existente
  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  // Maneja los cambios en los inputs del formulario de nuevo artículo
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "valorAnual" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  // Devuelve la clase CSS según la clasificación A, B o C
  const getClassificationColor = (classification?: "A" | "B" | "C") => {
    switch (classification) {
      case "A":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "B":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "C":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    // Tarjeta principal que contiene todo el contenido del componente
    <Card>
      {/* Encabezado con título y descripción */}
      <CardHeader>
        <CardTitle>Cálculo del CGI (Clasificación ABC)</CardTitle>
        <CardDescription>Clasifica los artículos según su valor anual de consumo</CardDescription>
      </CardHeader>

      {/* Contenido de la tarjeta */}
      <CardContent>
        <div className="space-y-6">
          {/* Formulario para agregar nuevos artículos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Campo de nombre del artículo */}
            <div className="space-y-2">
              <label htmlFor="nombre">Nombre del Artículo</label>
              <Input
                id="nombre"
                name="nombre"
                value={newItem.nombre}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre"
              />
            </div>

            {/* Campo de valor anual de consumo */}
            <div className="space-y-2">
              <label htmlFor="valorAnual">Valor Anual de Consumo ($)</label>
              <Input
                id="valorAnual"
                name="valorAnual"
                type="number"
                value={newItem.valorAnual || ""}
                onChange={handleInputChange}
                placeholder="Ingrese el valor anual"
              />
            </div>

            {/* Botón para agregar artículo */}
            <Button onClick={handleAddItem} className="flex items-center gap-2">
              Agregar Artículo
            </Button>
          </div>

          {/* Tabla que muestra los artículos ingresados */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-right">Valor Anual ($)</TableHead>
                  <TableHead>Clasificación</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Si hay artículos, se muestran en filas */}
                {results.items.length > 0 ? (
                  results.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell className="text-right">{item.valorAnual.toLocaleString()}</TableCell>
                      <TableCell>
                        {item.clasificacion && (
                          <Badge className={getClassificationColor(item.clasificacion)}>
                            {item.clasificacion}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {/* Botón para eliminar artículo */}
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  // Si no hay artículos, se muestra mensaje vacío
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No hay artículos. Agregue al menos un artículo para calcular el CGI.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Resumen visual de la clasificación ABC */}
          {results.items.length > 0 && (
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-medium mb-2">Resumen de Clasificación ABC</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Valor Total Anual: ${results.totalValorAnual.toLocaleString()}
              </p>

              {/* Cuadros para clases A, B y C */}
              <div className="grid grid-cols-3 gap-4">
                {/* Clase A */}
                <div className="p-3 rounded-md bg-green-50">
                  <p className="font-medium text-green-800">Clase A</p>
                  <p className="text-sm text-green-600">
                    {results.items.filter((i) => i.clasificacion === "A").length} artículos
                  </p>
                  <p className="text-xs text-green-500 mt-1">80% del valor total</p>
                </div>

                {/* Clase B */}
                <div className="p-3 rounded-md bg-yellow-50">
                  <p className="font-medium text-yellow-800">Clase B</p>
                  <p className="text-sm text-yellow-600">
                    {results.items.filter((i) => i.clasificacion === "B").length} artículos
                  </p>
                  <p className="text-xs text-yellow-500 mt-1">15% del valor total</p>
                </div>

                {/* Clase C */}
                <div className="p-3 rounded-md bg-red-50">
                  <p className="font-medium text-red-800">Clase C</p>
                  <p className="text-sm text-red-600">
                    {results.items.filter((i) => i.clasificacion === "C").length} artículos
                  </p>
                  <p className="text-xs text-red-500 mt-1">5% del valor total</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
