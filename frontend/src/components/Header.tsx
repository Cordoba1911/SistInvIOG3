import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-success text-white d-flex justify-content-between align-items-center px-4 py-2">
      <h5 className="m-0">Control de Inventario</h5>
      <div>
        <NavLink to="/login" className="btn btn-outline-light">
          Iniciar sesión
        </NavLink>
      </div>
    </header>
  );
}
