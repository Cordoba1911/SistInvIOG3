import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4 position-relative" style={{ width: '100%', maxWidth: '400px' }}>
        
        {/* Link para volver al inicio */}
        <Link 
          to="/" 
          className="position-absolute text-decoration-none text-muted"
          style={{ top: '10px', right: '10px', fontSize: '0.9rem' }}
        >
          Volver al inicio
        </Link>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4 mt-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Iniciar sesión
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Registrarse
            </button>
          </li>
        </ul>

        {/* Contenido del tab */}
        {activeTab === 'login' ? (
          <form>
            <div className="mb-3">
              <label htmlFor="loginEmail" className="form-label">Correo electrónico</label>
              <input type="email" className="form-control" id="loginEmail" required />
            </div>
            <div className="mb-3">
              <label htmlFor="loginPassword" className="form-label">Contraseña</label>
              <input type="password" className="form-control" id="loginPassword" required />
            </div>
            <button type="submit" className="btn btn-primary w-100 register">Ingresar</button>
          </form>
        ) : (
          <form>
            <div className="mb-3">
              <label htmlFor="registerName" className="form-label">Nombre completo</label>
              <input type="text" className="form-control" id="registerName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="registerEmail" className="form-label">Correo electrónico</label>
              <input type="email" className="form-control" id="registerEmail" required />
            </div>
            <div className="mb-3">
              <label htmlFor="registerPassword" className="form-label">Contraseña</label>
              <input type="password" className="form-control" id="registerPassword" required />
            </div>
            <button type="submit" className="btn btn-success w-100 register">Crear cuenta</button>
          </form>
        )}
      </div>
    </div>
  );
}
