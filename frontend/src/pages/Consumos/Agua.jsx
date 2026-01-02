import { useEffect, useState } from "react";
import logo from "../../assets/images/logotipo-sedapal.png";

export default function Agua() {
  const [form, setForm] = useState({
    consumo_pasado: 0,
    consumo_actual: 0,
    volumen_agua: 0,
    consumo: 0,
    servicio_alcantarillado: 0,
    cargo_fijo: 0,
    igv: 0,
    mora: 0,
    redondedo_anterior: 0,
    redondeo_actual: 0,
    fecha: "",
    importe_total: "",
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const recibos = JSON.parse(localStorage.getItem("recibosAgua")) || [];

    if (recibos.length === 0) return;

    const ultimoRecibo = recibos.at(-1);
    if (!ultimoRecibo?.consumo_actual) return;

    setForm((prev) => ({
      ...prev,
      consumo_pasado: ultimoRecibo.consumo_pasado,
      consumo_actual: ultimoRecibo.consumo_actual,

      volumen_agua: ultimoRecibo.volumen_agua,
      consumo: ultimoRecibo.consumo,
      servicio_alcantarillado: ultimoRecibo.servicio_alcantarillado,
      cargo_fijo: ultimoRecibo.cargo_fijo,
      igv: ultimoRecibo.igv,
      mora: ultimoRecibo.mora,
      redondedo_anterior: ultimoRecibo.redondedo_anterior,
      redondeo_actual: ultimoRecibo.redondeo_actual,
      fecha: ultimoRecibo.fecha,
    }));
    setTotal(ultimoRecibo.total)
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const calculateAgua = (datos) => {
    console.log("llega datos : ", datos);

    const toFloat = (v) => (v === "" ? 0 : parseFloat(v));
    const parsedDatos = {
      consumo_pasado: toFloat(datos.consumo_pasado),
      consumo_actual: toFloat(datos.consumo_actual),
      consumo: toFloat(datos.consumo),
      volumen_agua: toFloat(datos.volumen_agua),
      servicio_alcantarillado: toFloat(datos.servicio_alcantarillado),
      cargo_fijo: toFloat(datos.cargo_fijo),
      igv: toFloat(datos.igv),
      mora: toFloat(datos.mora),
      redondedo_anterior: toFloat(datos.redondedo_anterior),
      redondeo_actual: toFloat(datos.redondeo_actual),
    };

    console.log("conversion  ", parsedDatos);
    const numero_inquilinos =
      JSON.parse(localStorage.getItem("inquilinos")) || 5;

    const division_pisos =
      (parsedDatos.servicio_alcantarillado +
        parsedDatos.cargo_fijo +
        parsedDatos.igv +
        parsedDatos.mora +
        parsedDatos.redondedo_anterior -
        parsedDatos.redondeo_actual) /
      numero_inquilinos;
    console.log("division_pisos: ", division_pisos);
    const subtotal =
      (parsedDatos.consumo_actual - parsedDatos.consumo_pasado) *
      (parsedDatos.volumen_agua / parsedDatos.consumo);
    console.log("subtotal: ", subtotal);
    const total = subtotal + division_pisos;
    setTotal(total);
    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", form);
    const recibos = JSON.parse(localStorage.getItem("recibosAgua")) || [];
    const nuevoRecibo = {
      ...form,
      id: crypto.randomUUID,
      total: calculateAgua(form),
      mes: Number(form.fecha.split("-")[1]),
    };
    console.log("nuevoRecibo: ", nuevoRecibo);
    recibos.push(nuevoRecibo);
    const json = JSON.stringify(recibos);
    localStorage.setItem("recibosAgua", json);
  };
  return (
    <div>
      <div className="bg-white mx-4 p-4 rounded-lg shadow">
        <div>
          <div className="logo-agua">
            <img src={logo} alt="cargando logo sedapal" className="w-32" />
          </div>
          <div className="py-2">
            <form action="" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                <div>
                  <label className="block text-sm font-medium text-slate-700 text-left">
                    Consumo (m³) mes pasado
                  </label>
                  <input
                    type="number"
                    name="consumo_pasado"
                    value={form.consumo_pasado}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: 50.50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 text-left">
                    Consumo (m³) mes actual
                  </label>
                  <input
                    type="number"
                    name="consumo_actual"
                    value={form.consumo_actual}
                    onChange={handleChange}
                    placeholder="Ej: 60.50"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 text-left">
                    Consumo (m³)
                  </label>
                  <input
                    type="number"
                    name="consumo"
                    value={form.consumo}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: 25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 text-left">
                    Servicio de alcantarillado
                  </label>
                  <input
                    type="number"
                    name="servicio_alcantarillado"
                    value={form.servicio_alcantarillado}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: 30.50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 text-left">
                    Volumen de Agua potable
                  </label>
                  <input
                    type="number"
                    name="volumen_agua"
                    value={form.volumen_agua}
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
                    placeholder="Ej: 2.50"
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
                    Mora
                  </label>
                  <input
                    type="number"
                    name="mora"
                    value={form.mora}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: 0.20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 text-left">
                    Redondeo del mes anterior
                  </label>
                  <input
                    type="number"
                    name="redondedo_anterior"
                    value={form.redondedo_anterior}
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
                    S/ {total.toFixed(2)}
                  </p>
                </div>

                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-sm font-medium"
                >
                  Guardar recibo
                </button>
              </div>

              {/* <div className="text-right  my-4">
                <button
                  type="submit"
                  className="w-50 rounded-md bg-purple-600 py-2 text-white text-sm
                   hover:bg-purple-700 transition "
                >
                  Guardar registro
                </button>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
