import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SalesChart from '../components/SalesChart';
import SummaryCards from '../components/SummaryCards';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-[#f5fafd]">
        <Header />
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Reporte de ventas 2025</h2>
          <SalesChart />
        </section>
        <SummaryCards />
      </main>
    </div>
  );
}

