import { useState, type ChangeEvent, type FormEvent, type JSX} from 'react';
import { Row, Col, InputGroup, Form as BsForm } from 'react-bootstrap';

export interface CampoFormulario {
  nombre: string;
  etiqueta: string;
  tipo?: string; // 'text', 'number', etc.
  opciones?: string[]; // Opcional, para select
  requerido?: boolean; // Indica si el campo es obligatorio
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
  const [errores, setErrores] = useState<Record<string, string>>({});// Para manejar errores de validación

  const manejarCambio = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
    setErrores({ ...errores, [name]: '' }); // Limpiar error al cambiar el campo
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

  campos.forEach((campo) => {
    if (campo.requerido && !formulario[campo.nombre]) {
       nuevosErrores[campo.nombre] = `${campo.etiqueta} es obligatorio`;
    }
  });

  setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0; // Retorna true si no hay errores
  }

  const manejarSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validarFormulario()) {
      onSubmit(formulario);
    } else {
      console.error('Errores de validación:', errores);
    }
  };

  return (
    <form onSubmit={manejarSubmit} className="container mt-4">
      <h2 className='mb-4'>{titulo}</h2>

<Row>
  {campos.map((campo) => (
    <Col key={campo.nombre} md={6} className="mb-3">
      <label className="form-label">{campo.etiqueta}</label>

      {campo.tipo === 'select' && campo.opciones ? (
        <InputGroup size="sm">
          <BsForm.Select
            name={campo.nombre}
            value={formulario[campo.nombre]}
            onChange={manejarCambio}
            aria-label={campo.etiqueta}
          >
            <option value="">Seleccionar...</option>
            {campo.opciones.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </BsForm.Select>
        </InputGroup>
      ) : (
        <InputGroup size="sm">
          <BsForm.Control
            type={campo.tipo || 'text'}
            name={campo.nombre}
            value={formulario[campo.nombre]}
            onChange={manejarCambio}
            aria-label={campo.etiqueta}
          />
        </InputGroup>
      )}

      {errores[campo.nombre] && (
        <div className="form-text text-danger">{errores[campo.nombre]}</div>
      )}
    </Col>
  ))}
</Row>
      <button type="submit" className='btn btn-primary'>{textoBoton}</button>
    </form>
  );
};

export default Form;
