import { useState } from 'react';
import Form from '../../components/Form';
import type { Articulo } from '../../routes/ArticulosRoutes';

interface PropsArticulosList {
  articulo: Articulo[];
  onModificar: (id: string, nuevosDatos: Partial<Articulo>) => void;
  onBaja: (id: string) => void;
}

const ArticulosList = ({ articulo, onModificar, onBaja }: PropsArticulosList) => {
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null);

  // Aquí puedes definir los campos que quieres mostrar en la lista de artículos
  const campos = [
    { nombre: 'nombre', etiqueta: 'Nombre' },
    { nombre: 'precio', etiqueta: 'Precio' },
    { nombre: 'cantidad', etiqueta: 'Cantidad' },
    { nombre: 'descripcion', etiqueta: 'Descripción' },
    { nombre: 'categoria', etiqueta: 'Categoría' },
    { nombre: 'proveedor', etiqueta: 'Proveedor' },
    { nombre: 'imagen', etiqueta: 'Imagen', tipo: 'file' },
  ];

// Aquí puedes definir los valores iniciales o el estado de los artículos
const valoresIniciales = articuloSeleccionado
  ? { nombre: articuloSeleccionado.nombre,
    precio: articuloSeleccionado.precio.toString(),
    cantidad: articuloSeleccionado.cantidad.toString(),
    descripcion: articuloSeleccionado.descripcion,
    categoria: articuloSeleccionado.categoria,
    proveedor: articuloSeleccionado.proveedor,
    imagen: articuloSeleccionado.imagen || '' }
  : { nombre: '', precio: '', cantidad: '', descripcion: '', categoria: '', proveedor: '', imagen: '' };

// Función para manejar el envío del formulario
const manejarEnvio = (datos: Record<string, string>) => {
    // Si hay un artículo seleccionado, lo modificamos
    // Si no, podrías manejar la creación de un nuevo artículo
    if (articuloSeleccionado) {
      onModificar(articuloSeleccionado.id, {
        nombre: datos.nombre,
        precio: parseFloat(datos.precio),
        cantidad: parseInt(datos.cantidad, 10) || 0,
        descripcion: datos.descripcion,
        categoria: datos.categoria,
        proveedor: datos.proveedor,
        imagen: datos.imagen, // Aquí deberías manejar la subida de archivos
      });
    }
    // Limpia el formulario después de guardar
    setArticuloSeleccionado(null); 
};

// Función para manejar la edición de un artículo
const manejarEditar = (id: string) => {
    const articuloEncontrado = articulo.find((a) => a.id === id);
    // Si encontramos el artículo, lo establecemos como seleccionado
    // Esto permitirá que el formulario se llene con los datos del artículo seleccionado
    if (articuloEncontrado) setArticuloSeleccionado(articuloEncontrado);
};

// Renderiza el formulario y la lista de artículos
  return (
    <div className="container mt-4">
      <Form
        campos={campos}
        valoresIniciales={valoresIniciales}
        onSubmit={manejarEnvio}
        titulo={articuloSeleccionado ? "Editar Articulo" : "Editar Nombre" }
        textoBoton="Guardar"
      />

      <h3 className="mt-5">Lista de Articulos</h3>
      <ul className="list-group">
        {articulo.map((p) => (
          <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span style={{ textDecoration: p.activo ? 'none' : 'line-through' }}>
              {p.nombre}
            </span>
            <div>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => manejarEditar(p.id)}>Editar</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onBaja(p.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
 };

export default ArticulosList;