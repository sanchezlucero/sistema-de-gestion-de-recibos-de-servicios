import { useContext, useEffect, useState } from "react";
import { ReciboContext } from "../../context/ReciboContext";
import { FileCheck } from "lucide-react";
import { notify } from "../../utils/notifications";

export default function Reparto() {
  const { periodoSeleccionado, historialAgua, historialLuz, configuracion } =
    useContext(ReciboContext);
  const numPisosActualles = configuracion?.totalPisos || 5;
  const miPisoAdmin = configuracion?.miPiso || 2;
  const [servicio, setServicio] = useState("agua");

  const crearAportesBase = (n) =>
    Array.from({ length: n }, (_, i) => ({
      piso: i + 1,
      monto: "",
      pagado: false,
    }));

  const [form, setForm] = useState({
    aportes: crearAportesBase(numPisosActualles),
    total_recibo: "",
    mes: "",
  });

  const totalAportado = form?.aportes?.reduce(
    (acc, item) => acc + Number(item.monto || 0),
    0
  );
  const diferencia = totalAportado - Number(form.total_recibo || 0);
  const diferenciaPorPiso =
    numPisosActualles > 0 ? diferencia / numPisosActualles : 0;

  useEffect(() => {
    if (!periodoSeleccionado || periodoSeleccionado === "nuevo") {
      setForm({
        mes: "",
        total_recibo: "",
        aportes: crearAportesBase(numPisosActualles),
      });
      return;
    }

    const repartos = JSON.parse(localStorage.getItem("repartos")) || [];
    const repartoExistente = repartos.find(
      (r) => r.mes === periodoSeleccionado && r.servicio === servicio
    );

    if (repartoExistente) {
      setForm(repartoExistente);
    } else {
      const historial = servicio === "agua" ? historialAgua : historialLuz;
      const reciboOriginal = historial.find((r) =>
        r.fecha.startsWith(periodoSeleccionado)
      );
      const total_recibo = reciboOriginal?.importe_total || "";
      const montoTotal = reciboOriginal?.total || "";

      const nuevosAportes = crearAportesBase(numPisosActualles).map(
        (aporte) => {
          if (aporte.piso === miPisoAdmin) {
            return { ...aporte, monto: montoTotal, pagado: true };
          }
          return aporte;
        }
      );

      setForm({
        mes: periodoSeleccionado,
        total_recibo: total_recibo,
        servicio,
        aportes: nuevosAportes,
      });
    }
  }, [
    periodoSeleccionado,
    servicio,
    historialAgua,
    historialLuz,
    configuracion,
  ]);

  const handleTogglePago = (index) => {
    setForm((prev) => {
      const nuevosAportes = [...prev.aportes];
      nuevosAportes[index] = {
        ...nuevosAportes[index],
        pagado: !nuevosAportes[index].pagado,
      };
      return { ...prev, aportes: nuevosAportes };
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
      const nuevosAportes = [...prev.aportes];
      nuevosAportes[index] = {
        ...nuevosAportes[index],
        monto: value,
      };

      return {
        ...prev,
        aportes: nuevosAportes,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const guardados = JSON.parse(localStorage.getItem("repartos")) || [];

      const indexExistente = guardados.findIndex(
        (r) => r.servicio === servicio && r.mes === form.mes
      );

      const reparto = {
        id:
          indexExistente !== -1
            ? guardados[indexExistente].id
            : crypto.randomUUID(),
        servicio,
        mes: form.mes,
        total_recibo: Number(form.total_recibo),
        aportes: form.aportes.map((a) => ({
          piso: a.piso,
          monto: Number(a.monto || 0),
          pagado: a.pagado,
        })),
        actualizado_en: new Date().toISOString(),
      };

      if (indexExistente !== -1) {
        guardados[indexExistente] = reparto;
      } else {
        guardados.push(reparto);
      }
      localStorage.setItem("repartos", JSON.stringify(guardados));
      notify.success("Reparto guardado correctamente");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-6 items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="servicio"
            value="agua"
            checked={servicio === "agua"}
            onChange={() => setServicio("agua")}
            className="accent-purple-600"
          />
          Agua
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="servicio"
            value="luz"
            checked={servicio === "luz"}
            onChange={() => setServicio("luz")}
            className="accent-purple-600"
          />
          Luz
        </label>
      </div>

      <div>
        <h2 className="font-semibold mb-4">
          {servicio == "luz" ? "Luz" : "Agua"}
        </h2>
        <div className="py-2">
          <form action="" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* RESUMEN */}
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
                      name="total_recibo"
                      value={form.total_recibo}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm  focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div
                    className={`rounded-xl p-4 text-sm transition-colors ${
                      diferencia === 0
                        ? "bg-emerald-50 border border-emerald-100 text-emerald-800"
                        : diferencia < 0
                        ? "bg-amber-50 border border-amber-100 text-amber-800"
                        : "bg-blue-50 border border-blue-100 text-blue-800"
                    }`}
                  >
                    <div className="space-y-2">
                      <p className="flex justify-between">
                        <span>Total aportado:</span>
                        <span className="font-bold text-base">
                          S/ {totalAportado.toFixed(2)}
                        </span>
                      </p>

                      <p className="flex justify-between border-t border-current/10 pt-2">
                        <span>Diferencia total:</span>
                        <span
                          className={`font-bold ${
                            diferencia < 0 ? "text-red-600" : ""
                          }`}
                        >
                          S/ {diferencia.toFixed(2)}
                        </span>
                      </p>

                      <div className="mt-3 p-2 bg-white/50 rounded-lg border border-current/5">
                        <p className="mt-1 font-medium">
                          {diferencia === 0
                            ? "El reparto cuadra perfectamente."
                            : diferencia < 0
                            ? `Cobrar S/ ${Math.abs(diferenciaPorPiso).toFixed(
                                2
                              )} adicionales por piso.`
                            : `Devolver S/ ${diferenciaPorPiso.toFixed(
                                2
                              )} a cada piso.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 rounded-xl border border-purple-200 bg-white p-4 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Reparto por piso
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {form.aportes.map((item, index) => (
                    <div
                      key={`piso-key-${item.piso}`}
                      className="flex items-center gap-3"
                    >
                      <span className="w-16 text-sm text-slate-600">
                        Piso {item.piso}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.pagado}
                          onChange={() => handleTogglePago(index)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>

                      <input
                        type="number"
                        step="0.01"
                        value={item.monto}
                        onChange={(e) =>
                          handleAporteChange(index, e.target.value)
                        }
                        className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-right  focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="S/ 0.00"
                      />
                    </div>
                  ))}
                </div>
                <div className="py-3 flex justify-end">
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <FileCheck size={18} />
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
