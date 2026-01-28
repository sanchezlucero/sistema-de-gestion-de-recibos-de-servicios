import { useContext, useEffect, useMemo, useState } from "react";
import { ReceiptContext } from "../../context/ReceiptContext";
import { FileCheck } from "lucide-react";
import { notify } from "../../utils/notifications";

export default function Reparto() {
  const { selectedPeriod, waterHistory, lightHistory, config } =
    useContext(ReceiptContext);
  const totalFloors = config?.totalFloors;
  const adminFloor = config?.myFloor || 2;
  const [service, setService] = useState("agua");

  const createBaseContributions = (n) =>
    Array.from({ length: n }, (_, i) => ({
      floor: i + 1,
      amount: "",
      is_paid: false,
    }));

  const [form, setForm] = useState({
    contributions: createBaseContributions(totalFloors),
    total_receipt: "",
    month: "",
  });

  const totalContributed = useMemo(
    () =>
      form.contributions.reduce(
        (acc, item) => acc + Number(item.amount || 0),
        0,
      ),
    [form.contributions],
  );

  const difference = totalContributed - Number(form.total_receipt || 0);
  const differencePerFloor = totalFloors > 0 ? difference / totalFloors : 0;

  useEffect(() => {
    // 1. Si no hay periodo seleccionado o es nuevo, forzamos los pisos actuales
    if (!selectedPeriod || selectedPeriod === "nuevo") {
      setForm((prev) => ({
        ...prev,
        month: "",
        total_receipt: "",
        contributions: createBaseContributions(totalFloors), // Aquí se crean los 6
      }));
      return;
    }

    // 2. Si hay algo guardado en LocalStorage
    const savedDistributions =
      JSON.parse(localStorage.getItem("repartos")) || [];
    const existingDistribution = savedDistributions.find(
      (r) => r.month === selectedPeriod && r.service === service,
    );

    if (existingDistribution) {
      // 1. Extraemos los aportes guardados
      let updatedContributions = [...existingDistribution.contributions];

      // 2. Si ahora hay más pisos que antes, agregamos los que faltan
      if (updatedContributions.length < totalFloors) {
        const missingFloorsCount = totalFloors - updatedContributions.length;
        const startFloor = updatedContributions.length + 1;

        const extraFloors = Array.from(
          { length: missingFloorsCount },
          (_, i) => ({
            floor: startFloor + i,
            amount: "",
            is_paid: false,
          }),
        );

        updatedContributions = [...updatedContributions, ...extraFloors];
      }
      // 3. Si ahora hay menos pisos (por si reduces el edificio), recortamos
      else if (updatedContributions.length > totalFloors) {
        updatedContributions = updatedContributions.slice(0, totalFloors);
      }

      setForm({
        ...existingDistribution,
        contributions: updatedContributions, // Ahora tiene los pisos correctos
      });
    } else {
      // Si NO existe (es un mes limpio), generamos la base con el totalFloors actualizado
      const history = service === "agua" ? waterHistory : lightHistory;
      const originalReceipt = history.find((r) =>
        r.fecha.startsWith(selectedPeriod),
      );

      setForm({
        month: selectedPeriod,
        total_receipt: originalReceipt?.importe_total || 0,
        service,
        contributions: createBaseContributions(totalFloors).map((c) => {
          // Auto-llenado de tu piso (adminFloor)
          if (c.floor === adminFloor && originalReceipt) {
            return { ...c, amount: originalReceipt.total || "", is_paid: true };
          }
          return c;
        }),
      });
    }
  }, [selectedPeriod, service, totalFloors, adminFloor]); // <--- VITAL: totalFloors aquí

  const handleTogglePago = (index) => {
    setForm((prev) => {
      const nuevosAportes = [...prev.contributions];
      nuevosAportes[index] = {
        ...nuevosAportes[index],
        is_paid: !nuevosAportes[index].is_paid,
      };
      return { ...prev, contributions: nuevosAportes };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAporteChange = (index, value) => {
    setForm((prev) => {
      const nuevosAportes = [...prev.contributions];
      nuevosAportes[index] = {
        ...nuevosAportes[index],
        amount: value,
      };

      return {
        ...prev,
        contributions: nuevosAportes,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const storageKey = "repartos";
      const savedDistributions =
        JSON.parse(localStorage.getItem(storageKey)) || [];
      console.log("savedDistributions: ", savedDistributions);
      const existingIndex = savedDistributions.findIndex(
        (item) => item.service === service && item.month === form.month,
      );

      const newDistribution = {
        id:
          existingIndex !== -1
            ? savedDistributions[existingIndex].id
            : crypto.randomUUID(),
        service: service,
        month: form.month,
        total_receipt: Number(form.total_receipt),
        contributions: form.contributions.map((item) => ({
          floor: item.floor,
          amount: Number(item.amount || 0),
          is_paid: item.is_paid,
        })),
        updated_at: new Date().toISOString(),
      };

      let updatedList;
      if (existingIndex !== -1) {
        updatedList = [...savedDistributions];
        updatedList[existingIndex] = newDistribution;
      } else {
        updatedList = [...savedDistributions, newDistribution];
      }

      localStorage.setItem(storageKey, JSON.stringify(updatedList));

      notify.success(
        existingIndex !== -1
          ? "Reparto actualizado correctamente"
          : "Reparto guardado correctamente",
      );
    } catch (error) {
      console.error("Error saving distribution:", error);
      notify.error("Ocurrió un error al guardar los datos.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-6 items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="service"
            value="agua"
            checked={service === "agua"}
            onChange={() => setService("agua")}
            className="accent-purple-600"
          />
          Agua
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="service"
            value="luz"
            checked={service === "luz"}
            onChange={() => setService("luz")}
            className="accent-purple-600"
          />
          Luz
        </label>
      </div>

      <div>
        <h2 className="font-semibold mb-4">
          {service == "luz" ? "Luz" : "Agua"}
        </h2>
        <div className="py-2">
          <form action="" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 rounded-xl border border-purple-200 bg-white p-4 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Resumen del recibo
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500">
                      Total del recibo
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="total_receipt"
                      value={form.total_receipt}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm  focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
                    />
                  </div>

                  <div
                    className={`rounded-xl p-4 text-sm transition-colors ${
                      differencePerFloor === 0
                        ? "bg-emerald-50 border border-emerald-100 text-emerald-800"
                        : differencePerFloor < 0
                          ? "bg-amber-50 border border-amber-100 text-amber-800"
                          : "bg-blue-50 border border-blue-100 text-blue-800"
                    }`}
                  >
                    <div className="space-y-2">
                      <p className="flex justify-between">
                        <span>Total aportado:</span>
                        <span className="font-bold text-base">
                          S/ {totalContributed.toFixed(2)}
                        </span>
                      </p>

                      <p className="flex justify-between border-t border-current/10 pt-2">
                        <span>Diferencia total:</span>
                        <span
                          className={`font-bold ${
                            differencePerFloor < 0 ? "text-red-600" : ""
                          }`}
                        >
                          S/ {differencePerFloor.toFixed(2)}
                        </span>
                      </p>

                      <div className="mt-3 p-2 bg-white/50 rounded-lg border border-current/5">
                        <p className="mt-1 font-medium">
                          {differencePerFloor === 0
                            ? "El reparto cuadra perfectamente."
                            : differencePerFloor < 0
                              ? `Cobrar S/ ${Math.abs(
                                  differencePerFloor,
                                ).toFixed(2)} adicionales por piso.`
                              : `Devolver S/ ${differencePerFloor.toFixed(
                                  2,
                                )} a cada piso.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 rounded-xl border border-purple-200 bg-white p-4 sm:p-6 shadow-sm">
  <h3 className="mb-6 text-sm font-bold text-slate-700 uppercase tracking-wider">
    Reparto por piso
  </h3>

  {/* Cambiamos a 1 columna en tablet y 2 solo en pantallas grandes (xl) */}
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-4">
    {form.contributions.map((item, index) => (
      <div
        key={`piso-key-${item.floor}`}
        className="flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-slate-50 transition-colors"
      >
        {/* Identificador y Switch agrupados */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="w-12 text-sm font-bold text-slate-600">
            Piso {item.floor}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={item.is_paid}
              onChange={() => handleTogglePago(index)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Input con prefijo visual de moneda */}
        <div className="relative flex-1 max-w-[150px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
            S/
          </span>
          <input
            type="number"
            step="0.01"
            value={item.amount}
            onChange={(e) => handleAporteChange(index, e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-sm text-right font-semibold text-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
            placeholder="0.00"
          />
        </div>
      </div>
    ))}
  </div>

  <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
    <button
      type="submit"
      className=" bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-200 font-bold"
    >
      <FileCheck size={20} />
      Guardar reparto
    </button>
  </div>
</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
