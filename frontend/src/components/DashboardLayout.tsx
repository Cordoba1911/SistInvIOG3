// src/components/DashboardLayout.tsx
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <>
      <Sidebar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}
