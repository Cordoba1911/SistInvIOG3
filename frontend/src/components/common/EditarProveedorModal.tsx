import { Modal } from "react-bootstrap";
import type { Proveedor, CreateProveedorDto } from "../../types/proveedor";
import ProveedoresForm from "../../pages/Proveedores/ProveedoresForm";

interface EditarProveedorModalProps {
  proveedor: Proveedor;
  show: boolean;
  onHide: () => void;
  onSave: (datos: CreateProveedorDto) => void;
}

const EditarProveedorModal: React.FC<EditarProveedorModalProps> = ({
  proveedor,
  show,
  onHide,
  onSave,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProveedoresForm
          proveedorExistente={proveedor}
          onSubmit={onSave}
          onCancel={onHide}
        />
      </Modal.Body>
    </Modal>
  );
};

export default EditarProveedorModal; 