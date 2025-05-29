import Form from '../components/Form';

const ProveedoresForm = () =>{
    // Estado inicial del Formulario
    const campos = [ 
    { nombre: 'nombre', etiqueta: 'Nombre' },
    { nombre: 'email', etiqueta: 'Email' },
    { nombre: 'telefono', etiqueta: 'Teléfono' },
    ];

  const valoresIniciales = {
    nombre: '',
    direccion: '',
    telefono: '',
  };

  //Enviar el formulario (Por ahora solo muestra los datos en consola)
  const manejarEnvio = (datos: Record<string, string>) => {
    console.log('Datos del proveedor:', datos);
  };

  return (
    <Form
      campos={campos}
      valoresIniciales={valoresIniciales}
      onSubmit={manejarEnvio}
      titulo="Alta de Proveedor"
      textoBoton="Guardar Proveedor"
    />
  );
}

export default ProveedoresForm;
