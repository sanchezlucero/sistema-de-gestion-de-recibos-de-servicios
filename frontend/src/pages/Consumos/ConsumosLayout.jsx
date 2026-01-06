import { NavLink, Outlet } from "react-router-dom";

export default function ConsumosLayout() {
  return (
    <div className="space-y-2">
      {/* Tabs */}
      <div className="flex gap-2 ">
        <Tab to="luz" label="Luz" />
        <Tab to="agua" label="Agua" />
        <Tab to="reparto" label="Reparto" />
      </div>
      <Outlet />
    </div>
  );
}

function Tab({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors
        ${
          isActive
            ? "border-purple-500 text-purple-600"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
