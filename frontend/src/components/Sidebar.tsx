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

        <Dropdown className="mb-1">
      <Dropdown.Toggle
        variant="link"
        className="nav-link p-2 rounded custom-navlink"
      >
        Artículos
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
          as={Link}
          to="/articulos/articulos"
          className={isActive("/articulos/nuevo") ? "bg-secondary" : ""}
        >
          Agregar artículos
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          to="/articulos/admin-articulos"
          className={isActive("/articulos/admin-articulos") ? "bg-secondary" : ""}
        >
          Lista de artículos
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          to="/articulos/productos-a-reponer"
          className={isActive("/articulos/productos-a-reponer") ? "bg-secondary" : ""}
        >
          <i className="fas fa-exclamation-triangle text-warning me-2"></i>
          Productos a reponer
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          to="/articulos/productos-faltantes"
          className={isActive("/articulos/productos-faltantes") ? "bg-secondary" : ""}
        >
          <i className="fas fa-exclamation-circle text-danger me-2"></i>
          Productos faltantes
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          to="/articulos/proveedores-por-articulo"
          className={isActive("/articulos/proveedores-por-articulo") ? "bg-secondary" : ""}
        >
          <i className="fas fa-search text-info me-2"></i>
          Proveedores por artículo
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          to="/articulos/ajuste-inventario"
          className={isActive("/articulos/ajuste-inventario") ? "bg-secondary" : ""}
        >
          <i className="fas fa-edit text-primary me-2"></i>
          Ajuste de inventario
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown className="mb-1">
      <Dropdown.Toggle
        variant="link"
        className="nav-link p-2 rounded custom-navlink"
      >
        Proveedores
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
          as={Link}
          to="/proveedores/proveedores"
          className={isActive("/proveedores/proveedores") ? "bg-secondary" : ""}
        >
          Agregar proveedor
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          to="/proveedores/admin-proveedores"
          className={isActive("/proveedores/admin-proveedoress") ? "bg-secondary" : ""}
        >
          Lista de proveedores
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
        
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
        <NavLink
          to="/modelos"
          className={({ isActive }) =>
            `nav-link p-2 rounded mb-1 custom-navlink ${
              isActive ? "bg-secondary" : ""
            }`
          }
        >
          Modelos
        </NavLink>
      </div>
    </aside>
  );
}
