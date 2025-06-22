import Form from '../../components/Form';

const VentasForm = () =>{
    // Estado inicial del Formulario
    const campos = [ 
    { nombre: 'articulo', etiqueta: 'Articulo', requerido: true },
    { nombre: 'cantidad', etiqueta: 'Cantidad', tipo: 'number', requerido: true },
    { nombre: 'fecha_venta' , etiqueta: 'Fecha de Venta', tipo: 'date' },
    ];

    // 📆 Función para obtener fecha actual en formato YYYY-MM-DD
  const obtenerFechaActual = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  const valoresIniciales = {
    nombre: '',
    cantidad: '',
    fecha_venta: obtenerFechaActual(),
  };

  //Enviar el formulario (Por ahora solo muestra los datos en consola)
  const manejarEnvio = (datos: Record<string, string>) => {
    console.log('Datos de Venta:', datos);
  };

  return (
    <Form
      campos={campos}
      valoresIniciales={valoresIniciales}
      onSubmit={manejarEnvio}
      titulo="Agregar Venta"
      textoBoton="Enviar"
    />
  );
}

export default VentasForm;