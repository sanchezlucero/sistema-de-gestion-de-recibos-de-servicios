import { useState, useEffect, useContext } from "react";
import { Save, Users, Building2, Smartphone, ChevronDown } from "lucide-react";
import { notify } from "../utils/notifications";
import { ReceiptContext } from "../context/ReceiptContext";

export default function Configuracion() {
  const { updateConfig } = useContext(ReceiptContext);
  const [config, setConfig] = useState({
    totalFloors: 5,
    myFloor: 2,
    buildingName: "",
    neighbors: [],
  });

  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem("configuracion"));
    console.log("savedConfig: ", savedConfig);
    if (savedConfig) {
      setConfig(savedConfig);
    } else {
      const initialNeighbors = Array.from(
        { length: config.totalFloors },
        (_, i) => ({
          floor: i + 1,
          name: "",
          phone: "",
        }),
      );
      setConfig((prev) => ({ ...prev, neighbors: initialNeighbors }));
    }
  }, []);

  useEffect(() => {
    setConfig((prev) => {
      const currentCount = prev.neighbors.length;
      const targetCount = prev.totalFloors || 0;

      if (targetCount === currentCount) return prev;

      if (targetCount > currentCount) {
        const extraNeighbors = Array.from(
          { length: targetCount - currentCount },
          (_, i) => ({
            floor: currentCount + i + 1,
            name: "",
            phone: "",
          }),
        );
        return { ...prev, neighbors: [...prev.neighbors, ...extraNeighbors] };
      } else {
        // Remove rows from the end (slice)
        return { ...prev, neighbors: prev.neighbors.slice(0, targetCount) };
      }
    });
  }, [config.totalFloors]); // Runs whenever totalFloors changes

  const handleSave = () => {
    const { totalFloors, myFloor } = config;

    if (!totalFloors || totalFloors <= 0) {
      return notify.warn("Por favor, ingresa el número total de pisos.");
    }

    if (!myFloor) {
      return notify.warn("Por favor, selecciona cuál es tu piso.");
    }

    if (Number(myFloor) > Number(totalFloors)) {
      return notify.warn("Tu piso no puede ser mayor al total de pisos.");
    }

    updateConfig(config);
    notify.success("Configuración guardada correctamente");
  };

  const updateNeighbors = (floor, campo, valor) => {
    const newNeighbors = config.neighbors.map((v) =>
      v.floor === floor ? { ...v, [campo]: valor } : v,
    );
    setConfig({ ...config, neighbors: newNeighbors });
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
              value={config.totalFloors}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setConfig({ ...config, totalFloors: isNaN(val) ? 0 : val });
              }}
              className="w-full rounded-xl border p-3 text-sm outline-none transition-all shadow-sm border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider transition-colors group-focus-within:text-purple-600 text-left">
              Yo soy el Piso:
            </label>
            <div className="relative group">
              <select
                value={config.myFloor}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setConfig({ ...config, myFloor: isNaN(val) ? 0 : val });
                }}
                className="w-full appearance-none rounded-xl border p-3 pr-10 text-sm outline-none transition-all shadow-sm border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 bg-white cursor-pointer"
              >
                {Array.from({ length: config.totalFloors }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Piso {i + 1}
                  </option>
                ))}
              </select>

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
              value={config.buildingName}
              onChange={(e) =>
                setConfig({ ...config, buildingName: e.target.value })
              }
              className="w-full rounded-xl border p-3 text-sm outline-none transition-all shadow-sm border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            />
          </div>
        </div>
      </div>

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
              {config?.neighbors?.map((neighboor) => (
                <tr key={neighboor.floor}>
                  <td className="py-4 font-bold text-slate-700">
                    Piso {neighboor.floor}
                  </td>
                  <td className="py-2">
                    <input
                      type="text"
                      placeholder="Nombre del vecino"
                      value={neighboor.name}
                      onChange={(e) =>
                        updateNeighbors(neighboor.floor, "name", e.target.value)
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
                        value={neighboor.phone}
                        onChange={(e) =>
                          updateNeighbors(
                            neighboor.floor,
                            "phone",
                            e.target.value,
                          )
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
