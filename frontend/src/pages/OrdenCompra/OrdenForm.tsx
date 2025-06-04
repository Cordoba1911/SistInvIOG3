import Form from '../../components/Form';
import type { OrdenCompra } from '../../routes/OrdenCompraRoutes';
import { useNavigate } from 'react-router-dom';

interface PropsOrdenForm {
  // Definición de las propiedades del componente OrdenForm
  onAlta: (datos: OrdenCompra) => void;
}

const OrdenForm = ({onAlta}: PropsOrdenForm) => {

    // Estado inicial del Formulario
    const campos = [ 
    { nombre: 'nombre', etiqueta: 'Nombre', requerido: true },
    { nombre: 'proveedor', etiqueta: 'Proveedor', requerido: true},
    { nombre: 'cantidad', etiqueta: 'Cantidad', tipo: 'number', requerido: true },
    { nombre: 'estado', etiqueta: 'Estado', tipo: 'select', opciones: ['Pendiente', 'Enviada', 'Finalizada', 'Cancelada'] },
    { nombre: 'fecha_creacion', etiqueta: 'Fecha de Creación', tipo: 'date' },
    { nombre: 'fecha_envio', etiqueta: 'Fecha de Envio', tipo: 'date' },
    { nombre: 'fecha_finalizacion', etiqueta: 'Fecha de Finalizacion', tipo: 'date' },
    ];

    // 📆 Función para obtener fecha actual en formato YYYY-MM-DD
  const obtenerFechaActual = (): string => {
    return new Date().toISOString().split('T')[0];
};

  const valoresIniciales = {
    nombre: '',
    proveedor: '',
    cantidad: '',
    estado: 'Pendiente',
    fecha_creacion: obtenerFechaActual(),
    fecha_envio: '',
    fecha_finalizacion: '',
  };

const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const manejarEnvio = (datos: Record<string, string>) => {
    // Llama a la función onAlta con los datos del formulario
    // Asegúrate de que los datos coincidan con OrdenCompraSinID
    onAlta({
      id: '', // Valor temporal, el backend debería asignar el id real
      nombre: datos.nombre,
      proveedor: datos.proveedor,
      cantidad: parseInt(datos.cantidad, 10) || 0, // Asegura que sea un número
      estado: datos.estado as 'Pendiente' | 'Enviada' | 'Finalizada' | 'Cancelada',
      fecha_creacion: datos.fecha_creacion,
      fecha_envio: datos.fecha_envio || undefined,
      fecha_finalizacion: datos.fecha_finalizacion || undefined,
      activo: true // O el valor por defecto que corresponda
    });

    // Redirige al usuario a la lista de órdenes después de guardar
    navigate('/ordenes/admin-orden-compra'); // Redirige a la lista de órdenes
  };

  return (
    <Form
      campos={campos}
      valoresIniciales={valoresIniciales}
      onSubmit={manejarEnvio}
      titulo="Agregar Compra"
      textoBoton="Guardar Compra"
    />
  );
}

export default OrdenForm;