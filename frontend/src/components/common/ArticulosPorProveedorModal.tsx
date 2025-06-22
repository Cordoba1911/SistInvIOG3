import React from 'react';
import { Modal, Button, Card, Spinner, Badge } from 'react-bootstrap';
import { FaBoxOpen, FaInfoCircle, FaDollarSign, FaClock, FaShoppingCart, FaStar } from 'react-icons/fa';
import type { Proveedor, ArticuloProveedorDetalle } from '../../types/proveedor';

interface ArticulosPorProveedorModalProps {
  show: boolean;
  onHide: () => void;
  proveedor: Proveedor | null;
  articulos: ArticuloProveedorDetalle[];
  loading: boolean;
}

const ArticulosPorProveedorModal: React.FC<ArticulosPorProveedorModalProps> = ({
  show,
  onHide,
  proveedor,
  articulos,
  loading,
}) => {
  const formatearPrecio = (precio?: number) => {
    if (precio === undefined || precio === null) return 'N/A';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(precio);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaBoxOpen className="me-2" />
          Artículos de: {proveedor?.nombre}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
            <p className="mt-2">Cargando artículos...</p>
          </div>
        ) : (
          <>
            {articulos.length > 0 ? (
              <div className="row">
                {articulos.map((item) => (
                  <div key={item.articulo.id} className="col-md-6 mb-3">
                    <Card className={`h-100 ${item.proveedor_predeterminado ? 'border-warning' : ''}`}>
                      <Card.Header className={`d-flex justify-content-between align-items-center ${item.proveedor_predeterminado ? 'bg-warning bg-opacity-25' : ''}`}>
                        <h6 className="mb-0 fw-bold">{item.articulo.nombre}</h6>
                        {item.proveedor_predeterminado && (
                          <Badge bg="warning" text="dark">
                            <FaStar className="me-1" />
                            Predeterminado
                          </Badge>
                        )}
                      </Card.Header>
                      <Card.Body>
                        <div className="mb-2">
                          <FaInfoCircle className="text-secondary me-2" />
                          <strong>Código:</strong> {item.articulo.codigo}
                        </div>
                        <div className="mb-2">
                          <FaDollarSign className="text-success me-2" />
                          <strong>Precio:</strong> {formatearPrecio(item.precio_unitario)}
                        </div>
                        {item.demora_entrega !== undefined && (
                          <div className="mb-2">
                            <FaClock className="text-info me-2" />
                            <strong>Demora:</strong> {item.demora_entrega} días
                          </div>
                        )}
                        {item.cargos_pedido !== undefined && item.cargos_pedido > 0 && (
                          <div className="mb-2">
                            <FaShoppingCart className="text-danger me-2" />
                            <strong>Cargos:</strong> {formatearPrecio(item.cargos_pedido)}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">Este proveedor no tiene artículos asociados.</p>
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ArticulosPorProveedorModal; 