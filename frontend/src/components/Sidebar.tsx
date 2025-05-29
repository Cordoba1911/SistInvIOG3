import { Link, NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="navbar navbar-dark bg-dark text-white p-3">
      <nav
        className="d-flex justify-content-evenly align-items-center w-100"
        style={{ overflowX: 'auto' }}
      >
        <a href="#" className="nav-link text-white bg-secondary p-2 rounded">🏠 Inicio</a>
        <a href="#" className="nav-link text-white hover:bg-secondary p-2 rounded">🛒 Compras</a>
        <NavLink to="/productos" className={({ isActive }) => "nav-link text-white p-2 rounded " + (isActive ? "bg-secondary" : "hover:bg-secondary")}>📦 Productos </NavLink>
        <a href="#" className="nav-link text-white hover:bg-secondary p-2 rounded">🏭 Fabricantes</a>
        <a href="#" className="nav-link text-white hover:bg-secondary p-2 rounded">👥 Contactos</a>
        <a href="#" className="nav-link text-white hover:bg-secondary p-2 rounded">📄 Facturación</a>
        <a href="#" className="nav-link text-white hover:bg-secondary p-2 rounded">📊 Reportes</a>
        <a href="#" className="nav-link text-white hover:bg-secondary p-2 rounded">⚙️ Configuración</a>
        <Link to="/login" className="btn btn-outline-light">Iniciar sesión</Link>
        <button className="btn btn-outline-light">Registrarse</button>
      </nav>
    </aside>
  );
}
