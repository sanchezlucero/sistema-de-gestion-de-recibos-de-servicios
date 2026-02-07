import { toPng } from "html-to-image";
import { notify } from "../utils/notifications";

export function DetailModal({ isOpen, onClose, config, data, type, mode }) {
  console.log("data: ", data);
  if (!isOpen) return null;

  const FIELD_CONFIG = {
    luz: [
      { label: "Reposición", key: "reposicion" },
      { label: "Cargo Fijo", key: "cargo_fijo" },
      { label: "Int. Compensatorio", key: "interes_compensatorio" },
      { label: "Alumbrado", key: "alumbrado" },
      { label: "Aporte Ley N° 28749", key: "aporte_ley" },
      { label: "Mora", key: "mora" },
      { label: "Redondeo Mes Anterior", key: "redondeo_anterior" },
      { label: "Redondeo Mes Actual", key: "redondeo_actual" },
      { label: "Refacturación AP 2025-1", key: "refacturacion" },
      { label: "I.G.V. 18% Refact.", key: "igv_refact" },
    ],
    agua: [
      { label: "Cargo Fijo", key: "cargo_fijo" },
      { label: "Mora", key: "mora" },
      { label: "Redondeo Mes Anterior", key: "redondeo_anterior" },
      { label: "Redondeo Mes Actual", key: "redondeo_actual" },
    ],
  };
  const fieldsToShow = FIELD_CONFIG[type] || [];

  const serviceCalculators = {
    luz: (data, floors) => {
      if (!data) return null;
      const consumptionDelta =
        Number(data.consumo_actual || 0) - Number(data.consumo_pasado || 0);
      const kwhPriceWithTax = Number(data.consumo_kWh || 0) * 1.18;

      // Calculamos y redondeamos cada bloque a 2 decimales para que la suma sea exacta en pantalla
      const individualUsage = Number(
        (consumptionDelta * kwhPriceWithTax).toFixed(2),
      );

      const sharedKeys = [
        "reposicion",
        "cargo_fijo",
        "interes_compensatorio",
        "alumbrado",
        "aporte_ley",
        "mora",
        "redondeo_anterior",
        "redondeo_actual",
        "refacturacion",
        "igv_refact",
      ];
      const sharedTotalBuilding = sharedKeys.reduce(
        (acc, key) => acc + Number(data[key] || 0),
        0,
      );
      const sharedPerFloor = Number((sharedTotalBuilding / floors).toFixed(2));

      return {
        individual: individualUsage.toFixed(2),
        consumptionDelta: consumptionDelta.toFixed(2),
        shared: sharedPerFloor.toFixed(2),
        kwh_igv: kwhPriceWithTax.toFixed(4),
        total: (individualUsage + sharedPerFloor).toFixed(2),
      };
    },

    agua: (data, floors) => {
      if (!data) {
        return;
      }
      const consumptionDelta =
        Number(data.consumo_actual || 0) - Number(data.consumo_pasado || 0);

      const variableFactor =
        (Number(data.volumen_agua || 0) +
          Number(data.servicio_alcantarillado || 0)) /
        Number(data.consumo || 1);

      const individualNet = consumptionDelta * variableFactor;
      const individualUsage = individualNet * 1.18;

      const sharedKeys = [
        "cargo_fijo",
        "mora",
        "redondeo_anterior",
        "redondeo_actual",
      ];
      const sharedBase = sharedKeys.reduce(
        (acc, key) => acc + Number(data[key] || 0),
        0,
      );

      const sharedWithTax = sharedBase + Number(data.cargo_fijo || 0) * 0.18;
      const sharedSubtotal = sharedWithTax / floors;

      return {
        individual: individualUsage.toFixed(2),
        shared: sharedSubtotal.toFixed(2),
        unitPrice: (variableFactor * 1.18).toFixed(3), // <-- Envía esto a la imagen
        consumptionDelta: consumptionDelta.toFixed(2),
        total: (individualUsage + sharedSubtotal).toFixed(2),
      };
    },
  };
  const calculator = serviceCalculators[type];
  const results = calculator ? calculator(data, config.totalFloors) : null;
  const downloadImage = async () => {
    const node = document.getElementById("ticket-visual");
    if (!node) return;

    try {
      const dataUrl = await toPng(node, {
        backgroundColor: "#ffffff",
        cacheBust: true,
        skipFonts: false,
      });

      const link = document.createElement("a");
      link.download = `recibo-${type}-${mode}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.warn("Aviso en la descarga:", err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div
          id="ticket-visual"
          className="p-8 bg-white overflow-y-auto flex-1 custom-scrollbar"
        >
          {" "}
          <div className="text-center mb-6">
            <h2 className="text-slate-900 font-black uppercase text-lg">
              Mi Cuota de {type}
            </h2>
            <p className="text-slate-400 text-xs font-bold">
              PERIODO: {data?.month || data?.fecha}
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-purple-600 font-bold mb-2 uppercase tracking-tight">
              Gastos Compartidos (Total Edificio)
            </div>

            {fieldsToShow.map((field) => (
              <div key={field.key} className="flex justify-between text-[11px]">
                <span className="text-slate-500">{field.label}</span>
                <span className="text-slate-400">
                  S/ {Number(data?.[field?.key] ?? 0).toFixed(2)}{" "}
                </span>
              </div>
            ))}

            <div className="mt-3 p-2 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-purple-700 font-medium">
                  Tu cuota parte (Total / {config.totalFloors} pisos)
                </span>
                <span className="font-black text-purple-900">
                  S/ {results?.shared}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-dashed border-slate-200">
            <div className="text-[10px] text-blue-600 font-bold mb-2 uppercase tracking-tight">
              Tu Consumo Medido
            </div>
            <div className="flex justify-between text-xs">
              <div className="text-slate-500 text-[11px]">
                Lectura: {data?.consumo_actual} - {data?.consumo_pasado} ={" "}
                {results?.consumptionDelta}
                <br />
                {type === "luz" ? (
                  <>
                    Diferencia x S/ {data?.consumo_kWh} * 1.18 = S/{" "}
                    {(data?.consumo_kWh * 1.18).toFixed(3)}
                  </>
                ) : (
                  <>
                    Diferencia x S/ {results?.unitPrice} (Factor Agua/Alc. +
                    IGV)
                  </>
                )}
              </div>
              <span className="font-black text-slate-900 flex items-center">
                S/ {results?.individual}
              </span>
            </div>
          </div>
          <div className="border-t-2 border-slate-900 pt-4 mt-6 flex justify-between items-center">
            <div>
              <span className="font-black text-slate-900 block text-sm">
                CONSUMO INDIVIDUAL
              </span>
            </div>
            <span className="text-3xl font-black text-purple-600">
              S/ {results?.total}
            </span>
          </div>
        </div>
        <div className="p-4 bg-slate-50 flex gap-2">
          <button
            onClick={downloadImage}
            className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors"
          >
            Descargar Imagen
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 text-slate-500 font-bold text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
