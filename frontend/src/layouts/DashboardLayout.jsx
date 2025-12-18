import { Outlet } from "react-router-dom";
import Sidebar from "../componens/Sidebar";
import Navbar from "../componens/Navbar";
import { useState } from "react";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <Sidebar open={open} />
      <div className="flex flex-col flex-1">
        <Navbar onToggleSidebar={() => setOpen(!open)} />
        <main className="flex-1  overflow-auto bg-purple-50/80">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
