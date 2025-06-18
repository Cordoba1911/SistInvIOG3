"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  Form,
  Row,
  Col,
  ListGroup,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap"
import { useFixedIntervalCalculation } from "../../hooks/use-fixed-interval-calculation"
import type { FixedIntervalData } from "../../types/inventory"
import { saveFixedIntervalData } from "../../services/fixedIntervalService"

export function FixedIntervalModel() {
  const [formData, setFormData] = useState<FixedIntervalData>({
    demandaPromedioDiaria: 40,
    tiempoEntrega: 5,
    intervaloRevision: 14,
    nivelServicio: 95,
    desviacionDemanda: 8,
  })

  const results = useFixedIntervalCalculation(formData)

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      await saveFixedIntervalData({ ...formData, ...results })
      setSuccess("Modelo guardado correctamente.")
    } catch (e: any) {
      setError(e.message || "Error inesperado al guardar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="mb-4">
      <Card.Header>
        <Card.Title>Modelo de Intervalo Fijo</Card.Title>
        <Card.Subtitle className="text-muted">
          Calcula el Stock de Seguridad e Inventario Máximo
        </Card.Subtitle>
      </Card.Header>

      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Row>
          <Col md={6}>
            <h5 className="mb-3">Datos de Entrada</h5>
            <Form>
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

          <Col md={6}>
            <h5 className="mb-3">Resultados</h5>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Stock de Seguridad</span>
                    <span className="fw-bold fs-5">{results.stockSeguridad} unidades</span>
                  </div>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Inventario Máximo</span>
                    <span className="fw-bold fs-5">{results.inventarioMaximo} unidades</span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card>
            <div className="mt-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Spinner size="sm" animation="border" /> : "Guardar Modelo"}
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
