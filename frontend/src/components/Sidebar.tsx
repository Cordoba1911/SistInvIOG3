import { Link, NavLink, useLocation } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Función para saber si la ruta actual es la que corresponde
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="custom-sidebar text-white p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="bg-transparent text-white border-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Menú desplegable */}
      <div className={`d-flex flex-column ${isOpen ? "d-block" : "d-none"}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link p-2 rounded mb-1 custom-navlink ${
              isActive ? "bg-secondary" : ""
            }`
          }
        >
          Inicio
        </NavLink>

        <Dropdown className="mb-1">
          <Dropdown.Toggle
            variant="link"
            className="nav-link p-2 rounded custom-navlink"
          >
            Compras
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              as={Link}
              to="/ordenes/orden-compra"
              className={isActive("/ordenes/orden-compra") ? "bg-secondary" : ""}
            >
              Nueva compra
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              to="/ordenes/admin-orden-compra"
              className={isActive("/ordenes/admin-orden-compra") ? "bg-secondary" : ""}
            >
              Administrar compras
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <NavLink
  to="articulos"
  className={({ isActive }) =>
    `nav-link p-2 rounded mb-1 custom-navlink ${
      isActive ? "bg-secondary" : ""
    }`
  }
>
  Artículos
</NavLink>

        <NavLink
          to="proveedores"
          className={({ isActive }) =>
            `nav-link p-2 rounded mb-1 custom-navlink ${
              isActive ? "bg-secondary" : ""
            }`
          }
        >
          Proveedores
        </NavLink>
        <NavLink
          to="ventas"
          className={({ isActive }) =>
            `nav-link p-2 rounded mb-1 custom-navlink ${
              isActive ? "bg-secondary" : ""
            }`
          }
        >
          Ventas
        </NavLink>
        <a href="#" className="nav-link p-2 rounded mb-1 custom-navlink">
          Configuración
        </a>
      </div>
    </aside>
  );
}
