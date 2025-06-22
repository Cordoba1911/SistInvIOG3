import { useState, useEffect } from "react";
import { Card, Table, Badge, Button, Spinner, Alert } from "react-bootstrap";
import { articulosService } from "../../services/articulosService";
import type { ProductoFaltante } from "../../types/articulo";

const ProductosFaltantes = () => {
  const [productos, setProductos] = useState<ProductoFaltante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articulosService.getProductosFaltantes();
      setProductos(data);
    } catch (error: any) {
      console.error("Error al cargar productos faltantes:", error);
      setError(error.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const getBadgeVariant = (diferencia: number) => {
    if (diferencia >= 10) return 'danger';
    if (diferencia >= 5) return 'warning';
    return 'info';
  };

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando productos faltantes...</p>
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
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="fas fa-exclamation-circle text-danger me-2"></i>
          Productos Faltantes
        </h5>
        <div className="d-flex align-items-center">
          <Badge bg="warning" className="me-2">
            {productos.length} productos con déficit
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
            ¡Excelente! No hay productos con déficit de stock de seguridad.
          </Alert>
        ) : (
          <>
            <div className="mb-3">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Productos cuyo stock actual está por debajo del stock de seguridad
              </small>
            </div>
            
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Stock Actual</th>
                    <th>Stock Seguridad</th>
                    <th>Déficit</th>
                    <th>Punto Pedido</th>
                    <th>Proveedor</th>
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
                        <Badge bg="info">
                          {producto.stock_seguridad}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={getBadgeVariant(producto.diferencia)}>
                          {producto.diferencia}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg="warning" text="dark">
                          {producto.punto_pedido || 'N/A'}
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
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductosFaltantes; 