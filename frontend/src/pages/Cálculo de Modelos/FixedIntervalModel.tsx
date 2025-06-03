"use client" // Directiva de Next.js para habilitar el uso del cliente (hooks, eventos, etc.)

import type React from "react"
import { useState } from "react"
import { Card, Form, Row, Col, ListGroup } from "react-bootstrap" // Componentes de Bootstrap para la interfaz
import { useFixedIntervalCalculation } from "../../hooks/use-fixed-interval-calculation" // Hook personalizado para los cálculos del modelo
import type { FixedIntervalData } from "../../types/inventory" // Tipo de datos esperado para el formulario

export function FixedIntervalModel() {
  // Estado local para manejar los datos de entrada del formulario
  const [formData, setFormData] = useState<FixedIntervalData>({
    demandaPromedioDiaria: 40,
    tiempoEntrega: 5,
    intervaloRevision: 14,
    nivelServicio: 95,
    desviacionDemanda: 8,
  })

  // Resultados calculados usando el hook personalizado
  const results = useFixedIntervalCalculation(formData)

  // Función para manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0, // Convierte el valor a número o 0 si es inválido
    }))
  }

  return (
    <Card className="mb-4"> {/* Contenedor principal del componente */}
      <Card.Header>
        <Card.Title>Modelo de Intervalo Fijo</Card.Title> {/* Título del modelo */}
        <Card.Subtitle className="text-muted">
          Calcula el Stock de Seguridad e Inventario Máximo {/* Subtítulo explicativo */}
        </Card.Subtitle>
      </Card.Header>

      <Card.Body>
        <Row>
          {/* Columna izquierda: formulario de entrada */}
          <Col md={6}>
            <h5 className="mb-3">Datos de Entrada</h5>
            <Form>
              {/* Primera fila de inputs */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Demanda Promedio Diaria</Form.Label>
                    <Form.Control
                      type="number"
                      name="demandaPromedioDiaria"
                      value={formData.demandaPromedioDiaria}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tiempo de Entrega (días)</Form.Label>
                    <Form.Control
                      type="number"
                      name="tiempoEntrega"
                      value={formData.tiempoEntrega}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Segunda fila de inputs */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Intervalo de Revisión (días)</Form.Label>
                    <Form.Control
                      type="number"
                      name="intervaloRevision"
                      value={formData.intervaloRevision}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nivel de Servicio (%)</Form.Label>
                    <Form.Control
                      type="number"
                      name="nivelServicio"
                      value={formData.nivelServicio}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Tercera fila: solo un input */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Desviación Estándar (demanda diaria)</Form.Label>
                    <Form.Control
                      type="number"
                      name="desviacionDemanda"
                      value={formData.desviacionDemanda}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Col>

          {/* Columna derecha: resultados calculados */}
          <Col md={6}>
            <h5 className="mb-3">Resultados</h5>
            <Card>
              <ListGroup variant="flush">
                {/* Resultado: Stock de Seguridad */}
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Stock de Seguridad</span>
                    <span className="fw-bold fs-5">{results.stockSeguridad} unidades</span>
                  </div>
                </ListGroup.Item>

                {/* Resultado: Inventario Máximo */}
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Inventario Máximo</span>
                    <span className="fw-bold fs-5">{results.inventarioMaximo} unidades</span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
