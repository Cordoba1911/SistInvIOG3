import { useState } from 'react';
import Form from '../../components/Form';
import EntidadList from '../../components/EntityList';
import type { Venta } from '../../routes/VentasRoute';

interface PropsVentasList {
  ventas: Venta[];
  onModificar: (id: string, nuevosDatos: Partial<Venta>) => void;
  onBaja: (id: string) => void;
}

const VentasList = ({ ventas, onModificar, onBaja }: PropsVentasList) => {
  const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null);

  // Aquí puedes definir los campos que quieres mostrar en la lista de ventas
  const campos = [
    { nombre: 'articulo', etiqueta: 'Articulo' },
    { nombre: 'cantidad', etiqueta: 'Cantidad' },
    { nombre: 'fecha_venta', etiqueta: 'Fecha de Venta', tipo: 'date' },
  ];

  // Las columnas para la lista de ventas
  const columnas = [
    { campo: 'articulo', etiqueta: 'Articulo' },
    { campo: 'cantidad', etiqueta: 'Cantidad' },
    { campo: 'fecha_venta', etiqueta: 'Fecha de Venta' },
  ];

  // Aquí puedes definir los valores iniciales o el estado de las ventas
  const valoresIniciales = ventaSeleccionada
    ? { articulo: ventaSeleccionada.articulo,
      cantidad: ventaSeleccionada.cantidad.toString(),
      fecha_venta: ventaSeleccionada.fecha_venta }
    : { articulo: '', cantidad: '', fecha_venta: '' };

  // Función para manejar el envío del formulario
  const manejarEnvio = (datos: Record<string, string>) => {
    if (ventaSeleccionada) {
      onModificar(ventaSeleccionada.id, {
        articulo: datos.articulo,
        cantidad: parseInt(datos.cantidad, 10) || 0,
        fecha_venta: datos.fecha_venta,
      });
    }
  };

  const manejarEditar = (id: string) => {
    const venta = ventas.find((v) => v.id === id);
    if (venta) {
      setVentaSeleccionada(venta);
    }
  };

  return (
    <>
      <Form
        campos={campos}
        valoresIniciales={valoresIniciales}
        onSubmit={manejarEnvio}
        titulo="Modificar Venta"
        textoBoton="Actualizar"
      />
      <EntidadList
      titulo='Ventas'
      datos={ventas}
      columnas={columnas}
      onEditar={manejarEditar}
      onEliminar={onBaja}
      campoId='id'
      />
    </>
  );
}
export default VentasList;