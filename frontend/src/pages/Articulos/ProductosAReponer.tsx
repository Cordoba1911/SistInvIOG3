import { useState, useEffect } from "react";
import { Card, Table, Badge, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { articulosService } from "../../services/articulosService";
import type { ProductoAReponer } from "../../types/articulo";
import AlertModal from "../../components/common/AlertModal";

const ProductosAReponer = () => {
  const [productos, setProductos] = useState<ProductoAReponer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductoAReponer | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(0);
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    message: '',
    variant: 'danger' as 'danger' | 'warning' | 'success' | 'info'
  });

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articulosService.getProductosAReponer();
      setProductos(data);
    } catch (error: any) {
      console.error("Error al cargar productos a reponer:", error);
      setError(error.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (title: string, message: string, variant: 'danger' | 'warning' | 'success' | 'info' = 'info') => {
    setAlertModal({ show: true, title, message, variant });
  };

  const hideAlert = () => {
    setAlertModal(prev => ({ ...prev, show: false }));
  };

  const handleCreateOrder = (producto: ProductoAReponer) => {
    setSelectedProduct(producto);
    setOrderQuantity(producto.cantidad_sugerida || producto.lote_optimo || 1);
    setShowCreateOrderModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateOrderModal(false);
    setSelectedProduct(null);
    setOrderQuantity(0);
  };

  const handleConfirmOrder = async () => {
    if (!selectedProduct) return;

    try {
      // Aquí podrías integrar con el servicio de órdenes de compra
      // Por ahora solo mostramos una alerta de éxito
      showAlert(
        'Funcionalidad en desarrollo', 
        'La creación automática de órdenes de compra estará disponible próximamente. Por favor, cree la orden manualmente desde el módulo de compras.',
        'info'
      );
      handleCloseModal();
    } catch (error: any) {
      console.error('Error al crear orden:', error);
      showAlert('Error', 'Error al crear la orden de compra', 'danger');
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const getBadgeVariant = (diferencia: number) => {
    if (diferencia <= 0) return 'danger';
    if (diferencia <= 5) return 'warning';
    return 'info';
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando productos a reponer...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="danger">
            <Alert.Heading>Error al cargar datos</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={cargarProductos}>
              Reintentar
            </Button>
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="fas fa-exclamation-triangle text-warning me-2"></i>
            Productos a Reponer
          </h5>
          <div className="d-flex align-items-center">
            <Badge bg="danger" className="me-2">
              {productos.length} productos requieren reposición
            </Badge>
            <Button variant="outline-primary" size="sm" onClick={cargarProductos}>
              <i className="fas fa-sync-alt"></i> Actualizar
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {productos.length === 0 ? (
            <Alert variant="success">
              <i className="fas fa-check-circle me-2"></i>
              ¡Excelente! No hay productos que requieran reposición en este momento.
            </Alert>
          ) : (
            <>
              <div className="mb-3">
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Productos que han alcanzado el punto de pedido y no tienen órdenes de compra activas
                </small>
              </div>
              
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead className="table-dark">
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Stock Actual</th>
                      <th>Punto Pedido</th>
                      <th>Diferencia</th>
                      <th>Cant. Sugerida</th>
                      <th>Modelo</th>
                      <th>Proveedor</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => (
                      <tr key={producto.id}>
                        <td>
                          <code>{producto.codigo}</code>
                        </td>
                        <td>
                          <strong>{producto.nombre}</strong>
                          <br />
                          <small className="text-muted">{producto.descripcion}</small>
                        </td>
                        <td>
                          <Badge bg={producto.stock_actual <= 0 ? 'danger' : 'secondary'}>
                            {producto.stock_actual}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="warning" text="dark">
                            {producto.punto_pedido}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getBadgeVariant(producto.diferencia)}>
                            {producto.diferencia > 0 ? '+' : ''}{producto.diferencia}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="success">
                            {producto.cantidad_sugerida || 'N/A'}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="info">
                            {producto.modelo_inventario === 'lote_fijo' ? 'Lote Fijo' : 'Período Fijo'}
                          </Badge>
                        </td>
                        <td>
                          {producto.proveedor_predeterminado ? (
                            <div>
                              <strong>{producto.proveedor_predeterminado.nombre}</strong>
                              <br />
                              <small className="text-muted">
                                {producto.proveedor_predeterminado.telefono}
                              </small>
                            </div>
                          ) : (
                            <Badge bg="warning">Sin proveedor</Badge>
                          )}
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleCreateOrder(producto)}
                            disabled={!producto.proveedor_predeterminado}
                            title={!producto.proveedor_predeterminado ? 'Producto sin proveedor predeterminado' : 'Crear orden de compra'}
                          >
                            <i className="fas fa-shopping-cart me-1"></i>
                            Ordenar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Modal para crear orden de compra */}
      <Modal show={showCreateOrderModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Orden de Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <div className="mb-3">
                <strong>Producto:</strong> {selectedProduct.nombre} ({selectedProduct.codigo})
              </div>
              <div className="mb-3">
                <strong>Stock actual:</strong> {selectedProduct.stock_actual}
              </div>
              <div className="mb-3">
                <strong>Punto de pedido:</strong> {selectedProduct.punto_pedido}
              </div>
              {selectedProduct.proveedor_predeterminado && (
                <div className="mb-3">
                  <strong>Proveedor:</strong> {selectedProduct.proveedor_predeterminado.nombre}
                </div>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Cantidad a ordenar</Form.Label>
                <Form.Control
                  type="number"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 0)}
                  min="1"
                />
                <Form.Text className="text-muted">
                  Cantidad sugerida: {selectedProduct.cantidad_sugerida || 'N/A'}
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmOrder}>
            Crear Orden
          </Button>
        </Modal.Footer>
      </Modal>

      <AlertModal
        show={alertModal.show}
        onHide={hideAlert}
        title={alertModal.title}
        message={alertModal.message}
        variant={alertModal.variant}
      />
    </>
  );
};

export default ProductosAReponer; 