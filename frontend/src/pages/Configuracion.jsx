import { useState, useEffect } from "react";
import { Save, Users, Building2, Smartphone, ChevronDown } from "lucide-react";
import { notify } from "../utils/notifications";

export default function Configuracion() {
  const [config, setConfig] = useState({
    totalPisos: 5,
    miPiso: 2,
    nombreEdificio: "",
    vecinos: [],
  });

  // Cargar configuración inicial
  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem("configuracion"));
    console.log("savedConfig: ", savedConfig);
    if (savedConfig) {
      setConfig(savedConfig);
    } else {
      // Si no hay, inicializamos vecinos según el total de pisos
      const inicializarVecinos = Array.from({ length: 5 }, (_, i) => ({
        piso: i + 1,
        nombre: "",
        telefono: "",
      }));
      setConfig((prev) => ({ ...prev, vecinos: inicializarVecinos }));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("configuracion", JSON.stringify(config));
    notify.success("Configuración guardada correctamente");
  };

  const updateVecino = (piso, campo, valor) => {
    const nuevosVecinos = config.vecinos.map((v) =>
      v.piso === piso ? { ...v, [campo]: valor } : v
    );
    setConfig({ ...config, vecinos: nuevosVecinos });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex justify-end items-center">
        <button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Save size={18} /> Guardar Cambios
        </button>
      </div>

      {/* BLOQUE 1: AJUSTES GENERALES */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="text-purple-600" />
          <h3 className="text-lg font-bold">Ajustes del Edificio</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider transition-colors group-focus-within:text-purple-600 text-left">
              Total de Pisos
            </label>
            <input
              type="number"
              value={config.totalPisos}
              onChange={(e) =>
                setConfig({ ...config, totalPisos: parseInt(e.target.value) })
              }
              className="w-full rounded-xl border p-3 text-sm outline-none transition-all shadow-sm border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider transition-colors group-focus-within:text-purple-600 text-left">
              Yo soy el Piso:
            </label>
            <div className="relative group">
              <select
                value={config.miPiso}
                onChange={(e) =>
                  setConfig({ ...config, miPiso: parseInt(e.target.value) })
                }
                className="w-full appearance-none rounded-xl border p-3 pr-10 text-sm outline-none transition-all shadow-sm border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 bg-white cursor-pointer"
              >
                {Array.from({ length: config.totalPisos }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Piso {i + 1}
                  </option>
                ))}
              </select>

              {/* Icono de flecha personalizado */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 group-focus-within:text-purple-500">
                <ChevronDown size={18} strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider transition-colors group-focus-within:text-purple-600 text-left">
              Nombre Edificio
            </label>
            <input
              type="text"
              placeholder="Ej: Residencial Los Olivos"
              value={config.nombreEdificio}
              onChange={(e) =>
                setConfig({ ...config, nombreEdificio: e.target.value })
              }
              className="w-full rounded-xl border p-3 text-sm outline-none transition-all shadow-sm border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            />
          </div>
        </div>
      </div>

      {/* BLOQUE 2: DIRECTORIO DE VECINOS */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <Users className="text-purple-600" />
          <h3 className="text-lg font-bold">Directorio de Vecinos</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-50">
                <th className="pb-4 font-medium">Piso</th>
                <th className="pb-4 font-medium">Nombre / Responsable</th>
                <th className="pb-4 font-medium">
                  WhatsApp (con código de país)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {config.vecinos.map((vecino) => (
                <tr key={vecino.piso}>
                  <td className="py-4 font-bold text-slate-700">
                    Piso {vecino.piso}
                  </td>
                  <td className="py-2">
                    <input
                      type="text"
                      placeholder="Nombre del vecino"
                      value={vecino.nombre}
                      onChange={(e) =>
                        updateVecino(vecino.piso, "nombre", e.target.value)
                      }
                      className="w-full bg-transparent border-none focus:bg-slate-50 rounded-lg px-2 py-1 outline-none text-slate-600"
                    />
                  </td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <Smartphone size={16} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="51999888777"
                        value={vecino.telefono}
                        onChange={(e) =>
                          updateVecino(vecino.piso, "telefono", e.target.value)
                        }
                        className="w-full bg-transparent border-none focus:bg-slate-50 rounded-lg px-2 py-1 outline-none text-slate-600"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
