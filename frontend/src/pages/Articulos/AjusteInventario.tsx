import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Badge, Modal, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { FaEdit, FaSearch, FaCheck, FaTimes, FaHistory, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { articulosService } from '../../services/articulosService';
import type { Articulo, AjusteInventarioDto, ResultadoAjusteDto } from '../../types/articulo';

const AjusteInventario: React.FC = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articulosFiltrados, setArticulosFiltrados] = useState<Articulo[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados del modal de ajuste
  const [showModal, setShowModal] = useState(false);
  const [nuevaCantidad, setNuevaCantidad] = useState<number>(0);
  const [motivo, setMotivo] = useState('');
  
  // Estados del modal de resultado
  const [showResultado, setShowResultado] = useState(false);
  const [resultado, setResultado] = useState<ResultadoAjusteDto | null>(null);

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

  const abrirModalAjuste = (articulo: Articulo) => {
    setArticuloSeleccionado(articulo);
    setNuevaCantidad(articulo.stock_actual || 0);
    setMotivo('');
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setArticuloSeleccionado(null);
    setNuevaCantidad(0);
    setMotivo('');
  };

  const cerrarModalResultado = () => {
    setShowResultado(false);
    setResultado(null);
  };

  const realizarAjuste = async () => {
    if (!articuloSeleccionado) return;

    try {
      setProcesando(true);
      const resultado = await articulosService.ajustarInventario(articuloSeleccionado.id, nuevaCantidad, motivo);
      setResultado(resultado);
      setShowModal(false);
      setShowResultado(true);
      
      // Recargar artículos para reflejar los cambios
      await cargarArticulos();
    } catch (err: any) {
      setError(err.message || 'Error al realizar el ajuste de inventario');
      console.error('Error al ajustar inventario:', err);
    } finally {
      setProcesando(false);
    }
  };

  const getDiferencia = () => {
    if (!articuloSeleccionado) return 0;
    return nuevaCantidad - (articuloSeleccionado.stock_actual || 0);
  };

  const getColorBadgeStock = (stock: number, punto_pedido?: number, stock_seguridad?: number) => {
    if (stock === 0) return 'danger';
    if (stock_seguridad && stock < stock_seguridad) return 'warning';
    if (punto_pedido && stock <= punto_pedido) return 'info';
    return 'success';
  };

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <FaEdit className="me-2" />
              Ajuste de Inventario
            </h4>
            <Badge bg="info">{articulosFiltrados.length} artículos</Badge>
          </div>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              <FaExclamationTriangle className="me-2" />
              {error}
            </Alert>
          )}

          <Alert variant="info" className="mb-4">
            <FaInfoCircle className="me-2" />
            <strong>Información:</strong> Esta función permite ajustar las cantidades de stock de los artículos 
            sin generar órdenes de compra u otras acciones automáticas. Use esta función para corregir 
            discrepancias de inventario, registrar mermas, o actualizar stock después de conteos físicos.
          </Alert>

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
                  <th>Stock Seguridad</th>
                  <th>Punto Pedido</th>
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
                          bg={getColorBadgeStock(
                            articulo.stock_actual || 0, 
                            articulo.punto_pedido, 
                            articulo.stock_seguridad
                          )}
                        >
                          {articulo.stock_actual || 0}
                        </Badge>
                      </td>
                      <td>
                        {articulo.stock_seguridad ? (
                          <Badge bg="secondary">{articulo.stock_seguridad}</Badge>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        {articulo.punto_pedido ? (
                          <Badge bg="secondary">{articulo.punto_pedido}</Badge>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => abrirModalAjuste(articulo)}
                        >
                          <FaEdit className="me-1" />
                          Ajustar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      {busqueda ? 'No se encontraron artículos que coincidan con la búsqueda' : 'No hay artículos disponibles'}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de ajuste */}
      <Modal show={showModal} onHide={cerrarModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2" />
            Ajustar Inventario: {articuloSeleccionado?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {articuloSeleccionado && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Código:</strong> {articuloSeleccionado.codigo}
                </Col>
                <Col md={6}>
                  <strong>Stock Actual:</strong> 
                  <Badge bg="info" className="ms-2">
                    {articuloSeleccionado.stock_actual || 0}
                  </Badge>
                </Col>
              </Row>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nueva Cantidad *</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="1"
                    value={nuevaCantidad}
                    onChange={(e) => setNuevaCantidad(parseInt(e.target.value) || 0)}
                    placeholder="Ingrese la nueva cantidad"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Motivo del Ajuste</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ej: Conteo físico, Merma, Corrección de inventario, etc."
                  />
                  <Form.Text className="text-muted">
                    Opcional: Describa el motivo del ajuste para mantener un registro
                  </Form.Text>
                </Form.Group>

                {/* Resumen del ajuste */}
                <Alert variant={getDiferencia() === 0 ? 'info' : getDiferencia() > 0 ? 'success' : 'warning'}>
                  <strong>Resumen del Ajuste:</strong>
                  <br />
                  Stock Actual: {articuloSeleccionado.stock_actual || 0}
                  <br />
                  Nueva Cantidad: {nuevaCantidad}
                  <br />
                  Diferencia: {getDiferencia() > 0 ? '+' : ''}{getDiferencia()}
                  {getDiferencia() !== 0 && (
                    <span className="ms-2">
                      ({getDiferencia() > 0 ? 'Incremento' : 'Reducción'})
                    </span>
                  )}
                </Alert>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal} disabled={procesando}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={realizarAjuste}
            disabled={procesando || nuevaCantidad < 0}
          >
            {procesando ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Procesando...
              </>
            ) : (
              <>
                <FaCheck className="me-1" />
                Confirmar Ajuste
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de resultado */}
      <Modal show={showResultado} onHide={cerrarModalResultado} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCheck className="me-2 text-success" />
            Ajuste Realizado Exitosamente
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resultado && (
            <div>
              <Alert variant="success">
                <FaCheck className="me-2" />
                El ajuste de inventario se ha realizado correctamente.
              </Alert>

              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>
                      <h6 className="mb-0">Información del Artículo</h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>ID:</strong> {resultado.articulo_id}</p>
                      <p><strong>Código:</strong> {resultado.codigo}</p>
                      <p><strong>Nombre:</strong> {resultado.nombre}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>
                      <h6 className="mb-0">Detalles del Ajuste</h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Stock Anterior:</strong> 
                        <Badge bg="secondary" className="ms-2">{resultado.stock_anterior}</Badge>
                      </p>
                      <p><strong>Stock Nuevo:</strong> 
                        <Badge bg="success" className="ms-2">{resultado.stock_nuevo}</Badge>
                      </p>
                      <p><strong>Diferencia:</strong> 
                        <Badge 
                          bg={resultado.diferencia > 0 ? 'success' : resultado.diferencia < 0 ? 'warning' : 'info'} 
                          className="ms-2"
                        >
                          {resultado.diferencia > 0 ? '+' : ''}{resultado.diferencia}
                        </Badge>
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {resultado.motivo && (
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Motivo del Ajuste</h6>
                  </Card.Header>
                  <Card.Body>
                    <p className="mb-0">{resultado.motivo}</p>
                  </Card.Body>
                </Card>
              )}

              <Card>
                <Card.Header>
                  <h6 className="mb-0">
                    <FaHistory className="me-2" />
                    Información del Registro
                  </h6>
                </Card.Header>
                <Card.Body>
                  <p className="mb-0">
                    <strong>Fecha y Hora:</strong> {formatearFecha(resultado.fecha_ajuste)}
                  </p>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={cerrarModalResultado}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AjusteInventario; 