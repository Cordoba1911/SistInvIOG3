import Form from '../components/Form';

const ArticulosForm = () =>{
    // Estado inicial del Formulario
    const campos = [ 
    { nombre: 'nombre', etiqueta: 'Nombre' },
    { nombre: 'precio', etiqueta: 'Precio' },
    { nombre: 'cantidad', etiqueta: 'Cantidad' },
    { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
    { nombre: 'categoria', etiqueta: 'Categoría' },
    { nombre: 'proveedor', etiqueta: 'Proveedor' },
    { nombre: 'codigo', etiqueta: 'Código' },
    { nombre: 'imagen', etiqueta: 'Imagen', tipo: 'file' },
    ];

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

  //Enviar el formulario (Por ahora solo muestra los datos en consola)
  const manejarEnvio = (datos: Record<string, string>) => {
    console.log('Datos del articulo:', datos);
  };

  return (
    <Form
      campos={campos}
      valoresIniciales={valoresIniciales}
      onSubmit={manejarEnvio}
      titulo="Alta de Articulo"
      textoBoton="Guardar Articulo"
    />
  );
}

export default ArticulosForm;