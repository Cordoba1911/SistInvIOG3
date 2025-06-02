import Form from '../../components/Form';
import type { Articulo } from '../../routes/ArticulosRoutes';
import { useNavigate } from 'react-router-dom';

interface PropsArticulosForm {
  onAlta: (datos: Omit<Articulo, 'id' | 'activo'>) => void;
  modelosInventario: string[];
}

const ArticulosForm = ({ onAlta, modelosInventario }: PropsArticulosForm) => {
  const navigate = useNavigate();

  const campos = [
    { nombre: 'nombre', etiqueta: 'Nombre', requerido: true },
    { nombre: 'precio', etiqueta: 'Precio', requerido: true, tipo: 'number' },
    { nombre: 'cantidad', etiqueta: 'Cantidad' },
    { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
    { nombre: 'categoria', etiqueta: 'Categoría' },
    { nombre: 'proveedor', etiqueta: 'Proveedor', requerido: true },
    { nombre: 'imagen', etiqueta: 'Imagen', tipo: 'file' },
    {
      nombre: 'modeloInventario',
      etiqueta: 'Modelo de Inventario',
      tipo: 'select',
      opciones: modelosInventario,
      requerido: true,
    },
  ];

  const valoresIniciales = {
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
    onAlta({
      nombre: datos.nombre,
      precio: parseFloat(datos.precio),
      cantidad: parseInt(datos.cantidad, 10) || 0,
      descripcion: datos.descripcion,
      categoria: datos.categoria,
      proveedor: datos.proveedor,
      imagen: datos.imagen,
      modeloInventario: datos.modeloInventario,
    });
    navigate('/articulos/admin-articulos');
  };

  return (
    <Form
      campos={campos}
      valoresIniciales={valoresIniciales}
      onSubmit={manejarEnvio}
      titulo="Agregar Artículo"
      textoBoton="Guardar Artículo"
    />
  );
};

export default ArticulosForm;
