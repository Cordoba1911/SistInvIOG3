import React from "react";
import { Modal, Button } from "react-bootstrap";

interface WarningModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  message: string | null;
  onConfirm?: () => void;
  confirmText?: string;
}

const WarningModal: React.FC<WarningModalProps> = ({
  show,
  onHide,
  title,
  message,
  onConfirm,
  confirmText = "Continuar",
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        {onConfirm && (
          <Button variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default WarningModal; 