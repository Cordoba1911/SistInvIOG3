import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Alert, Spinner, Button } from 'react-bootstrap';
import { articulosService } from '../../services/articulosService';
import InventoryCalculations from '../../components/InventoryCalculations';
import type { Articulo, ProveedorArticulo } from '../../types/articulo';

const ModelosInventarioPage: React.FC = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<ProveedorArticulo | null>(null);
  const [articuloConDemora, setArticuloConDemora] = useState<Articulo | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articulosService.getAll();
      // Solo mostrar artículos activos que tengan los datos necesarios para cálculos
      const articulosConDatos = data.filter(articulo => 
        articulo.estado && 
        articulo.demanda && 
        articulo.costo_compra && 
        articulo.modelo_inventario
      );
      setArticulos(articulosConDatos);
    } catch (err) {
      setError('Error al cargar los artículos');
      console.error('Error al cargar artículos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleArticuloChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const articuloId = parseInt(e.target.value);
    if (articuloId) {
      try {
        // Cargar artículo completo con proveedores
        const articuloCompleto = await articulosService.getById(articuloId);
        setArticuloSeleccionado(articuloCompleto);
        setProveedorSeleccionado(null); // Reset proveedor seleccionado
        setArticuloConDemora(null); // Reset artículo con demora
      } catch (err) {
        console.error('Error al cargar artículo completo:', err);
        setError('Error al cargar los detalles del artículo');
      }
    } else {
      setArticuloSeleccionado(null);
      setProveedorSeleccionado(null);
      setArticuloConDemora(null);
    }
  };

  const handleProveedorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const proveedorId = parseInt(e.target.value);
    if (proveedorId && articuloSeleccionado?.proveedores) {
      const proveedor = articuloSeleccionado.proveedores.find(p => p.proveedor_id === proveedorId);
      setProveedorSeleccionado(proveedor || null);
      
      if (proveedor && articuloSeleccionado) {
        // Crear una copia del artículo con la demora específica del proveedor
        const articuloConDemoraEspecifica = {
          ...articuloSeleccionado,
          tiempo_reposicion: proveedor.demora_entrega || articuloSeleccionado.tiempo_reposicion
        };
        setArticuloConDemora(articuloConDemoraEspecifica);
      }
    } else {
      setProveedorSeleccionado(null);
      setArticuloConDemora(null);
    }
  };

  const ejecutarCalculo = async () => {
    if (!articuloSeleccionado) return;

    setCalculating(true);
    setError(null);
    setSuccess(null);

    try {
      // Aplicar el cálculo en el backend
      const resultado = await articulosService.aplicarCalculo(
        articuloSeleccionado.id,
        articuloSeleccionado.modelo_inventario || 'lote_fijo'
      );

      // Si hay un proveedor seleccionado, crear el artículo con su demora específica
      let articuloActualizado = resultado;
      if (proveedorSeleccionado) {
        articuloActualizado = {
          ...resultado,
          tiempo_reposicion: proveedorSeleccionado.demora_entrega || resultado.tiempo_reposicion
        };
        setArticuloConDemora(articuloActualizado);
      } else {
        setArticuloConDemora(null);
      }

      // Actualizar el artículo seleccionado con los nuevos valores calculados
      setArticuloSeleccionado(articuloActualizado);

      setSuccess(
        `Cálculo ejecutado exitosamente para el modelo ${
          articuloSeleccionado.modelo_inventario === 'lote_fijo' ? 'Lote Fijo' : 'Período Fijo'
        }${proveedorSeleccionado ? ` usando datos del proveedor ${proveedorSeleccionado.nombre}` : ''}.`
      );

    } catch (err: any) {
      console.error('Error al ejecutar cálculo:', err);
      setError(err.message || 'Error al ejecutar el cálculo en el backend');
    } finally {
      setCalculating(false);
    }
  };

  const ejecutarCalculoCGI = async () => {
    if (!articuloSeleccionado) return;

    setCalculating(true);
    setError(null);
    setSuccess(null);

    try {
      // Calcular y actualizar CGI en el backend
      const resultado = await articulosService.calcularCGIArticulo(articuloSeleccionado.id);

      // Si hay un proveedor seleccionado, mantener la demora específica
      let articuloActualizado = resultado;
      if (proveedorSeleccionado) {
        articuloActualizado = {
          ...resultado,
          tiempo_reposicion: proveedorSeleccionado.demora_entrega || resultado.tiempo_reposicion
        };
        setArticuloConDemora(articuloActualizado);
      } else {
        setArticuloConDemora(null);
      }

      // Actualizar el artículo seleccionado con los nuevos valores calculados
      setArticuloSeleccionado(articuloActualizado);

      setSuccess(
        `CGI calculado exitosamente: $${resultado.cgi?.toLocaleString('es-AR')} (Modelo: ${resultado.modelo_inventario === 'lote_fijo' ? 'Lote Fijo (EOQ)' : 'Período Fijo (Intervalo Revisión)'})${
          proveedorSeleccionado ? ` usando datos del proveedor ${proveedorSeleccionado.nombre}` : ''
        }.`
      );

    } catch (err: any) {
      console.error('Error al calcular CGI:', err);
      setError(err.message || 'Error al calcular el CGI en el backend');
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="px-4 py-4">
      <h2 className="mb-4">Modelos de Inventario</h2>
      
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Seleccionar Artículo para Análisis</h5>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" className="mb-3">
              {success}
            </Alert>
          )}
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Artículo:</Form.Label>
                <Form.Select 
                  value={articuloSeleccionado?.id || ''} 
                  onChange={handleArticuloChange}
                  size="lg"
                >
                  <option value="">Seleccione un artículo...</option>
                  {articulos.map(articulo => (
                    <option key={articulo.id} value={articulo.id}>
                      {articulo.codigo} - {articulo.nombre}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Solo se muestran artículos con datos completos para cálculos de inventario
                </Form.Text>
              </Form.Group>

              {articuloSeleccionado?.proveedores && articuloSeleccionado.proveedores.length > 0 && (
                <Form.Group>
                  <Form.Label>Proveedor (para cálculo de tiempo de reposición):</Form.Label>
                  <Form.Select 
                    value={proveedorSeleccionado?.proveedor_id || ''} 
                    onChange={handleProveedorChange}
                    size="lg"
                  >
                    <option value="">Usar tiempo de reposición general del artículo</option>
                    {articuloSeleccionado.proveedores.map(proveedor => (
                      <option key={proveedor.proveedor_id} value={proveedor.proveedor_id}>
                        {proveedor.nombre} {proveedor.proveedor_predeterminado ? '(Predeterminado)' : ''}
                        {proveedor.demora_entrega ? ` - ${proveedor.demora_entrega} días` : ''}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Seleccione un proveedor específico para usar su tiempo de entrega en los cálculos
                  </Form.Text>
                </Form.Group>
              )}
            </Col>
            <Col md={6}>
              {articuloSeleccionado && (
                <div className="mt-2">
                  <h6>Información del Artículo:</h6>
                  <p className="mb-1"><strong>Código:</strong> {articuloSeleccionado.codigo}</p>
                  <p className="mb-1"><strong>Descripción:</strong> {articuloSeleccionado.descripcion}</p>
                  <p className="mb-1"><strong>Modelo:</strong> {articuloSeleccionado.modelo_inventario === 'lote_fijo' ? 'Lote Fijo' : 'Período Fijo'}</p>
                  <p className="mb-1"><strong>Tiempo de Reposición Base:</strong> {articuloSeleccionado.tiempo_reposicion ? `${articuloSeleccionado.tiempo_reposicion} días` : 'No definido'}</p>
                </div>
              )}

              {proveedorSeleccionado && (
                <div className="mt-3">
                  <h6>Proveedor Seleccionado:</h6>
                  <p className="mb-1"><strong>Nombre:</strong> {proveedorSeleccionado.nombre}</p>
                  {proveedorSeleccionado.telefono && (
                    <p className="mb-1"><strong>Teléfono:</strong> {proveedorSeleccionado.telefono}</p>
                  )}
                  <p className="mb-1"><strong>Tiempo de Entrega:</strong> {proveedorSeleccionado.demora_entrega ? `${proveedorSeleccionado.demora_entrega} días` : 'No especificado'}</p>
                  <p className="mb-1"><strong>Precio Unitario:</strong> ${proveedorSeleccionado.precio_unitario?.toLocaleString('es-AR') || 'No especificado'}</p>
                  {proveedorSeleccionado.proveedor_predeterminado && (
                    <p className="mb-1 text-primary"><strong>✓ Proveedor Predeterminado</strong></p>
                  )}
                </div>
              )}
            </Col>
          </Row>
          
          {articuloSeleccionado && (
            <div className="mt-4">
              <Row>
                <Col md={6} className="text-center">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={ejecutarCalculo}
                    disabled={calculating}
                    className="px-4 w-100"
                  >
                    {calculating ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Calculando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-calculator me-2"></i>
                        Calcular {articuloSeleccionado.modelo_inventario === 'lote_fijo' ? 'Lote Fijo' : 'Período Fijo'}
                      </>
                    )}
                  </Button>
                  <div className="mt-2">
                    <small className="text-muted">
                      Ejecuta el cálculo del modelo de inventario en el backend
                      {proveedorSeleccionado && ` usando datos del proveedor ${proveedorSeleccionado.nombre}`}
                    </small>
                  </div>
                </Col>
                
                <Col md={6} className="text-center">
                  <Button 
                    variant="success" 
                    size="lg"
                    onClick={ejecutarCalculoCGI}
                    disabled={calculating}
                    className="px-4 w-100"
                  >
                    {calculating ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Calculando CGI...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-dollar-sign me-2"></i>
                        Calcular CGI
                      </>
                    )}
                  </Button>
                  <div className="mt-2">
                    <small className="text-muted">
                      Calcula el Costo de Gestión del Inventario anual
                      {proveedorSeleccionado && ` con datos del proveedor ${proveedorSeleccionado.nombre}`}
                    </small>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>

      {articuloSeleccionado && (
        <>
          <div className="mb-3">
            {proveedorSeleccionado && articuloConDemora && (
              <Alert variant="info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Cálculos actualizados:</strong> Se está utilizando el tiempo de entrega específico del proveedor <strong>{proveedorSeleccionado.nombre}</strong> 
                ({proveedorSeleccionado.demora_entrega || 'No especificado'} días) en lugar del tiempo base del artículo.
              </Alert>
            )}
          </div>
          <InventoryCalculations articulo={articuloConDemora || articuloSeleccionado} />
        </>
      )}

      {!articuloSeleccionado && !loading && (
        <Card>
          <Card.Body className="text-center py-5">
            <div className="text-muted">
              <i className="fas fa-chart-line fa-3x mb-3"></i>
              <h5>Seleccione un artículo</h5>
              <p>Elija un artículo del desplegable para ver sus cálculos de inventario y métricas.</p>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ModelosInventarioPage; 