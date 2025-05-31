import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="custom-sidebar text-white p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        
        <button className="bg-transparent text-white border-0" onClick={() => setIsOpen(!isOpen)}>☰</button>
      </div>

      {/* Menú desplegable */}
      <div className={`d-flex flex-column ${isOpen ? 'd-block' : 'd-none'}`}>
        <NavLink to="/" className={({ isActive }) => `nav-link p-2 rounded mb-1 custom-navlink ${isActive ? "bg-secondary" : ""}`}>Inicio</NavLink>

<Dropdown className="mb-1">
  <Dropdown.Toggle variant="link" className="nav-link p-2 rounded custom-navlink">
    Compras
  </Dropdown.Toggle>

  <Dropdown.Menu>
    <Dropdown.Item as={Link} to="/ordenes/nueva">
      Nueva compra
    </Dropdown.Item>
    <Dropdown.Item as={Link} to="/ordenes">
      Historial de compras
    </Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>

<NavLink to="/productos" className={({ isActive }) => `nav-link p-2 rounded mb-1 custom-navlink ${isActive ? "bg-secondary" : ""}`}>Artículos</NavLink>
<NavLink to="/proveedores" className={({ isActive }) => `nav-link p-2 rounded mb-1 custom-navlink ${isActive ? "bg-secondary" : ""}`}>Proveedores</NavLink>

<a href="#" className="nav-link p-2 rounded mb-1 custom-navlink">Contactos</a>
<a href="#" className="nav-link p-2 rounded mb-1 custom-navlink">Facturación</a>
<a href="#" className="nav-link p-2 rounded mb-1 custom-navlink">Reportes</a>
<a href="#" className="nav-link p-2 rounded mb-1 custom-navlink">Configuración</a>

      </div>
    </aside>
  );
}
