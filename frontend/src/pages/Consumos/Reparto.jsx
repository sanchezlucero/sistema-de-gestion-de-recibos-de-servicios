import { useEffect, useState } from "react";

export default function Reparto() {
  const [servicio, setServicio] = useState("agua");
  const storageKey = servicio === "agua" ? "recibosAgua" : "recibosLuz";
  const dataDefault = {
    aportes: [
      { piso: 1, monto: "", pagado: false },
      { piso: 2, monto: "", pagado: false },
      { piso: 3, monto: "", pagado: false },
      { piso: 4, monto: "", pagado: false },
      { piso: 5, monto: "", pagado: false },
    ],
    total_recaudado: "",
    diferencia: "",
    id: "",
    total_recibo: "",
    mes: "",
  };
  const [form, setForm] = useState(dataDefault);

  const numeroPisos = form?.aportes?.length;
  const totalAportado = form?.aportes?.reduce(
    (acc, item) => acc + Number(item.monto || 0),
    0
  );
  const diferencia = totalAportado - Number(form.total_recibo || 0);
  const diferenciaPorPiso = numeroPisos > 0 ? diferencia / numeroPisos : 0;
  const pisos = [1, 2, 3, 4, 5];

  useEffect(() => {
    const repartos = JSON.parse(localStorage.getItem("repartos")) || [];
    setForm(dataDefault);
    console.log("repartos: ", repartos);
    if (repartos.length === 0) return;
    const repartosServicio = repartos.filter((r) => r.servicio === servicio);
    if (repartosServicio.length === 0) return;
    console.log("repartosServicio: ", repartosServicio);
    const ultimoReparto = repartosServicio.at(-1);
    console.log("ultimoReparto: ", ultimoReparto);
    setForm((prev) => ({
      ...prev,
      aportes: ultimoReparto.aportes,
      total_recaudado: ultimoReparto.total_recaudado,
      diferencia: ultimoReparto.diferencia,
      id: ultimoReparto.id,
      total_recibo: ultimoReparto.total_recibo,
      mes: ultimoReparto.mes,
    }));
  }, [servicio]);

  /*   useEffect(() => {
    const recibos = JSON.parse(localStorage.getItem(storageKey)) || [];
    if (recibos.length === 0) return;

    const lastReceipt = recibos.at(-1);
    console.log("lastReceipt: ", lastReceipt);
    setForm((prev) => ({
      ...prev,
      total_recibo: lastReceipt.importe_total ?? "",
    }));
  }, [storageKey]); */

  useEffect(() => {
    if (!form.mes) return;

    // 1. Obtener datos de LocalStorage
    const storageKey = servicio === "agua" ? "recibosAgua" : "recibosLuz";
    const recibos = JSON.parse(localStorage.getItem(storageKey)) || [];
    console.log("recibos: ",recibos)
    const repartos = JSON.parse(localStorage.getItem("repartos")) || [];

    // 2. Buscar coincidencias para el mes seleccionado (formato YYYY-MM)
    const reciboMes = recibos.find((r) => r.fecha.startsWith(form.mes));
    const repartoMes = repartos.find(
      (r) => r.mes === form.mes && r.servicio === servicio
    );

    if (repartoMes) {
      // Caso A: Ya existe un reparto guardado, lo mostramos tal cual
      setForm((prev) => ({
        ...prev,
        ...repartoMes, // Esto carga total_recibo y el array de aportes completo
      }));
    } else if (reciboMes) {
      // Caso B: No hay reparto, pero sí hay recibo. Precargamos datos automáticos.
      setForm((prev) => {
        const nuevosAportes = [...prev.aportes];

        // Suponiendo que tú eres el Piso 2, asignamos el "total" calculado del recibo
        // El índice 1 corresponde al Piso 2 (piso 1 = index 0, piso 2 = index 1...)
        nuevosAportes[1] = {
          ...nuevosAportes[1],
          monto: reciboMes.total.toFixed(2),
          pagado: true, // Como es tu propio pago, puedes marcarlo como pagado por defecto
        };

        return {
          ...prev,
          total_recibo: reciboMes.importe_total,
          aportes: nuevosAportes,
        };
      });
    } else {
      // Caso C: No hay nada para ese mes, reseteamos a ceros
      setForm((prev) => ({
        ...prev,
        total_recibo: "",
        aportes: dataDefault.aportes,
      }));
    }
  }, [form.mes, servicio]); // Se ejecuta al cambiar mes o servicio

  const handleTogglePago = (index) => {
    setForm((prev) => {
      const nuevosAportes = [...prev.aportes];
      nuevosAportes[index] = {
        ...nuevosAportes[index],
        pagado: !nuevosAportes[index].pagado, // Invierte el valor
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

    // 1. Buscamos en el historial si ya existe un reparto para este mes y servicio
    const guardados = JSON.parse(localStorage.getItem("repartos")) || [];

    const indexExistente = guardados.findIndex(
      (r) => r.servicio === servicio && r.mes === form.mes
    );

    // 2. Creamos el objeto del reparto
    const reparto = {
      // Si ya existe, mantenemos su ID original. Si es nuevo, generamos uno.
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
      actualizado_en: new Date().toISOString(), // Útil para saber cuándo fue la última edición
    };

    // 3. Lógica de guardado inteligente
    if (indexExistente !== -1) {
      // Si ya existe el mes, reemplazamos el registro viejo con el nuevo
      guardados[indexExistente] = reparto;
      console.log("Registro actualizado para:", form.mes);
    } else {
      // Si es un mes nuevo, lo agregamos al array
      guardados.push(reparto);
      console.log("Nuevo registro creado para:", form.mes);
    }

    // 4. Guardamos el array final de vuelta al localStorage
    localStorage.setItem("repartos", JSON.stringify(guardados));
    alert(`Reparto de ${servicio} para ${form.mes} guardado con éxito.`);
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
                  {/* SECCIÓN DE ESTADO Y AJUSTE */}
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
                        <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                          Nota
                        </p>
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
                      {/* Switch de Pagado */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.aportes[index]?.pagado || false}
                          onChange={() => handleTogglePago(index)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>

                      <input
                        type="number"
                        step="0.01"
                        value={form?.aportes[index]?.monto}
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
  );
}
