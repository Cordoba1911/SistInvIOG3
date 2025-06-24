import React from "react";
import { Table, Button } from "react-bootstrap";

interface Columna {
  nombre: string;
  key: string;
  render?: (entidad: any) => React.ReactNode;
}

interface Props {
  entidades: any[];
  columnas: Columna[];
  onEditar?: (entidad: any) => void;
  onEliminar?: (entidad: any) => void;
  accionesPersonalizadas?: (entidad: any) => React.ReactNode;
  campoId: string;
}

const EntidadList: React.FC<Props> = ({
  entidades,
  columnas,
  onEditar,
  onEliminar,
  accionesPersonalizadas,
  campoId,
}) => {
  const renderCelda = (entidad: any, columna: Columna) => {
    if (columna.render) {
      return columna.render(entidad);
    }
    return entidad[columna.key] ?? "N/A";
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {columnas.map((columna) => (
            <th key={columna.key}>{columna.nombre}</th>
          ))}
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {entidades.map((entidad) => (
          <tr key={entidad[campoId]}>
            {columnas.map((columna) => (
              <td key={`${entidad[campoId]}-${columna.key}`}>
                {renderCelda(entidad, columna)}
              </td>
            ))}
            <td>
              {onEditar && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onEditar(entidad)}
                  className="me-2"
                >
                  Editar
                </Button>
              )}
              {onEliminar && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onEliminar(entidad)}
                  className="me-2"
                >
                  Eliminar
                </Button>
              )}
              {accionesPersonalizadas && accionesPersonalizadas(entidad)}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default EntidadList; 