import { useState } from "react";
import { Table, Button } from "react-bootstrap";
import ConfirmationModal from "./common/ConfirmationModal";

interface Columna {
  campo: string;
  etiqueta: string;
  render?: (valor: any, item: any) => React.ReactNode;
  cellStyle?: React.CSSProperties;
}

interface PropsEntidadList<T> {
  titulo: string;
  datos: T[];
  columnas: Columna[];
  onEditar?: (id: string) => void;
  onEliminar?: (id: string) => void;
  campoId: string;
  botonCrear?: React.ReactNode;
  searchBar?: React.ReactNode;
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
  botonCrear,
  searchBar,
  campoActivo,
  esActivo,
  renderAcciones,
  accionesPersonalizadas,
}: PropsEntidadList<T>) => {
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  const mostrarAcciones = onEditar || onEliminar || renderAcciones || accionesPersonalizadas;

  const handleShowModal = (item: any) => {
    setItemToDelete(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setItemToDelete(null);
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete && onEliminar) {
      onEliminar(itemToDelete[campoId]);
    }
    handleCloseModal();
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-5">
        {titulo && <h3 className="mb-0">{titulo}</h3>}
        {botonCrear}
      </div>
      {searchBar}
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            {columnas.map((col) => (
              <th key={col.campo} style={{ whiteSpace: "nowrap" }}>
                {col.etiqueta}
              </th>
            ))}
            {mostrarAcciones && (
              <th style={{ whiteSpace: "nowrap" }}>Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {datos.map((item) => {
            return (
              <tr key={item[campoId]} className="align-middle">
                {columnas.map((col) => {
                  const valor = item[col.campo];
                  const renderizado = col.render ? col.render(valor, item) : null;

                  return (
                    <td
                      key={col.campo}
                      style={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                        ...col.cellStyle,
                      }}
                    >
                      {renderizado ?? valor ?? "-"}
                    </td>
                  );
                })}
                {mostrarAcciones && (
                  <td className="">
                    {renderAcciones ? (
                      renderAcciones(item)
                    ) : (
                      <div className="d-flex align-items-center gap-2">
                        {onEditar && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => onEditar(item[campoId])}
                          >
                            Editar
                          </Button>
                        )}
                        {onEliminar && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleShowModal(item)}
                          >
                            Eliminar
                          </Button>
                        )}
                        {accionesPersonalizadas && accionesPersonalizadas(item)}
                      </div>
                    )}
                  </td>
                )}
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
