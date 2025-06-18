"use client"

import type React from "react"
import { useState } from "react"
import { Card, Form, Row, Col, ListGroup, Button } from "react-bootstrap"
import { useFixedLotCalculation } from "../../hooks/use-fixed-lot-calculation"
import type { FixedLotData } from "../../types/inventory"
import { saveFixedLotData } from "../../services/fixedLotService"

export function FixedLotModel() {
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

  const results = useFixedLotCalculation(formData)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }))
  }

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      await saveFixedLotData({ ...formData, ...results })
      setSaveSuccess(true)
    } catch (e: any) {
      setSaveError(e.message || "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="mb-4">
      <Card.Header>
        <Card.Title>Modelo de Lote Fijo</Card.Title>
        <Card.Subtitle className="text-muted">
          Calcula el Lote Óptimo, Punto de Pedido y Stock de Seguridad
        </Card.Subtitle>
      </Card.Header>

      <Card.Body>
        <Row>
          <Col md={6}>
            <h5 className="mb-3">Datos de Entrada</h5>
            <Form>
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

          <Col md={6}>
            <h5 className="mb-3">Resultados</h5>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Lote Óptimo (EOQ)</span>
                    <span className="fw-bold fs-5">{results.loteOptimo} unidades</span>
                  </div>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Punto de Pedido</span>
                    <span className="fw-bold fs-5">{results.puntoPedido} unidades</span>
                  </div>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Stock de Seguridad</span>
                    <span className="fw-bold fs-5">{results.stockSeguridad} unidades</span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card>

            <div className="mt-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Guardando..." : "Guardar Modelo"}
              </Button>
              {saveSuccess && <p className="text-success mt-2">Guardado exitoso</p>}
              {saveError && <p className="text-danger mt-2">{saveError}</p>}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
