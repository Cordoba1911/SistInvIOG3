import React from "react";
import { Modal, Button } from "react-bootstrap";

interface ErrorModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  message: string | null;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  show,
  onHide,
  title,
  message,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal; 