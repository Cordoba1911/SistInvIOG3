import Form from '../../components/Form';

const ArticulosForm = () =>{
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
      titulo="Agregar Articulo"
      textoBoton="Guardar Articulo"
    />
  );
}

export default ArticulosForm;