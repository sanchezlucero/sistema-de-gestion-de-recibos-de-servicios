import { Lightbulb, Droplets, Wallet, MoreVertical } from "lucide-react";
import { useContext, useMemo } from "react";
import { ReceiptContext } from "../context/ReceiptContext";

export default function Dashboard() {
  const { selectedPeriod, lightHistory, waterHistory, config, distributions } =
    useContext(ReceiptContext);
  const totalFloors = config?.totalFloors || 0;
  const myFloor = config?.myFloor || 2;
  const neighbors = config?.neighbors || [];

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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Lightbulb size={32} />}
          title="Luz Edificio"
          amount={currentLightReceipt?.importe_total || 0}
          date={currentLightReceipt?.fecha}
        />
        <StatCard
          icon={<Wallet size={32} />}
          title="Mi Cuota Luz"
          amount={myDues.light}
          isPersonal
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
        />
        <StatCard
          icon={<Wallet size={32} />}
          title="Mi Cuota Agua"
          amount={myDues.water}
          isPersonal
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

        <div className="overflow-x-auto">
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
      </div>
    </div>
  );
}

function StatCard({ icon, title, amount, date, isPersonal }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-purple-200 transition-all">
      <div className="flex items-center gap-5">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isPersonal ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-600"}`}
        >
          {icon}
        </div>
        <div>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            {title}
          </span>
          <div className="text-xl font-black text-slate-900 leading-tight">
            S/ {Number(amount).toFixed(2)}
          </div>
          {date && (
            <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full mt-1 inline-block">
              Vence:{" "}
              {new Date(date).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          )}
        </div>
      </div>
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
