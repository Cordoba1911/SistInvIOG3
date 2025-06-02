import { useState } from 'react';
import Form from '../../components/Form';
import EntidadList from '../../components/EntityList';
import type { Articulo } from '../../routes/ArticulosRoutes';

interface PropsArticulosList {
  articulo: Articulo[];
  onModificar: (id: string, nuevosDatos: Partial<Articulo>) => void;
  onBaja: (id: string) => void;
  modelosInventario: string[];
}

const ArticulosList = ({
  articulo,
  onModificar,
  onBaja,
  modelosInventario,
}: PropsArticulosList) => {
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null);

  const campos = [
    { nombre: 'nombre', etiqueta: 'Nombre' },
    { nombre: 'precio', etiqueta: 'Precio', tipo: 'number' },
    { nombre: 'cantidad', etiqueta: 'Cantidad', tipo: 'number' },
    { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
    { nombre: 'categoria', etiqueta: 'Categoría' },
    { nombre: 'proveedor', etiqueta: 'Proveedor' },
    { nombre: 'imagen', etiqueta: 'Imagen', tipo: 'file' },
    {
      nombre: 'modeloInventario',
      etiqueta: 'Modelo de Inventario',
      tipo: 'select',
      opciones: modelosInventario,
      requerido: true,
    },
  ];

  const valoresIniciales = articuloSeleccionado
    ? {
        nombre: articuloSeleccionado.nombre,
        precio: articuloSeleccionado.precio.toString(),
        cantidad: articuloSeleccionado.cantidad.toString(),
        descripcion: articuloSeleccionado.descripcion,
        categoria: articuloSeleccionado.categoria,
        proveedor: articuloSeleccionado.proveedor,
        imagen: articuloSeleccionado.imagen || '',
        modeloInventario: articuloSeleccionado.modeloInventario,
      }
    : {
        nombre: '',
        precio: '',
        cantidad: '',
        descripcion: '',
        categoria: '',
        proveedor: '',
        imagen: '',
        modeloInventario: modelosInventario[0] || '',
      };

  const manejarEnvio = (datos: Record<string, string>) => {
    if (articuloSeleccionado) {
      onModificar(articuloSeleccionado.id, {
        nombre: datos.nombre,
        precio: parseFloat(datos.precio),
        cantidad: parseInt(datos.cantidad, 10) || 0,
        descripcion: datos.descripcion,
        categoria: datos.categoria,
        proveedor: datos.proveedor,
        imagen: datos.imagen,
        modeloInventario: datos.modeloInventario,
      });
      setArticuloSeleccionado(null);
    }
  };

  const manejarEditar = (id: string) => {
    const encontrado = articulo.find((a) => a.id === id);
    if (encontrado) setArticuloSeleccionado(encontrado);
  };

  const columnas = [
    { campo: 'nombre', etiqueta: 'Nombre' },
    { campo: 'precio', etiqueta: 'Precio' },
    { campo: 'cantidad', etiqueta: 'Cantidad' },
    { campo: 'descripcion', etiqueta: 'Descripción' },
    { campo: 'categoria', etiqueta: 'Categoría' },
    { campo: 'proveedor', etiqueta: 'Proveedor' },
    { campo: 'imagen', etiqueta: 'Imagen' },
    { campo: 'modeloInventario', etiqueta: 'Modelo de Inventario' },
  ];

  return (
    <div className="container mt-4">
      {articuloSeleccionado && (
        <Form
          campos={campos}
          valoresIniciales={valoresIniciales}
          onSubmit={manejarEnvio}
          titulo="Editar Artículo"
          textoBoton="Guardar"
        />
      )}

      <EntidadList
        titulo="Artículos"
        datos={articulo}
        columnas={columnas}
        onEditar={manejarEditar}
        onEliminar={onBaja}
        campoId="id"
      />
    </div>
  );
};

export default ArticulosList;
