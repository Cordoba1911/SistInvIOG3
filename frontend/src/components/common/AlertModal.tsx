import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

interface AlertModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  message: string;
  variant?: 'danger' | 'warning' | 'success' | 'info';
  icon?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  show,
  onHide,
  title,
  message,
  variant = 'danger',
  icon = '⚠️'
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return icon;
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="me-2">{getIcon()}</span>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant={variant} className="mb-0">
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', lineHeight: '1.5' }}>
            {message}
          </div>
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Entendido
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertModal; 