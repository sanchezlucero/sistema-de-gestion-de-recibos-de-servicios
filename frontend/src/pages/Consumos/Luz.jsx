import { useEffect, useState } from "react";
import logo from "../../assets/images/pluz_logo_1.png";

export default function Luz() {
  const [form, setForm] = useState({
    consumo_pasado: "",
    consumo_actual: "",
    reposicion: "",
    cargo_fijo: "",
    interes_compensatorio: "",
    alumbrado: "",
    igv: "",
    aporte_ley: "",
    redondeo_anterior: "",
    redondeo_actual: "",
    fecha: "",
    importe_total: "",
    consumo_kWh: "",
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const recibos = JSON.parse(localStorage.getItem("recibosLuz")) || [];

    if (recibos.length === 0) return;

    const ultimoRecibo = recibos.at(-1);
    if (!ultimoRecibo?.consumo_actual) return;
    console.log("ultimoRecibo: ", ultimoRecibo);
    setForm((prev) => ({
      ...prev,
      consumo_pasado: ultimoRecibo.consumo_pasado,
      consumo_actual: ultimoRecibo.consumo_actual,
      reposicion: ultimoRecibo.reposicion,
      cargo_fijo: ultimoRecibo.cargo_fijo,
      interes_compensatorio: ultimoRecibo.interes_compensatorio,
      alumbrado: ultimoRecibo.alumbrado,
      igv: ultimoRecibo.igv,
      aporte_ley: ultimoRecibo.aporte_ley,
      redondeo_anterior: ultimoRecibo.redondeo_anterior,
      redondeo_actual: ultimoRecibo.redondeo_actual,
      fecha: ultimoRecibo.fecha,
      importe_total: ultimoRecibo.importe_total,
      consumo_kWh: ultimoRecibo.consumo_kWh,
    }));
    setTotal(ultimoRecibo.total);
  }, []);

  const calculateLuz = (datos) => {
    console.log("llega datos : ", datos);

    const toFloat = (v) => (v === "" ? 0 : parseFloat(v));
    const parsedDatos = {
      consumo_pasado: toFloat(datos.consumo_pasado),
      consumo_actual: toFloat(datos.consumo_actual),
      reposicion: toFloat(datos.reposicion),
      cargo_fijo: toFloat(datos.cargo_fijo),
      interes_compensatorio: toFloat(datos.interes_compensatorio),
      alumbrado: toFloat(datos.alumbrado),
      igv: toFloat(datos.igv),
      aporte_ley: toFloat(datos.aporte_ley),
      redondeo_anterior: toFloat(datos.redondeo_anterior),
      redondeo_actual: toFloat(datos.redondeo_actual),
      consumo_kWh: toFloat(datos.consumo_kWh),
    };

    console.log("conversion  ", parsedDatos);
    const numero_inquilinos =
      JSON.parse(localStorage.getItem("inquilinos")) || 5;

    const division_pisos =
      (parsedDatos.reposicion +
        parsedDatos.cargo_fijo +
        parsedDatos.interes_compensatorio +
        parsedDatos.alumbrado +
        parsedDatos.igv +
        parsedDatos.aporte_ley +
        parsedDatos.redondeo_anterior -
        parsedDatos.redondeo_actual) /
      numero_inquilinos;
    console.log("division_pisos: ", division_pisos);
    const subtotal =
      (parsedDatos.consumo_actual - parsedDatos.consumo_pasado) *
      parsedDatos.consumo_kWh;
    console.log("subtotal: ", subtotal);
    const total = subtotal + division_pisos;
    setTotal(total);
    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", form);
    const recibos = JSON.parse(localStorage.getItem("recibosLuz")) || [];
    const nuevoRecibo = {
      ...form,
      id: crypto.randomUUID,
      total: calculateLuz(form),
      mes: Number(form.fecha.split("-")[1]),
    };
    console.log("nuevoRecibo: ", nuevoRecibo);
    recibos.push(nuevoRecibo);
    const json = JSON.stringify(recibos);
    localStorage.setItem("recibosLuz", json);
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
      <div className="flex items-center gap-4 mb-8">
        <img src={logo} alt="cargando logo sedapal" className="w-32" />
      </div>
      <div className="py-2">
        <form action="" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
            <div>
              <label className="block text-sm font-medium text-slate-700 text-left">
                Consumo mes pasado
              </label>
              <input
                type="number"
                name="consumo_pasado"
                value={form.consumo_pasado}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: 150.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 text-left">
                Consumo mes actual
              </label>
              <input
                type="number"
                name="consumo_actual"
                value={form.consumo_actual}
                onChange={handleChange}
                placeholder="Ej: 160.5"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 text-left">
                Consumo KWh
              </label>
              <input
                type="number"
                name="consumo_kWh"
                value={form.consumo_kWh}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: 0.6123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 text-left">
                Reposic. y Mant. de Conex{" "}
              </label>
              <input
                type="number"
                name="reposicion"
                value={form.reposicion}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: 30.50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 text-left">
                Cargo Fijo
              </label>
              <input
                type="number"
                name="cargo_fijo"
                value={form.cargo_fijo}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: 30.50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 text-left">
                Interés Compensatorio{" "}
              </label>
              <input
                type="number"
                name="interes_compensatorio"
                value={form.interes_compensatorio}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: 2.50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 text-left">
                Alumbrado Público
              </label>
              <input
                type="number"
                name="alumbrado"
                value={form.alumbrado}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: 0.20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 text-left">
                IGV{" "}
              </label>
              <input
                type="number"
                name="igv"
                value={form.igv}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: 25.40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 text-left">
                Aporte Ley N°28749
              </label>
              <input
                type="number"
                name="aporte_ley"
                value={form.aporte_ley}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: 0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 text-left">
                Redondeo del mes anterior
              </label>
              <input
                type="number"
                name="redondeo_anterior"
                value={form.redondeo_anterior}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: 0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 text-left">
                Redondeo del mes actual
              </label>
              <input
                type="number"
                name="redondeo_actual"
                value={form.redondeo_actual}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: 0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 text-left">
                Fecha de vencimiento{" "}
              </label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: 0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 text-left">
                Importe total{" "}
              </label>
              <input
                type="number"
                name="importe_total"
                value={form.importe_total}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: 150.00"
              />
            </div>
          </div>

          <div className="mt-8 rounded-xl  border border-purple-200 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total a pagar</p>
              <p className="text-3xl font-bold text-purple-700">
                S/ {total?.toFixed(2)}
              </p>
            </div>

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-sm font-medium"
            >
              Guardar recibo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
