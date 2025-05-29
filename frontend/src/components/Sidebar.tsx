import { NavLink } from "react-router-dom";
import { useState } from "react";

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

<a href="#" className="nav-link p-2 rounded mb-1 custom-navlink">Compras</a>

<NavLink to="/productos" className={({ isActive }) => `nav-link p-2 rounded mb-1 custom-navlink ${isActive ? "bg-secondary" : ""}`}>Artículos</NavLink>

<a href="#" className="nav-link p-2 rounded mb-1 custom-navlink">Fabricantes</a>
<a href="#" className="nav-link p-2 rounded mb-1 custom-navlink">Contactos</a>
<a href="#" className="nav-link p-2 rounded mb-1 custom-navlink">Facturación</a>
<a href="#" className="nav-link p-2 rounded mb-1 custom-navlink">Reportes</a>
<a href="#" className="nav-link p-2 rounded mb-1 custom-navlink">Configuración</a>

      </div>
    </aside>
  );
}
