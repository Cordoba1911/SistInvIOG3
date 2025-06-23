"use client"

import { useState } from "react"
import { Container, Tabs, Tab, Badge, Card, Col, Row } from "react-bootstrap"
import { FixedLotModel } from "../pages/Cálculo de Modelos/FixedLotModel"
import { FixedIntervalModel } from "../pages/Cálculo de Modelos/FixedIntervalModel"
import { CGICalculation } from "../pages/Cálculo de Modelos/CGICalculation"
import type { Articulo } from "../../types/articulo"

interface Props {
  articulo: Articulo
}

const InventoryCalculations = ({ articulo }: Props) => {
  const formatCurrency = (value: number | undefined | null) => {
    if (value === null || typeof value === 'undefined') return "N/A"
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value)
  }

  const formatNumber = (value: number | undefined | null) => {
    if (value === null || typeof value === 'undefined') return "N/A"
    return `${Math.round(value)} unidades`
  }

  const formatPercentage = (value: number | undefined | null) => {
    if (value === null || typeof value === 'undefined') return "N/A"
    return `${(value * 100).toFixed(1)}%`
  }

  const formatDays = (value: number | undefined | null) => {
    if (value === null || typeof value === 'undefined') return "N/A"
    return `${value.toFixed(1)} días`
  }

  const modeloLabel =
    articulo.modelo_inventario === "lote_fijo" ? "Lote Fijo" : "Período Fijo"

  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Cálculos de Inventario</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <h6>Métricas Principales</h6>
            <p><strong>Stock Actual:</strong> {formatNumber(articulo.stock_actual)}</p>
            <p><strong>Punto de Pedido:</strong> {formatNumber(articulo.punto_pedido)}</p>
            <p><strong>Stock de Seguridad:</strong> {formatNumber(articulo.stock_seguridad)}</p>
            {articulo.modelo_inventario === 'periodo_fijo' && (
              <p><strong>Inventario Máximo:</strong> {formatNumber(articulo.inventario_maximo)}</p>
            )}
            {articulo.modelo_inventario === 'lote_fijo' && (
              <p><strong>Lote Óptimo:</strong> {formatNumber(articulo.lote_optimo)}</p>
            )}
          </Col>
          <Col md={6}>
            <h6>Información del Modelo</h6>
            <p>
              <strong>Modelo:</strong> <Badge bg="secondary">{modeloLabel}</Badge>
            </p>
            <p><strong>Demanda Anual:</strong> {formatNumber(articulo.demanda)}</p>
            <p><strong>Nivel de Servicio:</strong> {formatPercentage(articulo.nivel_servicio)}</p>
            {articulo.modelo_inventario === 'lote_fijo' && (
              <p><strong>Tiempo de Reposición:</strong> {formatDays(articulo.tiempo_reposicion)}</p>
            )}
          </Col>
        </Row>
        <hr />
        <h6>Costos</h6>
        <Row className="text-center">
          <Col>
            <p className="mb-0 text-muted">Costo de Compra</p>
            <p className="lead">{formatCurrency(articulo.costo_compra)}</p>
          </Col>
          <Col>
            <p className="mb-0 text-muted">Costo de Pedido</p>
            <p className="lead">{formatCurrency(articulo.costo_pedido)}</p>
          </Col>
          <Col>
            <p className="mb-0 text-muted">Costo de Almacenamiento</p>
            <p className="lead">{formatCurrency(articulo.costo_almacenamiento)}</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default InventoryCalculations
