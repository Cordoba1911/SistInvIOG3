"use client"

import { useEffect, useState } from "react"
import type React from "react"
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Table,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap"

import type { CGIItem } from "../../types/inventory"
import { useCGICalculation } from "../../hooks/use-cgi-calculation"
import {
  addItem,
  deleteItem,
  fetchItems,
  // calculateCGI (si prefieres cálculo en backend)
} from "../../services/cgiService"

/* ---------- Componente -------------------------------------------------- */
export function CGICalculation() {
  /* ----------------- estado ----------------- */
  const [items, setItems] = useState<CGIItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [newItem, setNewItem] = useState<{ nombre: string; valorAnual: number }>({
    nombre: "",
    valorAnual: 0,
  })

  /* ---------------- carga inicial ---------------- */
  useEffect(() => {
    fetchItems()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  /* ---------------- cálculo local ---------------- */
  const results = useCGICalculation(items)

  /* ---------------- handlers ---------------- */
  const handleAddItem = async () => {
    if (!newItem.nombre || newItem.valorAnual <= 0) return

    try {
      const created = await addItem(newItem)
      setItems((prev) => [...prev, created])
      setNewItem({ nombre: "", valorAnual: 0 })
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleRemoveItem = async (id: string) => {
    try {
      await deleteItem(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "valorAnual" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const getBadgeVariant = (c?: "A" | "B" | "C") =>
    c === "A" ? "success" : c === "B" ? "warning" : c === "C" ? "danger" : "secondary"

  /* ---------------- render ---------------- */
  if (loading) return <Spinner animation="border" />

  return (
    <Card className="mb-4">
      <Card.Header>
        <Card.Title>Cálculo del CGI (Clasificación ABC)</Card.Title>
        <Card.Subtitle className="text-muted">
          Clasifica los artículos según su valor anual de consumo
        </Card.Subtitle>
      </Card.Header>

      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        {/* --------- Formulario de alta --------- */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Artículo</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={newItem.nombre}
                onChange={handleInputChange}
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
              />
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <Button onClick={handleAddItem}>Agregar Artículo</Button>
          </Col>
        </Row>

        {/* --------- Tabla principal --------- */}
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
            {items.length ? (
              results.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td className="text-end">{item.valorAnual.toLocaleString()}</td>
                  <td>
                    {item.clasificacion && (
                      <Badge bg={getBadgeVariant(item.clasificacion)}>
                        {item.clasificacion}
                      </Badge>
                    )}
                  </td>
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
              <tr>
                <td colSpan={4} className="text-center text-muted p-3">
                  No hay artículos cargados.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* --------- Resumen ABC --------- */}
        {items.length > 0 && (
          <Card className="mt-4">
            <Card.Body>
              <h5>Resumen de Clasificación ABC</h5>
              <p className="text-muted mb-4">
                Valor Total Anual: ${results.totalValorAnual.toLocaleString()}
              </p>
              <Row>
                {(["A", "B", "C"] as const).map((cls) => (
                  <Col md={4} key={cls}>
                    <Card bg="light">
                      <Card.Body>
                        <h6 className={`text-${getBadgeVariant(cls)}`}>Clase {cls}</h6>
                        <p>{results.items.filter((i) => i.clasificacion === cls).length} artículos</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        )}
      </Card.Body>
    </Card>
  )
}
