import Sidebar from './Sidebar';
import Header from './Header'; 
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4 bg-light">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

