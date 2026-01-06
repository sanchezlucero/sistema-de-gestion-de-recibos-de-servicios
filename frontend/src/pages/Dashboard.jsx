import {
  Lightbulb,
  Droplets,
  Wallet,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

export default function Dashboard() {
  
  return (
    // Contenedor principal del Inicio
    <div className="max-w-7xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-slate-800 text-center">
        Resumen de Enero 2026
      </h2>

      {/* Grid con espaciado amplio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {" "}
        {/* Card Estilo Referencia */}
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
                S/ 470.00
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                  Vence: 07 Ene.
                </span>
              </div>
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
                S/ 108.55
              </span>
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
              <Droplets size={32} strokeWidth={1.5} />
            </div>

            <div className="flex flex-col">
              <span className="text-slate-400 text-sm font-medium">
                Agua Edificio
              </span>
              <span className="text-xl font-bold text-slate-900 leading-tight">
                S/ 153.30
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                  Vence: 24 de dic.
                </span>
              </div>
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
                Mi Cuota Total Agua
              </span>
              <span className="text-xl font-bold text-slate-900 leading-tight">
                S/ 25.81
              </span>
            </div>
          </div>

          <button className="text-slate-300 self-start mt-2">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-6">Recaudación por Piso</h3>
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
            <tr className="group hover:bg-slate-50/50 transition-colors">
              <td className="py-4 font-bold text-slate-700">Piso 1</td>
              <td className="py-4 text-slate-600">S/ 108.55</td>
              <td className="py-4 text-slate-600">S/ 25.81</td>
              <td className="py-4 font-bold text-slate-900">S/ 134.36</td>
              <td className="py-4 text-right">
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                  Pagado
                </span>
              </td>
            </tr>
            <tr className="group hover:bg-slate-50/50 transition-colors">
              <td className="py-4 font-bold text-slate-700">Piso 2</td>
              <td className="py-4 text-slate-600">S/ 90.55</td>
              <td className="py-4 text-slate-600">S/ 20.81</td>
              <td className="py-4 font-bold text-slate-900">S/ 111.36</td>
              <td className="py-4 text-right">
                <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
                  Pendiente
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <button className="text-purple-600 text-sm font-semibold hover:underline">
          Ver detalle completo
        </button>
      </div>
    </div>
  );
}
