import { useState } from "react";
import Sidebar from "../componens/Sidebar";
import Navbar from "../componens/Navbar";
import { Outlet } from "react-router-dom";


export default function DashboardLayout() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Overlay: Solo si es móvil y está abierto */}
      {open && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar onToggleSidebar={() => setOpen(!open)} />
        <main className="flex-1 overflow-y-auto bg-purple-50/30 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}