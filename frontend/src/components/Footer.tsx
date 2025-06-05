import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#1D3557'}} className="text-light py-4 w-100">
      <Container>
        <Row>
          <Col className="text-center">
            <small>&copy; {new Date().getFullYear()} Inventario. Todos los derechos reservados.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
