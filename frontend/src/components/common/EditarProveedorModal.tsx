import { Modal, Button } from "react-bootstrap";
import ProveedoresForm from "../../pages/Proveedores/ProveedoresForm";
import type { Proveedor, CreateProveedorDto } from "../../types/proveedor";

interface PropsEditarProveedorModal {
  show: boolean;
  onHide: () => void;
  proveedor: Proveedor | null;
  onSave: (proveedorDto: CreateProveedorDto, id: number) => void;
}

const EditarProveedorModal = ({
  show,
  onHide,
  proveedor,
  onSave,
}: PropsEditarProveedorModal) => {
  if (!proveedor) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Proveedor: {proveedor.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProveedoresForm
          proveedorExistente={proveedor}
          onSubmit={(datos) => onSave(datos, proveedor.id)}
          onCancel={onHide}
          mostrarTitulo={false}
        />
      </Modal.Body>
    </Modal>
  );
};

export default EditarProveedorModal; 