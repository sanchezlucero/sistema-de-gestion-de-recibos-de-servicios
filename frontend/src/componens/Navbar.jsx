import { Menu } from "lucide-react";

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="h-14 flex items-center px-4  bg-white">
      {/* BOTÓN HAMBURGUESA */}
      <button
        onClick={onToggleSidebar}
        className="mr-4 p-2 rounded hover:bg-slate-100"
      >
        <Menu size={20} />
      </button>

      <h1 className="font-semibold text-purple-600">Dashboard</h1>
    </header>
  );
}
