import { useState } from "react";
import { Table, Button, Badge, Image } from "react-bootstrap";
import ConfirmationModal from "./common/ConfirmationModal";

interface Columna {
  campo: string;
  etiqueta: string;
  render?: (valor: any) => React.ReactNode;
}

interface PropsEntidadList<T> {
  titulo: string;
  datos: T[];
  columnas: Columna[];
  onEditar: (id: string) => void;
  onEliminar: (id: string) => void;
  campoId: string;
  campoActivo?: string;
  esActivo?: (entidad: T) => boolean;
  renderAcciones?: (item: T) => React.ReactNode;

  // NUEVO: acciones personalizadas por fila
  accionesPersonalizadas?: (item: T) => React.ReactNode;
}

const EntidadList = <T extends Record<string, any>>({
  titulo,
  datos,
  columnas,
  onEditar,
  onEliminar,
  campoId,
  campoActivo,
  esActivo,
  renderAcciones,
  accionesPersonalizadas,
}: PropsEntidadList<T>) => {
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  const handleShowModal = (item: any) => {
    setItemToDelete(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setItemToDelete(null);
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onEliminar(itemToDelete[campoId]);
    }
    handleCloseModal();
  };

  return (
    <div className="mt-5">
      <h3 className="mb-3">Lista de {titulo}</h3>
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={col.campo}>{col.etiqueta}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item) => {
            const estaActivo = esActivo
              ? esActivo(item)
              : campoActivo
              ? !!item[campoActivo]
              : true;

            return (
              <tr key={item[campoId]}>
                {columnas.map((col) => {
                  const valor = item[col.campo];
                  const renderizado = col.render ? col.render(valor) : null;

                  return (
                    <td
                      key={col.campo}
                      style={{
                        wordBreak: "break-word",
                        maxWidth: "200px",
                        whiteSpace: "pre-wrap",
                        textAlign: "center",
                      }}
                    >
                      {renderizado ?? valor ?? "-"}
                    </td>
                  );
                })}
                <td className="text-center">
                  {renderAcciones ? (
                    renderAcciones(item)
                  ) : (
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onEditar(item[campoId])}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleShowModal(item)}
                      >
                        Eliminar
                      </Button>
                      {accionesPersonalizadas && accionesPersonalizadas(item)}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {itemToDelete && (
        <ConfirmationModal
          show={showModal}
          onHide={handleCloseModal}
          onConfirm={handleConfirmDelete}
          title="Confirmar Baja"
          message={`¿Estás seguro de que deseas dar de baja a "${itemToDelete.nombre}"? Esta acción no se puede deshacer.`}
          confirmText="Dar de Baja"
        />
      )}
    </div>
  );
};

export default EntidadList;
