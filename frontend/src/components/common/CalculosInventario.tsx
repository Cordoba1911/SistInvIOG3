import React from 'react';
import { Card, Row, Col, Badge, Alert } from 'react-bootstrap';
import { FaCalculator, FaChartLine, FaBoxes, FaExclamationTriangle } from 'react-icons/fa';
import type { Articulo } from '../../types/articulo';

interface CalculosInventarioProps {
  articulo: Articulo;
}

const CalculosInventario: React.FC<CalculosInventarioProps> = ({ articulo }) => {
  // Función para formatear números
  const formatNumber = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return value.toLocaleString('es-ES', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    });
  };

  // Función para formatear moneda
  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Determinar el estado del stock
  const getStockStatus = () => {
    if (!articulo.stock_actual || !articulo.punto_pedido) return null;
    
    if (articulo.stock_actual <= 0) {
      return { variant: 'danger', text: 'SIN STOCK', icon: <FaExclamationTriangle /> };
    } else if (articulo.stock_actual <= (articulo.stock_seguridad || 0)) {
      return { variant: 'warning', text: 'STOCK BAJO', icon: <FaExclamationTriangle /> };
    } else if (articulo.stock_actual <= articulo.punto_pedido) {
      return { variant: 'info', text: 'REPONER', icon: <FaBoxes /> };
    } else {
      return { variant: 'success', text: 'STOCK OK', icon: <FaBoxes /> };
    }
  };

  const stockStatus = getStockStatus();

  // Verificar si tiene datos suficientes para mostrar cálculos
  const tieneCalculos = articulo.modelo_inventario && (
    (articulo.modelo_inventario === 'lote_fijo' && articulo.lote_optimo) ||
    (articulo.modelo_inventario === 'periodo_fijo' && articulo.inventario_maximo)
  );

  return (
    <Card className="mt-3">
      <Card.Header className="bg-primary text-white">
        <FaCalculator className="me-2" />
        Cálculos de Inventario
      </Card.Header>
      <Card.Body>
        {!tieneCalculos ? (
          <Alert variant="info">
            <Alert.Heading>📊 Cálculos Automáticos</Alert.Heading>
            <p>
              Los cálculos se realizan automáticamente cuando se configura el modelo de inventario 
              y se proporcionan los datos necesarios (demanda, costos, etc.).
            </p>
          </Alert>
        ) : (
          <>
            {/* Estado del Stock */}
            {stockStatus && (
              <Row className="mb-3">
                <Col>
                  <h6>Estado del Stock</h6>
                  <Badge bg={stockStatus.variant} className="fs-6 p-2">
                    {stockStatus.icon} {stockStatus.text}
                  </Badge>
                </Col>
              </Row>
            )}

            {/* Métricas Principales */}
            <Row>
              <Col md={6}>
                <h6><FaChartLine className="me-2" />Métricas Principales</h6>
                <div className="border rounded p-3 mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Stock Actual:</span>
                    <strong>{formatNumber(articulo.stock_actual)} unidades</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Punto de Pedido:</span>
                    <strong>{formatNumber(articulo.punto_pedido)} unidades</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Stock de Seguridad:</span>
                    <strong>{formatNumber(articulo.stock_seguridad)} unidades</strong>
                  </div>
                  {articulo.modelo_inventario === 'lote_fijo' && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>Lote Óptimo (EOQ):</span>
                      <strong>{formatNumber(articulo.lote_optimo)} unidades</strong>
                    </div>
                  )}
                  {articulo.modelo_inventario === 'periodo_fijo' && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>Inventario Máximo:</span>
                      <strong>{formatNumber(articulo.inventario_maximo)} unidades</strong>
                    </div>
                  )}
                </div>
              </Col>

              <Col md={6}>
                <h6><FaBoxes className="me-2" />Información del Modelo</h6>
                <div className="border rounded p-3 mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Modelo:</span>
                    <Badge bg="secondary">
                      {articulo.modelo_inventario === 'lote_fijo' ? 'Lote Fijo' : 'Período Fijo'}
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Demanda Anual:</span>
                    <strong>{formatNumber(articulo.demanda)} unidades</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Nivel de Servicio:</span>
                    <strong>{articulo.nivel_servicio ? `${(articulo.nivel_servicio * 100).toFixed(1)}%` : 'N/A'}</strong>
                  </div>
                  {articulo.cgi && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>CGI:</span>
                      <strong>{formatNumber(articulo.cgi)}</strong>
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            {/* Costos */}
            <Row>
              <Col>
                <h6>💰 Costos</h6>
                <div className="border rounded p-3">
                  <Row>
                    <Col md={4}>
                      <div className="text-center">
                        <div className="text-muted small">Costo de Compra</div>
                        <div className="fw-bold">{formatCurrency(articulo.costo_compra)}</div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <div className="text-muted small">Costo de Pedido</div>
                        <div className="fw-bold">{formatCurrency(articulo.costo_pedido)}</div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <div className="text-muted small">Costo de Almacenamiento</div>
                        <div className="fw-bold">{formatCurrency(articulo.costo_almacenamiento)}</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            {/* Información adicional para Período Fijo */}
            {articulo.modelo_inventario === 'periodo_fijo' && articulo.intervalo_revision && (
              <Row className="mt-3">
                <Col>
                  <Alert variant="info" className="mb-0">
                    <strong>Intervalo de Revisión:</strong> {articulo.intervalo_revision} días
                    <br />
                    <small>
                      El inventario se revisa cada {articulo.intervalo_revision} días para determinar 
                      la cantidad a pedir hasta alcanzar el inventario máximo.
                    </small>
                  </Alert>
                </Col>
              </Row>
            )}

            {/* Información adicional para Lote Fijo */}
            {articulo.modelo_inventario === 'lote_fijo' && articulo.lote_optimo && (
              <Row className="mt-3">
                <Col>
                  <Alert variant="info" className="mb-0">
                    <strong>Lote Económico (EOQ):</strong> {formatNumber(articulo.lote_optimo)} unidades
                    <br />
                    <small>
                      Se ordena una cantidad fija de {formatNumber(articulo.lote_optimo)} unidades 
                      cada vez que el stock alcanza el punto de pedido.
                    </small>
                  </Alert>
                </Col>
              </Row>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default CalculosInventario;
