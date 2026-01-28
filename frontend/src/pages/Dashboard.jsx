import {
  Lightbulb,
  Droplets,
  Wallet,
  MoreVertical,
  Camera,
  FileText,
  Eye,
} from "lucide-react";
import React, { useContext, useMemo, useState } from "react";
import { ReceiptContext } from "../context/ReceiptContext";
import { DetailModal } from "../componens/DetailModal";

export default function Dashboard() {
  const { selectedPeriod, lightHistory, waterHistory, config, distributions } =
    useContext(ReceiptContext);
  const totalFloors = config?.totalFloors || 0;
  const myFloor = config?.myFloor || 2;
  const neighbors = config?.neighbors || [];
  const [selectedDetail, setSelectedDetail] = useState(null);

  const getSavedDistributions = () =>
    JSON.parse(localStorage.getItem("repartos")) || [];

  const currentLightReceipt = useMemo(() => {
    return lightHistory.find((r) => r.fecha.startsWith(selectedPeriod));
  }, [selectedPeriod, lightHistory]);

  const currentWaterReceipt = useMemo(() => {
    return waterHistory.find((r) => r.fecha.startsWith(selectedPeriod));
  }, [selectedPeriod, waterHistory]);

  const consolidatedData = useMemo(() => {
    const distributions = getSavedDistributions();
    const floorList = Array.from({ length: totalFloors }, (_, i) => i + 1);

    const lightDist = distributions.find(
      (r) => r.month === selectedPeriod && r.service === "luz",
    );
    const waterDist = distributions.find(
      (r) => r.month === selectedPeriod && r.service === "agua",
    );

    return floorList.map((floorNum) => {
      const lightEntry = lightDist?.contributions?.find(
        (a) => a.floor === floorNum,
      );
      const waterEntry = waterDist?.contributions?.find(
        (a) => a.floor === floorNum,
      );

      const lightAmount = Number(lightEntry?.amount || 0);
      const waterAmount = Number(waterEntry?.amount || 0);
      const isLightPaid = lightEntry?.is_paid || false;
      const isWaterPaid = waterEntry?.is_paid || false;

      let status = "Pendiente";
      if (isLightPaid && isWaterPaid) status = "Pagado";
      else if (isLightPaid || isWaterPaid) status = "Pago Parcial";

      const neighbor = neighbors.find((n) => n.floor === floorNum);

      return {
        floor: floorNum,
        neighborName: neighbor?.name || `Piso ${floorNum}`,
        light: lightAmount,
        water: waterAmount,
        total: lightAmount + waterAmount,
        phone: neighbor?.phone || "",
        status: status,
      };
    });
  }, [selectedPeriod, totalFloors, neighbors, distributions]);

  const myDues = useMemo(() => {
    const me = consolidatedData.find((d) => d.floor === myFloor);
    return { light: me?.light || 0, water: me?.water || 0 };
  }, [consolidatedData, myFloor]);

  const downloadPDF = (type) => {
    console.log("type: ", type);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {" "}
        <StatCard
          icon={<Lightbulb size={32} />}
          title="Luz Edificio"
          amount={currentLightReceipt?.importe_total || 0}
          date={currentLightReceipt?.fecha}
          onClick={() => downloadPDF("luz")}
        />
        <StatCard
          icon={<Wallet size={32} />}
          title="Mi Cuota Luz"
          amount={myDues.light}
          isPersonal
          onClick={() =>
            setSelectedDetail({
              type: "luz",
              mode: "personal",
              data: currentLightReceipt,
            })
          }
        />
        <StatCard
          icon={<Droplets size={32} />}
          title="Agua Edificio"
          amount={
            currentWaterReceipt?.importe_total ||
            currentWaterReceipt?.total ||
            0
          }
          date={currentWaterReceipt?.fecha}
          onClick={() => downloadPDF("agua")}
        />
        <StatCard
          icon={<Wallet size={32} />}
          title="Mi Cuota Agua"
          amount={myDues.water}
          isPersonal
          onClick={() =>
            setSelectedDetail({
              type: "agua",
              mode: "personal",
              data: currentWaterReceipt,
            })
          }
        />
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Recaudación por Piso
            </h3>
            <p className="text-sm text-slate-400 font-medium">
              Estado de pagos del periodo {selectedPeriod}
            </p>
          </div>

          <div className="flex gap-3">
            <BadgeCount
              label="Al día"
              count={
                consolidatedData.filter((p) => p.status === "Pagado").length
              }
              total={totalFloors}
              color="emerald"
            />
            <BadgeCount
              label="Pendientes"
              count={
                consolidatedData.filter((p) => p.status !== "Pagado").length
              }
              color="amber"
            />
          </div>
        </header>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase tracking-[0.15em] border-b border-slate-50">
                <th className="pb-4 font-bold">Piso</th>
                <th className="pb-4 font-bold">Luz</th>
                <th className="pb-4 font-bold">Agua</th>
                <th className="pb-4 font-bold">Total</th>
                <th className="pb-4 font-bold text-right">Estado / Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {consolidatedData.map((item) => (
                <TableRow key={item.floor} item={item} myFloor={myFloor} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden flex flex-col gap-4">
          {consolidatedData.map((item) => (
            <div
              key={item.floor}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-black text-slate-800">
                  Piso {item.floor}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    item.status === "PAGADO"
                      ? "bg-green-50 text-green-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-50 pt-3">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    Luz
                  </p>
                  <p className="text-sm font-semibold text-slate-600">
                    S/ {item.luz}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    Agua
                  </p>
                  <p className="text-sm font-semibold text-slate-600">
                    S/ {item.agua}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold text-purple-600">
                    Total
                  </p>
                  <p className="text-sm font-black text-slate-900">
                    S/ {item.total}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DetailModal
        isOpen={!!selectedDetail}
        onClose={() => setSelectedDetail(null)}
        config={config}
        data={selectedDetail?.data}
        type={selectedDetail?.type}
        mode={selectedDetail?.mode}
      />
    </div>
  );
}

function StatCard({ icon, title, amount, date, isPersonal, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-purple-200 transition-all cursor-pointer relative"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          isPersonal
            ? "bg-purple-600 text-white"
            : "bg-purple-50 text-purple-600"
        }`}
      >
        {React.cloneElement(icon, { size: 22 })}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter truncate">
          {title}
        </p>
        <h3 className="text-lg font-black text-slate-900 truncate">
          S/ {Number(amount).toFixed(2)}
        </h3>

        {date && (
          <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md inline-block">
            Fecha venc.:{" "}
            {new Date(date).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              timeZone: "UTC",
            })}
          </span>
        )}
      </div>

      <Eye
        size={16}
        className="text-slate-200 group-hover:text-purple-400 shrink-0"
      />
    </div>
  );
}

function BadgeCount({ label, count, total, color }) {
  const styles = {
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
  };
  return (
    <div className={`border px-4 py-2 rounded-2xl ${styles[color]}`}>
      <p className="text-[9px] uppercase font-black opacity-70">{label}</p>
      <p className="text-lg font-black">
        {count}
        {total ? ` / ${total}` : ""}
      </p>
    </div>
  );
}

function TableRow({ item, myFloor }) {
  const whatsappNumber = String(item.phone).replace(/\D/g, "");

  const statusStyles = {
    Pagado: "bg-emerald-50 text-emerald-600",
    "Pago Parcial": "bg-blue-50 text-blue-600",
    Pendiente: "bg-amber-50 text-amber-600",
  };

  return (
    <tr className="group hover:bg-slate-50/50 transition-colors">
      <td className="py-5 font-bold text-slate-700">Piso {item.floor}</td>
      <td className="py-5 text-slate-500 text-sm">
        S/ {item.light.toFixed(2)}
      </td>
      <td className="py-5 text-slate-500 text-sm">
        S/ {item.water.toFixed(2)}
      </td>
      <td className="py-5 font-black text-slate-900">
        S/ {item.total.toFixed(2)}
      </td>
      <td className="py-5 text-right">
        <div className="flex flex-col items-end gap-1">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusStyles[item.status]}`}
          >
            {item.status}
          </span>
          {item.status !== "Pagado" &&
            item.floor !== myFloor &&
            whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hola ${item.neighborName}, detalle del mes:\n` +
                    `💡 Luz: S/ ${item.light.toFixed(2)}\n💧 Agua: S/ ${item.water.toFixed(2)}\n` +
                    `Total: *S/ ${item.total.toFixed(2)}*\nEstado: ${item.status}`,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-green-600 font-bold hover:text-green-700 flex items-center gap-1"
              >
                <span>📱</span> Recordar{" "}
                {item.status === "Pago Parcial" ? "saldo" : "pago"}
              </a>
            )}
        </div>
      </td>
    </tr>
  );
}
