import { useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import {
  Row,
  Col,
  InputGroup,
  Form as BsForm,
  Button,
  Card,
} from "react-bootstrap";
import { useEffect } from "react";

export interface CampoFormulario {
  nombre: string;
  etiqueta: string;
  tipo?: string; // 'text', 'number', 'email', 'select', 'textarea', 'date', 'array'
  opciones?: Array<{ value: string | number; label: string }>; // Para select
  requerido?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  arrayConfig?: {
    campos: CampoFormulario[];
    titulo: string;
    botonAgregar: string;
    botonEliminar: string;
  };
}

interface PropsForm {
  campos: CampoFormulario[];
  valoresIniciales: Record<string, any>;
  onSubmit: (datos: Record<string, any>) => void;
  titulo?: string;
  textoBoton?: string;
  datosExternos?: Record<string, any[]>; // Para selects que necesitan datos externos
  children?: React.ReactNode;
}

const Form = ({
  campos,
  valoresIniciales,
  onSubmit,
  titulo = "Formulario",
  textoBoton = "Guardar",
  datosExternos = {},
  children,
}: PropsForm): JSX.Element => {
  const [formulario, setFormulario] = useState(valoresIniciales);
  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormulario(valoresIniciales);
  }, [valoresIniciales]);

  const manejarCambio = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let valorFinal: any = value;

    // Convertir tipos según el campo
    if (type === "number") {
      valorFinal = value === "" ? undefined : parseFloat(value);
    } else if (type === "checkbox") {
      valorFinal = (e.target as HTMLInputElement).checked;
    }

    setFormulario({ ...formulario, [name]: valorFinal });
    setErrores({ ...errores, [name]: "" });
  };

  const manejarCambioArray = (
    nombreArray: string,
    index: number,
    campo: string,
    valor: any
  ) => {
    const arrayActual = formulario[nombreArray] || [];
    const nuevoArray = [...arrayActual];
    nuevoArray[index] = { ...nuevoArray[index], [campo]: valor };
    setFormulario({ ...formulario, [nombreArray]: nuevoArray });
  };

  const agregarElementoArray = (
    nombreArray: string,
    camposArray: CampoFormulario[]
  ) => {
    const arrayActual = formulario[nombreArray] || [];
    const nuevoElemento: Record<string, any> = {};
    camposArray.forEach((campo) => {
      nuevoElemento[campo.nombre] = "";
    });
    setFormulario({
      ...formulario,
      [nombreArray]: [...arrayActual, nuevoElemento],
    });
  };

  const eliminarElementoArray = (nombreArray: string, index: number) => {
    const arrayActual = formulario[nombreArray] || [];
    const nuevoArray = arrayActual.filter((_: any, i: number) => i !== index);
    setFormulario({ ...formulario, [nombreArray]: nuevoArray });
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    campos.forEach((campo) => {
      if (campo.requerido) {
        if (campo.tipo === "array") {
          const array = formulario[campo.nombre] || [];
          if (array.length === 0) {
            nuevosErrores[
              campo.nombre
            ] = `Debe agregar al menos un ${campo.etiqueta.toLowerCase()}`;
          }
        } else {
          const valor = formulario[campo.nombre];
          if (!valor || (typeof valor === "string" && valor.trim() === "")) {
            nuevosErrores[campo.nombre] = `${campo.etiqueta} es obligatorio`;
          }
        }
      }
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validarFormulario()) {
      onSubmit(formulario);
    } else {
      console.error("Errores de validación:", errores);
    }
  };

  const renderizarCampo = (campo: CampoFormulario) => {
    if (campo.tipo === "array" && campo.arrayConfig) {
      return (
        <Col key={campo.nombre} md={12} className="mb-3">
          <label className="form-label">{campo.etiqueta}</label>
          <Card className="p-3">
            {(formulario[campo.nombre] || []).map(
              (elemento: any, index: number) => (
                <Card key={index} className="mb-2 p-2">
                  <Row>
                    {campo.arrayConfig!.campos.map((campoArray) => (
                      <Col key={campoArray.nombre} md={6} className="mb-2">
                        <label className="form-label small">
                          {campoArray.etiqueta}
                        </label>
                        {campoArray.tipo === "select" && campoArray.opciones ? (
                          <BsForm.Select
                            size="sm"
                            value={elemento[campoArray.nombre] || ""}
                            onChange={(e) =>
                              manejarCambioArray(
                                campo.nombre,
                                index,
                                campoArray.nombre,
                                e.target.value
                              )
                            }
                          >
                            <option value="">Seleccionar...</option>
                            {campoArray.opciones.map((opcion) => (
                              <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                              </option>
                            ))}
                          </BsForm.Select>
                        ) : (
                          <BsForm.Control
                            size="sm"
                            type={campoArray.tipo || "text"}
                            value={elemento[campoArray.nombre] || ""}
                            onChange={(e) =>
                              manejarCambioArray(
                                campo.nombre,
                                index,
                                campoArray.nombre,
                                e.target.value
                              )
                            }
                            placeholder={campoArray.placeholder}
                            min={campoArray.min}
                            max={campoArray.max}
                            step={campoArray.step}
                          />
                        )}
                      </Col>
                    ))}
                    <Col md={12} className="text-end">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          eliminarElementoArray(campo.nombre, index)
                        }
                      >
                        {campo.arrayConfig!.botonEliminar}
                      </Button>
                    </Col>
                  </Row>
                </Card>
              )
            )}
            <div className="d-flex">
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  agregarElementoArray(campo.nombre, campo.arrayConfig!.campos)
                }
              >
                {campo.arrayConfig!.botonAgregar}
              </Button>
            </div>
          </Card>
          {errores[campo.nombre] && (
            <div className="form-text text-danger">{errores[campo.nombre]}</div>
          )}
        </Col>
      );
    }

    return (
      <Col key={campo.nombre} md={6} className="mb-3">
        <label className="form-label">{campo.etiqueta}</label>

        {campo.tipo === "select" && campo.opciones ? (
          <InputGroup size="sm">
            <BsForm.Select
              name={campo.nombre}
              value={formulario[campo.nombre] || ""}
              onChange={manejarCambio}
              aria-label={campo.etiqueta}
            >
              <option value="">
                {campo.etiqueta === "Artículo"
                  ? "Seleccione un artículo"
                  : campo.etiqueta === "Proveedor"
                  ? "Seleccione un proveedor"
                  : `Seleccione ${campo.etiqueta.toLowerCase()}`}
              </option>
              {campo.opciones.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </BsForm.Select>
          </InputGroup>
        ) : campo.tipo === "textarea" ? (
          <BsForm.Control
            as="textarea"
            rows={3}
            name={campo.nombre}
            value={formulario[campo.nombre] || ""}
            onChange={manejarCambio}
            placeholder={campo.placeholder}
          />
        ) : (
          <InputGroup size="sm">
            <BsForm.Control
              type={campo.tipo || "text"}
              name={campo.nombre}
              value={formulario[campo.nombre] || ""}
              onChange={manejarCambio}
              aria-label={campo.etiqueta}
              placeholder={campo.placeholder}
              min={campo.min}
              max={campo.max}
              step={campo.step}
            />
          </InputGroup>
        )}

        {errores[campo.nombre] && (
          <div className="form-text text-danger">{errores[campo.nombre]}</div>
        )}
      </Col>
    );
  };

  return (
    <form onSubmit={manejarSubmit}>
      {titulo && <h3 className="mb-4">{titulo}</h3>}

      <Row>{campos.map(renderizarCampo)}</Row>

      <div className="d-flex mt-3">
        <Button type="submit" variant="primary">
          {textoBoton}
        </Button>
        {children}
      </div>
    </form>
  );
};

export default Form; 