"use client" // Indica que este componente se ejecuta del lado del cliente (Next.js)

// Importaciones de React y librerías necesarias
import type React from "react"
import { useState } from "react"
import { Card, Form, Row, Col, Button, Table, Badge } from "react-bootstrap" // Componentes de Bootstrap
import { useCGICalculation } from "../../hooks/use-cgi-calculation" // Hook personalizado para calcular CGI
import type { CGIItem } from "../../types/inventory" // Tipo de dato de cada ítem del inventario

// Componente principal para la calculadora de CGI (Clasificación ABC)
export function CGICalculation() {
  // Estado con lista inicial de artículos de ejemplo
  const [items, setItems] = useState<CGIItem[]>([
    { id: "1", nombre: "Producto A", valorAnual: 50000 },
    { id: "2", nombre: "Producto B", valorAnual: 25000 },
    { id: "3", nombre: "Producto C", valorAnual: 10000 },
    { id: "4", nombre: "Producto D", valorAnual: 5000 },
    { id: "5", nombre: "Producto E", valorAnual: 1000 },
  ])

  // Estado para el nuevo artículo a agregar
  const [newItem, setNewItem] = useState<{ nombre: string; valorAnual: number }>({
    nombre: "",
    valorAnual: 0,
  })

  // Resultado del cálculo CGI (clasificación ABC)
  const results = useCGICalculation(items)

  // Maneja el agregado de un nuevo artículo
  const handleAddItem = () => {
    if (newItem.nombre && newItem.valorAnual > 0) {
      const id = `item-${Date.now()}` // Genera un ID único basado en timestamp
      setItems([...items, { id, ...newItem }]) // Agrega el nuevo artículo a la lista
      setNewItem({ nombre: "", valorAnual: 0 }) // Resetea los campos del formulario
    }
  }

  // Elimina un artículo de la lista por ID
  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  // Maneja el cambio de valores en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "valorAnual" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  // Devuelve la variante de color de Bootstrap según la clasificación
  const getClassificationVariant = (classification?: "A" | "B" | "C") => {
    switch (classification) {
      case "A":
        return "success" // Verde
      case "B":
        return "warning" // Amarillo
      case "C":
        return "danger" // Rojo
      default:
        return "secondary" // Gris
    }
  }

  return (
    // Contenedor principal del cálculo CGI
    <Card className="mb-4">
      <Card.Header>
        <Card.Title>Cálculo del CGI (Clasificación ABC)</Card.Title>
        <Card.Subtitle className="text-muted">
          Clasifica los artículos según su valor anual de consumo
        </Card.Subtitle>
      </Card.Header>
      <Card.Body>
        {/* Formulario para ingresar nuevo artículo */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Artículo</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={newItem.nombre}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Valor Anual de Consumo ($)</Form.Label>
              <Form.Control
                type="number"
                name="valorAnual"
                value={newItem.valorAnual || ""}
                onChange={handleInputChange}
                placeholder="Ingrese el valor anual"
              />
            </Form.Group>
          </Col>
          {/* Botón para agregar nuevo artículo */}
          <Col md={4} className="d-flex align-items-end">
            <Button variant="primary" onClick={handleAddItem} className="mb-3">
              Agregar Artículo
            </Button>
          </Col>
        </Row>

        {/* Tabla que muestra los artículos y su clasificación */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th className="text-end">Valor Anual ($)</th>
              <th>Clasificación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {results.items.length > 0 ? (
              results.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td className="text-end">{item.valorAnual.toLocaleString()}</td>
                  <td>
                    {/* Muestra la clasificación con color */}
                    {item.clasificacion && (
                      <Badge bg={getClassificationVariant(item.clasificacion)}>
                        {item.clasificacion}
                      </Badge>
                    )}
                  </td>
                  {/* Botón para eliminar el artículo */}
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              // Mensaje cuando no hay artículos cargados
              <tr>
                <td colSpan={4} className="text-center py-3 text-muted">
                  No hay artículos. Agregue al menos un artículo para calcular el CGI.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Muestra el resumen de clasificación solo si hay artículos */}
        {results.items.length > 0 && (
          <Card className="mt-4">
            <Card.Body>
              <h5>Resumen de Clasificación ABC</h5>
              <p className="text-muted mb-4">
                Valor Total Anual: ${results.totalValorAnual.toLocaleString()}
              </p>

              <Row>
                {/* Resumen de Clase A */}
                <Col md={4}>
                  <Card bg="light">
                    <Card.Body>
                      <h6 className="text-success">Clase A</h6>
                      <p>{results.items.filter((i) => i.clasificacion === "A").length} artículos</p>
                      <small className="text-muted">80% del valor total</small>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Resumen de Clase B */}
                <Col md={4}>
                  <Card bg="light">
                    <Card.Body>
                      <h6 className="text-warning">Clase B</h6>
                      <p>{results.items.filter((i) => i.clasificacion === "B").length} artículos</p>
                      <small className="text-muted">15% del valor total</small>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Resumen de Clase C */}
                <Col md={4}>
                  <Card bg="light">
                    <Card.Body>
                      <h6 className="text-danger">Clase C</h6>
                      <p>{results.items.filter((i) => i.clasificacion === "C").length} artículos</p>
                      <small className="text-muted">5% del valor total</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
      </Card.Body>
    </Card>
  )
}
