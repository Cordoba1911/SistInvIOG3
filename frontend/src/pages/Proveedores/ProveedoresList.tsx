// src/pages/Proveedores/ProveedoresList.tsx
import { useState } from 'react';
import Form from '../../components/Form';
import EntidadList from '../../components/EntityList';
import type { Proveedor } from '../../routes/ProveedoresRouter'; // Asegurate de exportar Proveedor correctamente


// Definición de las propiedades del componente ProveedoresList
interface PropsProveedoresList {
  proveedores: Proveedor[];
  onModificar: (id: string, nuevosDatos: Partial<Proveedor>) => void;
  onBaja: (id: string) => void;
}

// Componente para listar y editar proveedores
const ProveedoresList = ({ proveedores, onModificar, onBaja }: PropsProveedoresList) => {
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);

  // Definición de los campos del formulario
  const campos = [
    { nombre: 'nombre', etiqueta: 'Nombre', requerido: true },
    { nombre: 'email', etiqueta: 'Email', tipo: 'email' },
    { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'tel' },
  ];

  // Si hay un proveedor seleccionado, se carga su información en el formulario
  // Las columnas para la lista de proveedores
    const columnas = [
    { campo: 'nombre', etiqueta: 'Nombre' },
    { campo: 'email', etiqueta: 'Email' },
    { campo: 'telefono', etiqueta: 'Teléfono' },
    { campo: 'estado', etiqueta: 'Estado' }, // Esta es "falsa", la generaremos
  ];

  // Valores iniciales del formulario, si hay un proveedor seleccionado, se carga su nombre
  const valoresIniciales = proveedorSeleccionado
    ? { nombre: proveedorSeleccionado.nombre, email: proveedorSeleccionado.email, telefono: proveedorSeleccionado.telefono }
    : { nombre: '' , email: '', telefono: '' };

  // Función para manejar el envío del formulario
  const manejarEnvio = (datos: Record<string, string>) => {
    if (proveedorSeleccionado) {
      onModificar(proveedorSeleccionado.id, { nombre: datos.nombre,  });
    }
    setProveedorSeleccionado(null); // Limpia el formulario
  };

  // Función para manejar la edición de un proveedor
  const manejarEditar = (id: string) => {
    const proveedor = proveedores.find((p) => p.id === id);
    if (proveedor) setProveedorSeleccionado(proveedor);
  };

  const proveedoresAdaptados = proveedores.map((p) => ({
    ...p,
    estado: p.activo ? 'Activo' : 'Inactivo',
  }));

  // Renderiza el formulario y la lista de proveedores
return (
  <div className="container mt-4">
    <Form
      campos={campos}
      valoresIniciales={valoresIniciales}
      onSubmit={manejarEnvio}
      titulo={proveedorSeleccionado ? "Editar Proveedor" : "Nuevo Proveedor"}
      textoBoton="Guardar"
    />

    <EntidadList
      titulo="Proveedores"
      datos={proveedoresAdaptados}
      columnas={columnas}
      onEditar={manejarEditar}
      onEliminar={onBaja}
      campoId="id"
      campoActivo="activo"
    />
  </div>
);
};

export default ProveedoresList;
