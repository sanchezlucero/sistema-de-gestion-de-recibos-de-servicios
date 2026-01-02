import { useEffect, useState } from "react";

export default function Reparto() {
  const [form, setForm] = useState({
    aportes: [
      { piso: 1, monto: "" },
      { piso: 2, monto: "" },
      { piso: 3, monto: "" }, // tu piso
      { piso: 4, monto: "" },
      { piso: 5, monto: "" },
    ],
    total_recaudado: "",
    diferencia: "",
    id: "",
    total_recibo: "",
    mes: "",
  });
  const numeroPisos = form.aportes.length;
  const totalAportado = form.aportes.reduce(
    (acc, item) => acc + Number(item.monto || 0),
    0
  );

  const diferencia = totalAportado - Number(form.total_recibo || 0);

  const diferenciaPorPiso = numeroPisos > 0 ? diferencia / numeroPisos : 0;
  const pisos = [1, 2, 3, 4, 5];

  useEffect(() => {
    const repartos = JSON.parse(localStorage.getItem("repartos")) || [];
    if (repartos.length === 0) return;
    const ultimoReparto = repartos.at(-1);
    setForm((prev) => ({
      ...prev,
      aportes: ultimoReparto.aportes,
      total_recaudado: ultimoReparto.total_recaudado,
      diferencia: ultimoReparto.diferencia,
      id: ultimoReparto.id,
      total_recibo: ultimoReparto.total_recibo,
      mes: ultimoReparto.mes,
    }));
  }, []);

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
    console.log("dió click");

    const reparto = {
      id: crypto.randomUUID(),
      tipo: "agua", // o "luz"
      mes: form.mes,
      total_recibo: Number(form.total_recibo),
      aportes: form.aportes.map((a) => ({
        piso: a.piso,
        monto: Number(a.monto || 0),
      })),
      creado_en: new Date().toISOString(),
    };

    const guardados = JSON.parse(localStorage.getItem("repartos")) || [];

    guardados.push(reparto);

    localStorage.setItem("repartos", JSON.stringify(guardados));
  };

  return (
    <div>
      <div className="bg-white mx-4 p-4 rounded-lg shadow">
        <div>
          <h2 className="font-semibold mb-4">Agua</h2>
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
                        Mes del recibo
                      </label>
                      <input
                        type="month"
                        name="mes"
                        value={form.mes}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm  focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

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

                    {/* SOLO VISUAL */}
                    <div className="rounded-lg bg-slate-50 p-3 text-sm">
                      <p>
                        Total aportado: <b>S/ {totalAportado}</b>
                      </p>
                      <p>
                        Diferencia: <b>S/ {diferencia.toFixed(2)}</b>
                      </p>
                      <p>
                        Por piso (5): <b>S/ {diferenciaPorPiso.toFixed(2)}</b>
                      </p>
                    </div>
                  </div>
                </div>

                {/* REPARTO */}
                <div className="lg:col-span-2 rounded-xl border border-purple-200 bg-white p-4 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold text-slate-700">
                    Reparto por piso
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pisos.map((piso, index) => (
                      <div key={piso} className="flex items-center gap-3">
                        <span className="w-16 text-sm text-slate-600">
                          Piso {piso}
                        </span>

                        <input
                          type="number"
                          step="0.01"
                          value={form.aportes[index].monto}
                          onChange={(e) =>
                            handleAporteChange(index, e.target.value)
                          }
                          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-right  focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="S/ 0.00"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="mt-6 w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white
             hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Guardar reparto
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-white mx-4 p-4 mt-4 rounded-lg shadow">
        <div>
          <h2 className="font-semibold mb-4">Luz</h2>

          <div className="py-2"></div>
        </div>
      </div>
    </div>
  );
}
