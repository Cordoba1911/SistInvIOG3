// src/components/FormularioGenerico.tsx
import { useState, type ChangeEvent, type FormEvent, type JSX} from 'react';

export interface CampoFormulario {
  nombre: string;
  etiqueta: string;
  tipo?: string; // 'text', 'number', etc.
}

interface PropsForm {
  campos: CampoFormulario[]; // Array de campos del formulario
  // Cada campo tiene un nombre, etiqueta y tipo opcional
  valoresIniciales: Record<string, string>;
  onSubmit: (datos: Record<string, string>) => void;
  titulo?: string;
  textoBoton?: string;
}

const Form = ({
  campos,
  valoresIniciales,
  onSubmit,
  titulo = 'Formulario',
  textoBoton = 'Guardar',
}: PropsForm): JSX.Element => {
  const [formulario, setFormulario] = useState(valoresIniciales);

  const manejarCambio = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const manejarSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formulario);
  };

  return (
    <form onSubmit={manejarSubmit} className="container mt-4">
      <h2 className='mb-4'>{titulo}</h2>

      {campos.map((campo) => (
        <div key={campo.nombre} className='mb-3'>
          <label className='form-label'>{campo.etiqueta}</label>
          <input
            type={campo.tipo || 'text'}
            name={campo.nombre}
            value={formulario[campo.nombre]}
            onChange={manejarCambio}
            className='form-control'
          />
        </div>
      ))}
      <button type="submit" className='btn btn-primary'>{textoBoton}</button>
    </form>
  );
};

export default Form;
