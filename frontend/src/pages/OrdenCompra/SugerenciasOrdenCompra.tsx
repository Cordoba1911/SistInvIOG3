import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { FaLightbulb, FaShoppingCart, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { ordenesService } from '../../services/ordenesService';
import ConfirmationModal from '../../components/common/ConfirmationModal';

interface SugerenciaOrdenCompra {
  articulo_id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  stock_actual: number;
  punto_pedido: number;
  stock_seguridad: number;
  modelo_inventario: string;
  cantidad_sugerida: number;
  razon_sugerencia: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  proveedor_predeterminado: {
    id: number;
    nombre: string;
    telefono: string;
    email: string;
    precio_unitario: number;
    demora_entrega: number;
  };
  costo_estimado: number;
  dias_sin_stock: number;
}

const SugerenciasOrdenCompra: React.FC = () => {
  const [sugerencias, setSugerencias] = useState<SugerenciaOrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [creandoOrden, setCreandoOrden] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sugerenciaSeleccionada, setSugerenciaSeleccionada] = useState<SugerenciaOrdenCompra | null>(null);

  useEffect(() => {
    cargarSugerencias();
  }, []);

  const cargarSugerencias = async () => {
    try {
      setLoading(true);
      const data = await ordenesService.getSugerencias();
      setSugerencias(data);
    } catch (error) {
      console.error('Error al cargar sugerencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getPrioridadVariant = (prioridad: string) => {
    switch (prioridad) {
      case 'ALTA': return 'danger';
      case 'MEDIA': return 'warning';
      case 'BAJA': return 'info';
      default: return 'secondary';
    }
  };

  const getPrioridadIcon = (prioridad: string) => {
    switch (prioridad) {
      case 'ALTA': return <FaExclamationTriangle />;
      case 'MEDIA': return <FaShoppingCart />;
      case 'BAJA': return <FaCheckCircle />;
      default: return <FaShoppingCart />;
    }
  };

  const handleCrearOrden = (sugerencia: SugerenciaOrdenCompra) => {
    setSugerenciaSeleccionada(sugerencia);
    setShowConfirmModal(true);
  };

  const confirmarCrearOrden = async () => {
    if (!sugerenciaSeleccionada) return;

    try {
      setCreandoOrden(true);
      await ordenesService.create({
        articulo_id: sugerenciaSeleccionada.articulo_id,
        proveedor_id: sugerenciaSeleccionada.proveedor_predeterminado.id,
        cantidad: sugerenciaSeleccionada.cantidad_sugerida,
      });
      
      // Recargar sugerencias para actualizar la lista
      await cargarSugerencias();
      setShowConfirmModal(false);
      setSugerenciaSeleccionada(null);
    } catch (error) {
      console.error('Error al crear orden:', error);
    } finally {
      setCreandoOrden(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando sugerencias...</span>
        </Spinner>
        <p className="mt-2">Cargando sugerencias inteligentes...</p>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <Card.Header className="bg-warning text-dark">
          <FaLightbulb className="me-2" />
          Sugerencias Inteligentes de Órdenes de Compra
        </Card.Header>
        <Card.Body>
          {sugerencias.length === 0 ? (
            <Alert variant="success">
              <Alert.Heading>🎉 ¡Excelente!</Alert.Heading>
              <p>
                No hay productos que requieran reposición en este momento. 
                Todos los artículos tienen stock suficiente o ya tienen órdenes de compra activas.
              </p>
            </Alert>
          ) : (
            <>
              <Alert variant="info" className="mb-4">
                <strong>💡 Sugerencias Basadas en Modelos de Inventario</strong>
                <br />
                Estas sugerencias se calculan automáticamente según los modelos de inventario configurados 
                (Lote Fijo y Período Fijo) y el estado actual del stock.
              </Alert>

              <Row className="mb-3">
                <Col>
                  <h6>Resumen: {sugerencias.length} productos necesitan reposición</h6>
                  <div>
                    <Badge bg="danger" className="me-2">
                      Alta: {sugerencias.filter(s => s.prioridad === 'ALTA').length}
                    </Badge>
                    <Badge bg="warning" className="me-2">
                      Media: {sugerencias.filter(s => s.prioridad === 'MEDIA').length}
                    </Badge>
                    <Badge bg="info">
                      Baja: {sugerencias.filter(s => s.prioridad === 'BAJA').length}
                    </Badge>
                  </div>
                </Col>
              </Row>

              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Prioridad</th>
                    <th>Artículo</th>
                    <th>Stock Actual</th>
                    <th>Cantidad Sugerida</th>
                    <th>Proveedor</th>
                    <th>Costo Estimado</th>
                    <th>Razón</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sugerencias.map((sugerencia) => (
                    <tr key={sugerencia.articulo_id}>
                      <td>
                        <Badge bg={getPrioridadVariant(sugerencia.prioridad)} className="p-2">
                          {getPrioridadIcon(sugerencia.prioridad)} {sugerencia.prioridad}
                        </Badge>
                        {sugerencia.dias_sin_stock > 0 && (
                          <div className="small text-danger mt-1">
                            Sin stock hace {sugerencia.dias_sin_stock} días
                          </div>
                        )}
                      </td>
                      <td>
                        <div>
                          <strong>{sugerencia.codigo}</strong>
                          <br />
                          <small className="text-muted">{sugerencia.nombre}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{sugerencia.stock_actual}</strong>
                          <br />
                          <small className="text-muted">
                            Punto pedido: {sugerencia.punto_pedido}
                          </small>
                        </div>
                      </td>
                      <td>
                        <strong>{sugerencia.cantidad_sugerida} unidades</strong>
                        <br />
                        <Badge bg="secondary" className="small">
                          {sugerencia.modelo_inventario === 'lote_fijo' ? 'Lote Fijo' : 'Período Fijo'}
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <strong>{sugerencia.proveedor_predeterminado.nombre}</strong>
                          <br />
                          <small className="text-muted">
                            {formatCurrency(sugerencia.proveedor_predeterminado.precio_unitario)}/unidad
                          </small>
                          <br />
                          <small className="text-muted">
                            Entrega: {sugerencia.proveedor_predeterminado.demora_entrega} días
                          </small>
                        </div>
                      </td>
                      <td>
                        <strong className="text-primary">
                          {formatCurrency(sugerencia.costo_estimado)}
                        </strong>
                      </td>
                      <td>
                        <small>{sugerencia.razon_sugerencia}</small>
                      </td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleCrearOrden(sugerencia)}
                          disabled={creandoOrden}
                        >
                          <FaShoppingCart className="me-1" />
                          Crear Orden
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Card.Body>
      </Card>

      <ConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={confirmarCrearOrden}
        title="Crear Orden de Compra"
        message={
          sugerenciaSeleccionada ? 
            `¿Confirma la creación de la orden de compra?\n\nArtículo: ${sugerenciaSeleccionada.codigo} - ${sugerenciaSeleccionada.nombre}\nCantidad: ${sugerenciaSeleccionada.cantidad_sugerida} unidades\nProveedor: ${sugerenciaSeleccionada.proveedor_predeterminado.nombre}\nCosto Estimado: ${formatCurrency(sugerenciaSeleccionada.costo_estimado)}\nRazón: ${sugerenciaSeleccionada.razon_sugerencia}`
            : ''
        }
        confirmText="Crear Orden"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default SugerenciasOrdenCompra;
