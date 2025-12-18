import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Luz from "../pages/Consumos/Luz";
import Agua from "../pages/Consumos/Agua";
import ConsumosLayout from "../pages/Consumos/ConsumosLayout";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="consumos" element={<ConsumosLayout />}>
          <Route index element={<Luz />} />
          <Route path="luz" element={<Luz />} />
          <Route path="agua" element={<Agua />} />
        </Route>
      </Route>
    </Routes>
  );
}
