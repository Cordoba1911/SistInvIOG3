import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="bg-dark text-white p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        
        <button
          className="btn btn-outline-light"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰ 
        </button>
      </div>

      {/* Menú desplegable */}
      <div className={`d-flex flex-column ${isOpen ? 'd-block' : 'd-none'}`}>
        <a href="#" className="nav-link text-white bg-secondary p-2 rounded mb-1">🏠 Inicio</a>
        <a href="#" className="nav-link text-white hover:bg-secondary p-2 rounded mb-1">🛒 Compras</a>
        <NavLink
          to="/productos"
          className={({ isActive }) =>
            "nav-link text-white p-2 rounded mb-1 " + (isActive ? "bg-secondary" : "hover:bg-secondary")
          }
        >
          📦 Productos
        </NavLink>
        <a href="#" className="nav-link text-white hover:bg-secondary p-2 rounded mb-1">🏭 Fabricantes</a>
        <a href="#" className="nav-link text-white hover:bg-secondary p-2 rounded mb-1">👥 Contactos</a>
        <a href="#" className="nav-link text-white hover:bg-secondary p-2 rounded mb-1">📄 Facturación</a>
        <a href="#" className="nav-link text-white hover:bg-secondary p-2 rounded mb-1">📊 Reportes</a>
        <a href="#" className="nav-link text-white hover:bg-secondary p-2 rounded mb-1">⚙️ Configuración</a>
      </div>
    </aside>
  );
}
