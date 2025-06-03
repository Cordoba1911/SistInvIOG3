"use client" // Indica que este componente se renderiza del lado del cliente (Next.js)

import type React from "react"
import { useState } from "react"
import { Card, Form, Row, Col, ListGroup } from "react-bootstrap" // Componentes de Bootstrap para UI
import { useFixedLotCalculation } from "../../hooks/use-fixed-lot-calculation" // Hook personalizado con la lógica de cálculo
import type { FixedLotData } from "../../types/inventory" // Tipado de los datos del formulario

export function FixedLotModel() {
  // Estado local que guarda los datos del formulario
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

  // Hook que calcula los resultados del modelo en base a los datos ingresados
  const results = useFixedLotCalculation(formData)

  // Maneja el cambio de cualquier input numérico
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0, // Convierte a número o usa 0 si es NaN
    }))
  }

  return (
    <Card className="mb-4"> {/* Contenedor principal con margen inferior */}
      <Card.Header>
        <Card.Title>Modelo de Lote Fijo</Card.Title> {/* Título del componente */}
        <Card.Subtitle className="text-muted">
          Calcula el Lote Óptimo, Punto de Pedido y Stock de Seguridad
        </Card.Subtitle>
      </Card.Header>

      <Card.Body>
        <Row>
          {/* Columna izquierda: Formulario de entrada */}
          <Col md={6}>
            <h5 className="mb-3">Datos de Entrada</h5>
            <Form>
              {/* Fila 1: Demanda anual y costo de orden */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Demanda Anual (unidades)</Form.Label>
                    <Form.Control
                      type="number"
                      name="demandaAnual"
                      value={formData.demandaAnual}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Costo de Orden ($)</Form.Label>
                    <Form.Control
                      type="number"
                      name="costoOrden"
                      value={formData.costoOrden}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Fila 2: Costo de mantenimiento y costo unitario */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Costo de Mantenimiento (%)</Form.Label>
                    <Form.Control
                      type="number"
                      name="costoMantenimiento"
                      value={formData.costoMantenimiento}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Costo Unitario ($)</Form.Label>
                    <Form.Control
                      type="number"
                      name="costoUnitario"
                      value={formData.costoUnitario}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Fila 3: Tiempo de entrega y días laborables */}
              <Row>
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

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Días Laborables por Año</Form.Label>
                    <Form.Control
                      type="number"
                      name="diasLaborables"
                      value={formData.diasLaborables}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Fila 4: Nivel de servicio y desviación estándar */}
              <Row>
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

          {/* Columna derecha: Resultados calculados */}
          <Col md={6}>
            <h5 className="mb-3">Resultados</h5>
            <Card>
              <ListGroup variant="flush">
                {/* Resultado: Lote Óptimo (EOQ) */}
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Lote Óptimo (EOQ)</span>
                    <span className="fw-bold fs-5">{results.loteOptimo} unidades</span>
                  </div>
                </ListGroup.Item>

                {/* Resultado: Punto de Pedido */}
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Punto de Pedido</span>
                    <span className="fw-bold fs-5">{results.puntoPedido} unidades</span>
                  </div>
                </ListGroup.Item>

                {/* Resultado: Stock de Seguridad */}
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Stock de Seguridad</span>
                    <span className="fw-bold fs-5">{results.stockSeguridad} unidades</span>
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
