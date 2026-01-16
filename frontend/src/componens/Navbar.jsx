import { Menu, ChevronDown, Calendar, Plus, Check } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { ReciboContext } from "../context/ReciboContext";
import { useLocation } from "react-router-dom";

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const {
    historialAgua,
    historialLuz,
    periodoSeleccionado,
    setPeriodoSeleccionado,
  } = useContext(ReciboContext);

  const tituloPeriodo = useMemo(() => {
    if (periodoSeleccionado === "nuevo") return "Nuevo Registro en curso...";
    if (!periodoSeleccionado) return "Seleccione un periodo";

    const fecha = new Date(periodoSeleccionado + "-01T00:00:00");
    return `Resumen de ${fecha.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    })}`;
  }, [periodoSeleccionado]);

  const getHeaderTitle = () => {
    switch (location.pathname) {
      case "/":
        return `${tituloPeriodo || "Inicio"}`;
      case "/consumos/luz":
      case "/consumos/agua":
      case "/consumos/reparto":
        return "Gestión de Recibos";
      case "/configuracion":
        return "Ajustes del Sistema";
      default:
        return "Panel de Control";
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const periodosUnicos = useMemo(() => {
    const fechas = [
      ...historialAgua.map((r) => r.fecha.substring(0, 7)),
      ...historialLuz.map((r) => r.fecha.substring(0, 7)),
    ];
    return [...new Set(fechas)].sort().reverse();
  }, [historialAgua, historialLuz]);

  const formatearFecha = (fechaStr) => {
    if (fechaStr === "nuevo") return "+ Nuevo Registro";
    const fecha = new Date(fechaStr + "T00:00:00");
    return fecha.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-100 shadow-sm relative z-50">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="mr-4 p-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-purple-600 transition-all active:scale-90"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-2xl font-bold text-slate-800 transition-all duration-300">
          {getHeaderTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-slate-400">
          <Calendar size={16} />
          <span className="text-[14px] font-bold uppercase tracking-widest">
            Periodo:
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between min-w-[200px] bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-2xl px-4 py-2.5 hover:border-purple-300 hover:bg-purple-50/30 transition-all shadow-sm group"
          >
            <span className="capitalize">
              {formatearFecha(periodoSeleccionado)}
            </span>
            <ChevronDown
              size={18}
              className={`ml-2 text-slate-400 group-hover:text-purple-500 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              ></div>

              <div className="absolute right-0 mt-2 w-full min-w-[220px] bg-white border border-slate-100 rounded-2xl shadow-xl z-20 py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                <button
                  onClick={() => {
                    setPeriodoSeleccionado("nuevo");
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors ${
                    periodoSeleccionado === "nuevo"
                      ? "text-purple-600 bg-purple-50"
                      : "text-purple-500 hover:bg-purple-50/50"
                  }`}
                >
                  <Plus size={16} />
                  Nuevo Registro
                </button>

                <div className="h-px bg-slate-50 my-1 mx-4"></div>

                {/* Lista de Periodos Existentes */}
                <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                  {periodosUnicos.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPeriodoSeleccionado(p);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm capitalize transition-colors ${
                        periodoSeleccionado === p
                          ? "bg-purple-600 text-white font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {formatearFecha(p)}
                      {periodoSeleccionado === p && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
