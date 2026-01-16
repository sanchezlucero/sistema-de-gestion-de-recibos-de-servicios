import { Lightbulb, Droplets, Wallet, MoreVertical } from "lucide-react";
import { useContext, useMemo } from "react";
import { ReciboContext } from "../context/ReciboContext";

export default function Dashboard() {
  const { periodoSeleccionado, historialLuz, historialAgua } =
    useContext(ReciboContext);

  const tituloPeriodo = useMemo(() => {
    if (periodoSeleccionado === "nuevo") return "Nuevo Registro en curso...";
    if (!periodoSeleccionado) return "Seleccione un periodo";

    const fecha = new Date(periodoSeleccionado + "-01T00:00:00");
    return `Resumen de ${fecha.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    })}`;
  }, [periodoSeleccionado]);

  const reciboLuzActual = useMemo(() => {
    return historialLuz.find((r) => r.fecha.startsWith(periodoSeleccionado));
  }, [periodoSeleccionado, historialLuz]);

  const reciboAguaActual = useMemo(() => {
    return historialAgua.find((r) => r.fecha.startsWith(periodoSeleccionado));
  }, [periodoSeleccionado, historialAgua]);

  const cuotasPiso2 = useMemo(() => {
    const repartos = JSON.parse(localStorage.getItem("repartos")) || [];

    const repartoLuz = repartos.find(
      (r) => r.mes === periodoSeleccionado && r.servicio === "luz"
    );
    const repartoAgua = repartos.find(
      (r) => r.mes === periodoSeleccionado && r.servicio === "agua"
    );

    return {
      luz: repartoLuz?.aportes.find((a) => a.piso === 2)?.monto || 0,
      agua: repartoAgua?.aportes.find((a) => a.piso === 2)?.monto || 0,
    };
  }, [periodoSeleccionado]);

  const recaudacionConsolidada = useMemo(() => {
    const repartos = JSON.parse(localStorage.getItem("repartos")) || [];
    const pisos = [1, 2, 3, 4, 5];

    // Buscamos los dos repartos del mes seleccionado
    const repartoLuz = repartos.find(
      (r) => r.mes === periodoSeleccionado && r.servicio === "luz"
    );
    const repartoAgua = repartos.find(
      (r) => r.mes === periodoSeleccionado && r.servicio === "agua"
    );

    return pisos.map((numPiso) => {
      // Buscamos la info específica de este piso en cada reparto
      const datoLuz = repartoLuz?.aportes.find((a) => a.piso === numPiso);
      const datoAgua = repartoAgua?.aportes.find((a) => a.piso === numPiso);

      const montoLuz = Number(datoLuz?.monto || 0);
      const montoAgua = Number(datoAgua?.monto || 0);

      // Un piso está pagado solo si AMBOS servicios están marcados como pagados
      // Si el reparto no existe, por defecto está pendiente (false)
      const estaPagadoLuz = datoLuz?.pagado || false;
      const estaPagadoAgua = datoAgua?.pagado || false;
      const pagadoTotal = estaPagadoLuz && estaPagadoAgua;

      return {
        piso: numPiso,
        luz: montoLuz,
        agua: montoAgua,
        total: montoLuz + montoAgua,
        estado: pagadoTotal ? "Pagado" : "Pendiente",
      };
    });
  }, [periodoSeleccionado]); // Se recalcula si cambias el mes en el Header

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* <h2 className="text-2xl font-bold text-slate-800 text-center">
        {tituloPeriodo}
      </h2> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-5">
            {/* Icono más grande y con color suave */}
            <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-600">
              <Lightbulb size={32} strokeWidth={1.5} />
            </div>

            <div className="flex flex-col">
              <span className="text-slate-400 text-sm font-medium">
                Luz Edificio
              </span>
              <span className="text-xl font-bold text-slate-900 leading-tight">
                S/ {reciboLuzActual ? reciboLuzActual?.importe_total : "0.00"}
              </span>
              {reciboLuzActual && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                    Vence:{" "}
                    {new Date(reciboLuzActual?.fecha).toLocaleDateString(
                      "es-ES",
                      { day: "2-digit", month: "short" }
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button className="text-slate-300 self-start mt-2">
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-5">
            {/* Icono más grande y con color suave */}
            <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-600">
              <Wallet size={32} strokeWidth={1.5} />
            </div>

            <div className="flex flex-col">
              <span className="text-slate-400 text-sm font-medium">
                Mi Cuota Total Luz
              </span>
              <span className="text-xl font-bold text-slate-900 leading-tight">
                S/ {Number(cuotasPiso2.luz)}
              </span>
            </div>
          </div>

          <button className="text-slate-300 self-start mt-2">
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-600">
              <Droplets size={32} strokeWidth={1.5} />
            </div>

            <div className="flex flex-col">
              <span className="text-slate-400 text-sm font-medium">
                Agua Edificio
              </span>
              <span className="text-xl font-bold text-slate-900 leading-tight">
                S/{" "}
                {reciboAguaActual
                  ? reciboAguaActual.importe_total || reciboAguaActual.total
                  : "0.00"}
              </span>
              {reciboAguaActual && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                    Vence:{" "}
                    {new Date(reciboAguaActual.fecha).toLocaleDateString(
                      "es-ES",
                      { day: "2-digit", month: "short" }
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button className="text-slate-300 self-start mt-2">
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-600">
              <Wallet size={32} strokeWidth={1.5} />
            </div>

            <div className="flex flex-col">
              <span className="text-slate-400 text-sm font-medium">
                Mi Cuota Total Agua
              </span>
              <span className="text-xl font-bold text-slate-900 leading-tight">
                S/ {Number(cuotasPiso2.agua)}
              </span>
            </div>
          </div>

          <button className="text-slate-300 self-start mt-2">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold mb-6">Recaudación por Piso</h3>
            <p className="text-sm text-slate-500 font-medium">
              Resumen de pagos por departamento
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl">
              <p className="text-[10px] uppercase font-bold text-emerald-600">
                Al día
              </p>
              <p className="text-xl font-black text-emerald-700">
                {
                  recaudacionConsolidada.filter((p) => p.estado === "Pagado")
                    .length
                }{" "}
                / 5
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-2xl">
              <p className="text-[10px] uppercase font-bold text-amber-600">
                Pendientes
              </p>
              <p className="text-xl font-black text-amber-700">
                {
                  recaudacionConsolidada.filter((p) => p.estado !== "Pagado")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-50">
              <th className="pb-4 font-medium">Piso</th>
              <th className="pb-4 font-medium">Luz</th>
              <th className="pb-4 font-medium">Agua</th>
              <th className="pb-4 font-medium">Total</th>
              <th className="pb-4 font-medium text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recaudacionConsolidada.map((item) => (
              <tr
                key={item.piso}
                className="group hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-4 font-bold text-slate-700">
                  Piso {item.piso}
                </td>
                <td className="py-4 text-slate-600">
                  S/ {item.luz.toFixed(2)}
                </td>
                <td className="py-4 text-slate-600">
                  S/ {item.agua.toFixed(2)}
                </td>
                <td className="py-4 font-bold text-slate-900">
                  S/ {item.total.toFixed(2)}
                </td>
                <td className="py-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.estado === "Pagado"
                          ? "bg-emerald-50 text-emerald-600"
                          : item.estado === "Pago Parcial"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {item.estado}
                    </span>

                    {item.estado !== "Pagado" && item.piso !== 2 && (
                      <a
                        href={`https://wa.me/51999999999?text=${encodeURIComponent(
                          `Hola Piso ${item.piso}, te adjunto el detalle de este mes:\n` +
                            `💡 Luz: S/ ${item.luz.toFixed(2)}\n` +
                            `💧 Agua: S/ ${item.agua.toFixed(2)}\n` +
                            `Total: S/ ${item.total.toFixed(2)}\n\n` +
                            `Estado: *${item.estado.toUpperCase()}*`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-green-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>📱</span> Recordar{" "}
                        {item.estado === "Pago Parcial" ? "saldo" : "pago"}
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
