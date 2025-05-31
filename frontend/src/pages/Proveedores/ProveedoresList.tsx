// src/pages/Proveedores/ProveedoresList.tsx
import { useState } from 'react';
import Form from '../../components/Form';
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

  // Renderiza el formulario y la lista de proveedores
  return (
    <div className="container mt-4">
      <Form
        campos={campos}
        valoresIniciales={valoresIniciales}
        onSubmit={manejarEnvio}
        titulo={proveedorSeleccionado ? "Editar Proveedor" : "Editar Nombre" }
        textoBoton="Guardar"
      />

      <h3 className="mt-5">Lista de Proveedores</h3>
      <ul className="list-group">
        {proveedores.map((p) => (
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

export default ProveedoresList;
