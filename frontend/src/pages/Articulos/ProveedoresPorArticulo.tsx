import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Badge, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaEye, FaTimes, FaStar, FaPhone, FaEnvelope, FaDollarSign, FaClock, FaShoppingCart } from 'react-icons/fa';
import { articulosService } from '../../services/articulosService';
import type { Articulo } from '../../types/articulo';

interface ProveedorDetalle {
  proveedor_id: number;
  nombre: string;
  telefono?: string;
  email?: string;
  precio_unitario: number;
  demora_entrega?: number;
  cargos_pedido?: number;
  proveedor_predeterminado: boolean;
}

const ProveedoresPorArticulo: React.FC = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articulosFiltrados, setArticulosFiltrados] = useState<Articulo[]>([]);
  const [proveedores, setProveedores] = useState<ProveedorDetalle[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingProveedores, setLoadingProveedores] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar artículos al montar el componente
  useEffect(() => {
    cargarArticulos();
  }, []);

  // Filtrar artículos cuando cambie la búsqueda
  useEffect(() => {
    if (busqueda.trim() === '') {
      setArticulosFiltrados(articulos);
    } else {
      const filtrados = articulos.filter(articulo =>
        articulo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        articulo.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        articulo.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      );
      setArticulosFiltrados(filtrados);
    }
  }, [busqueda, articulos]);

  const cargarArticulos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articulosService.getAll();
      // Solo mostrar artículos activos
      const articulosActivos = data.filter(articulo => articulo.estado);
      setArticulos(articulosActivos);
      setArticulosFiltrados(articulosActivos);
    } catch (err) {
      setError('Error al cargar los artículos');
      console.error('Error al cargar artículos:', err);
    } finally {
      setLoading(false);
    }
  };

  const verProveedores = async (articulo: Articulo) => {
    try {
      setLoadingProveedores(true);
      setArticuloSeleccionado(articulo);
      setShowModal(true);
      const data = await articulosService.getProveedoresPorArticulo(articulo.id);
      setProveedores(data);
    } catch (err) {
      setError('Error al cargar los proveedores del artículo');
      console.error('Error al cargar proveedores:', err);
      setProveedores([]);
    } finally {
      setLoadingProveedores(false);
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    setArticuloSeleccionado(null);
    setProveedores([]);
  };

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(precio);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <FaSearch className="me-2" />
              Proveedores por Artículo
            </h4>
            <Badge bg="info">{articulosFiltrados.length} artículos</Badge>
          </div>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Barra de búsqueda */}
          <div className="mb-4">
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar por código, nombre o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Tabla de artículos */}
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Stock Actual</th>
                  <th>Modelo Inventario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {articulosFiltrados.length > 0 ? (
                  articulosFiltrados.map((articulo) => (
                    <tr key={articulo.id}>
                      <td>
                        <code>{articulo.codigo}</code>
                      </td>
                      <td className="fw-bold">{articulo.nombre}</td>
                      <td>{articulo.descripcion}</td>
                      <td>
                        <Badge 
                          bg={articulo.stock_actual && articulo.stock_actual > 0 ? 'success' : 'warning'}
                        >
                          {articulo.stock_actual || 0}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg="secondary">
                          {articulo.modelo_inventario === 'lote_fijo' ? 'Lote Fijo' : 'Período Fijo'}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => verProveedores(articulo)}
                        >
                          <FaEye className="me-1" />
                          Ver Proveedores
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted">
                      {busqueda ? 'No se encontraron artículos que coincidan con la búsqueda' : 'No hay artículos disponibles'}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de proveedores */}
      <Modal show={showModal} onHide={cerrarModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaShoppingCart className="me-2" />
            Proveedores de: {articuloSeleccionado?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingProveedores ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">Cargando proveedores...</p>
            </div>
          ) : (
            <>
              {proveedores.length > 0 ? (
                <div className="row">
                  {proveedores.map((proveedor) => (
                    <div key={proveedor.proveedor_id} className="col-md-6 mb-3">
                      <Card className={`h-100 ${proveedor.proveedor_predeterminado ? 'border-warning' : ''}`}>
                        <Card.Header className={`d-flex justify-content-between align-items-center ${proveedor.proveedor_predeterminado ? 'bg-warning bg-opacity-25' : ''}`}>
                          <h6 className="mb-0 fw-bold">{proveedor.nombre}</h6>
                          {proveedor.proveedor_predeterminado && (
                            <Badge bg="warning" text="dark">
                              <FaStar className="me-1" />
                              Predeterminado
                            </Badge>
                          )}
                        </Card.Header>
                        <Card.Body>
                          <div className="mb-2">
                            <FaDollarSign className="text-success me-2" />
                            <strong>Precio:</strong> {formatearPrecio(proveedor.precio_unitario)}
                          </div>
                          
                          {proveedor.demora_entrega !== undefined && (
                            <div className="mb-2">
                              <FaClock className="text-info me-2" />
                              <strong>Demora:</strong> {proveedor.demora_entrega} días
                            </div>
                          )}
                          
                          {proveedor.cargos_pedido !== undefined && proveedor.cargos_pedido > 0 && (
                            <div className="mb-2">
                              <FaShoppingCart className="text-warning me-2" />
                              <strong>Cargos:</strong> {formatearPrecio(proveedor.cargos_pedido)}
                            </div>
                          )}
                          
                          {proveedor.telefono && (
                            <div className="mb-2">
                              <FaPhone className="text-primary me-2" />
                              <strong>Teléfono:</strong> {proveedor.telefono}
                            </div>
                          )}
                          
                          {proveedor.email && (
                            <div className="mb-2">
                              <FaEnvelope className="text-secondary me-2" />
                              <strong>Email:</strong> {proveedor.email}
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">
                    <FaTimes className="me-2" />
                    Este artículo no tiene proveedores asociados
                  </p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProveedoresPorArticulo; 