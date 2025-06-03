import Form from '../../components/Form';
import type { Articulo } from '../../routes/ArticulosRoutes';
import { useNavigate } from 'react-router-dom';

interface PropsArticulosForm {
  // Definición de las propiedades del componente ArticulosForm
  onAlta: (datos: Articulo) => void;
}

const ArticulosForm = ({onAlta}: PropsArticulosForm) =>{
    // Estado inicial del Formulario
    const campos = [ 
    { nombre: 'nombre', etiqueta: 'Nombre', requerido: true },
    { nombre: 'precio', etiqueta: 'Precio', requerido: true, tipo: 'number' },
    { nombre: 'cantidad', etiqueta: 'Cantidad' },
    { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
    { nombre: 'categoria', etiqueta: 'Categoría' },
    { nombre: 'proveedor', etiqueta: 'Proveedor', requerido: true },
    { nombre: 'codigo', etiqueta: 'Código', requerido: true },
    { nombre: 'imagen', etiqueta: 'Imagen', tipo: 'file' },
    ];

  // Valores iniciales del formulario
  const valoresIniciales = {
    nombre: '',
    direccion: '',
    telefono: '',
    precio: '',
    cantidad: '',
    descripcion: '',
    categoria: '',
    proveedor: '',
  };

  // Hook para redirigir después de guardar
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const manejarEnvio = (datos: Record<string, string>) => {
    // Llama a la función onAlta con los datos del formulario
    // Asegúrate de que los datos coincidan con ArticuloSinID
    onAlta({
      id: '', // Valor temporal, el backend debería asignar el id real
      nombre: datos.nombre,
      precio: parseFloat(datos.precio),
      cantidad: parseInt(datos.cantidad, 10) || 0, // Asegura que sea un número
      descripcion: datos.descripcion,
      categoria: datos.categoria,
      proveedor: datos.proveedor,
      imagen: datos.imagen, // Aquí deberías manejar la subida de archivos
      activo: true // O el valor por defecto que corresponda
    });

    // Redirige al usuario a la lista de artículos después de guardar
    navigate('/articulos/admin-articulos'); // Redirige a la lista de artículos
  };

  return (
    <Form
      campos={campos}
      valoresIniciales={valoresIniciales}
      onSubmit={manejarEnvio}
      titulo="Agregar Articulo"
      textoBoton="Guardar Articulo"
    />
  );
}

export default ArticulosForm;