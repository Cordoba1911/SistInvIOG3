import Form from '../../components/Form';

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

const OrdenForm = () =>{
  //Enviar el formulario (Por ahora solo muestra los datos en consola)
  const manejarEnvio = (datos: Record<string, string>) => {
    console.log('Datos de la Orden:', datos);
  };

  return (
    <Form
      campos={campos}
      valoresIniciales={valoresIniciales}
      onSubmit={manejarEnvio}
      titulo="Orden Articulo"
      textoBoton="Enviar"
    />
  );
}

export default OrdenForm;