import Form from '../../components/Form';
import type { Proveedor } from '../../routes/ProveedoresRouter';
import { useNavigate } from 'react-router-dom';

interface PropsProveedoresForm {
  // Definición de las propiedades del componente ProveedoresForm
  onAlta: (datos: Proveedor) => void;
}

const ProveedoresForm = ({onAlta}: PropsProveedoresForm ) => {
    // Estado inicial del Formulario
    const campos = [ 
    { nombre: 'nombre', etiqueta: 'Nombre', requerido: true },
    { nombre: 'email', etiqueta: 'Email', tipo: 'email', requerido: true },
    { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'tel', requerido: true },
    ];

  // Valores iniciales del formulario
  const valoresIniciales = {
    nombre: '',
    email: '',
    telefono: '',
  };
  // Hook para redirigir después de guardar
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
   const manejarEnvio = (datos: Record<string, string>) => {
    // Llama a la función onAlta con los datos del formulario
    // Asegúrate de que los datos coincidan con ProveedorSinID
    onAlta({
      id: '', // Valor temporal, el backend debería asignar el id real
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono,
      activo: true // O el valor por defecto que corresponda
    });
    // Redirige al usuario a la lista de proveedores después de guardar
    navigate('/proveedores/admin-proveedores'); // Redirige a la lista de proveedores
  };

  // Renderiza el formulario
  return (
    <Form
      campos={campos}
      valoresIniciales={valoresIniciales}
      onSubmit={manejarEnvio}
      titulo="Agregar Proveedor"
      textoBoton="Guardar Proveedor"
    />
  ); 
}

export default ProveedoresForm;
