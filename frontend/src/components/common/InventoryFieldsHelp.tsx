import { Alert, Card, Row, Col, Badge } from "react-bootstrap";

const InventoryFieldsHelp = () => {
  return (
    <Card className="mt-3">
      <Card.Header>
        <h6 className="mb-0">
          <i className="fas fa-info-circle me-2"></i>
          Guía de Campos de Inventario
        </h6>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Alert variant="info" className="py-2">
              <strong>📦 Punto de Pedido:</strong>
              <br />
              <small>Nivel de stock donde se debe realizar un nuevo pedido. Usado en "Productos a Reponer".</small>
            </Alert>
            
            <Alert variant="warning" className="py-2">
              <strong>🛡️ Stock de Seguridad:</strong>
              <br />
              <small>Stock mínimo para evitar desabastecimiento. Usado en "Productos Faltantes".</small>
            </Alert>
          </Col>
          
          <Col md={6}>
            <Alert variant="success" className="py-2">
              <strong>📊 Lote Óptimo:</strong>
              <br />
              <small>Cantidad económica de pedido (EOQ). Se puede calcular automáticamente.</small>
            </Alert>
            
            <Alert variant="secondary" className="py-2">
              <strong>📈 Inventario Máximo:</strong>
              <br />
              <small>Nivel máximo de inventario (usado en modelo período fijo).</small>
            </Alert>
          </Col>
        </Row>
        
        <div className="text-center mt-2">
          <Badge bg="primary" className="me-2">
            <i className="fas fa-exclamation-triangle me-1"></i>
            Productos a Reponer
          </Badge>
          <small className="text-muted">= Stock Actual ≤ Punto de Pedido + Sin órdenes activas</small>
        </div>
        
        <div className="text-center mt-1">
          <Badge bg="danger" className="me-2">
            <i className="fas fa-exclamation-circle me-1"></i>
            Productos Faltantes
          </Badge>
          <small className="text-muted">= Stock Actual &lt; Stock de Seguridad</small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default InventoryFieldsHelp; 