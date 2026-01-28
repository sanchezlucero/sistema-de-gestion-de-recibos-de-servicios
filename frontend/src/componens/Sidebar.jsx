import { FileText, Home, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  const menu = [
    { label: "Inicio", icon: Home, path: "/" },
    { label: "Registros", icon: FileText, path: "/consumos" },
    { label: "Configuración", icon: Settings, path: "/configuracion" },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[60] bg-white border-r border-slate-100
          transition-all duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${open ? "w-64 translate-x-0" : "w-20 lg:translate-x-0 -translate-x-full"}
        `}
      >
        <div className="h-24 flex items-center justify-center border-b border-slate-50">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-black">
            {open ? "LSF" : "L"}
          </div>
        </div>

        <nav className="flex flex-col gap-2 px-3 py-6">
          {menu.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => {
                // En móviles, cerrar al hacer click
                if (window.innerWidth < 1024) setOpen(false);
              }}
              className={({ isActive }) => `
                flex items-center rounded-2xl transition-all duration-200
                ${open ? "px-4 gap-3" : "justify-center"}
                py-3
                ${isActive 
                  ? "bg-purple-600 text-white shadow-md shadow-purple-200" 
                  : "text-slate-400 hover:bg-purple-50 hover:text-purple-600"}
              `}
            >
              <Icon size={22} className="shrink-0" />
              
              {/* Texto animado para que no parpadee al abrir/cerrar */}
              <span className={`
                text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-300
                ${open ? "opacity-100 w-auto" : "opacity-0 w-0"}
              `}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}