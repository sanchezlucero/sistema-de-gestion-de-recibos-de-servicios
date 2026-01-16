import { Outlet } from "react-router-dom";
import Sidebar from "../componens/Sidebar";
import Navbar from "../componens/Navbar";
import { useState } from "react";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      {" "}
      {/* h-screen y sin scroll global */}
      <Sidebar open={open} />
      <div className="flex flex-col flex-1 min-w-0">
        {" "}
        {/* min-w-0 evita que tablas rompan el layout */}
        <Navbar onToggleSidebar={() => setOpen(!open)} />
        {/* Este es el único lugar donde debe haber scroll */}
        <main className="flex-1 overflow-y-auto bg-purple-50/30 p-4 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
