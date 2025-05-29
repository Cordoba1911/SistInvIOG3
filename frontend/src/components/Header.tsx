export default function Header() {
  return (
    <header className="bg-green-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Panel de Control <span className="text-sm font-normal">Versión 6.3</span></h1>
      <div className="text-sm flex items-center gap-2">
        <img src="https://i.imgur.com/Uz4FvyP.png" alt="Avatar" className="w-8 h-8 rounded-full" />
        Obed Alvarado
      </div>
    </header>
  );
}