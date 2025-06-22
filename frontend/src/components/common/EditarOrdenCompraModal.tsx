import { Modal } from "react-bootstrap";
import { OrdenForm } from "../../pages/OrdenCompra/OrdenForm";
import type { OrdenCompra, UpdateOrdenCompraDto } from "../../types/ordenCompra";

interface PropsEditarOrdenCompraModal {
  show: boolean;
  onHide: () => void;
  orden: OrdenCompra | null;
  onUpdate: (id: number, datos: UpdateOrdenCompraDto) => void;
}

const EditarOrdenCompraModal = ({
  show,
  onHide,
  orden,
  onUpdate,
}: PropsEditarOrdenCompraModal) => {
  if (!orden) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Orden de Compra #{orden.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <OrdenForm ordenAEditar={orden} onUpdate={onUpdate} />
      </Modal.Body>
    </Modal>
  );
};

export default EditarOrdenCompraModal; 