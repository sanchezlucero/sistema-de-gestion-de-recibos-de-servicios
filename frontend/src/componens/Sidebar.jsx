import { FileText, Home, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ open }) {
  const menu = [
    {
      label: "Inicio",
      icon: Home,
      path: "/",
    },
    {
      label: "Registros",
      icon: FileText,
      path: "/consumos",
    },
    {
      label: "Configuración",
      icon: Settings,
      path: "/configuracion",
    },
  ];

  return (
    <aside
      className={`
        bg-white
        transition-all duration-300
        ${open ? "w-64" : "w-16"}
        flex flex-col py-4
      `}
    >
      <nav className="flex flex-col gap-2 px-2">
        {menu.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `
              flex items-center
              ${open ? "gap-3 px-4" : "justify-center"}
              py-2 rounded-lg
              transition
              ${
                isActive
                  ? "bg-purple-100 text-purple-600"
                  : "text-purple-400 hover:bg-purple-100 hover:text-purple-700"
              }
              `
            }
          >
            {/* ICONO: siempre visible */}
            <Icon size={20} className="shrink-0" />

            {/* TEXTO: solo cuando está abierto */}
            {open && (
              <span className="whitespace-nowrap text-sm font-medium">
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
