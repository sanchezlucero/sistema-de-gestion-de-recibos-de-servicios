import { useState } from "react";
import logo from "../../assets/images/logotipo-sedapal.png";

export default function Agua() {
  const [form, setForm] = useState({
    consumo_pasado: "",
    consumo_actual: "",
    volumen_agua: "",
    consumo: "",
    servicio_alcantarillado: "",
    cargo_fijo: "",
    igv: "",
    mora: "",
    redondedo_anterior: "",
    redondeo_actual: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", form);
  };
  return (
    <div className="bg-white mx-4 p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-4">Registro de Agua</h2>

      <div>
        <div className="logo-agua">
          <img src={logo} alt="cargando logo sedapal" className="w-32" />
        </div>
        <div>
          <form action="" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
              <div>
                <label className="block text-sm font-medium text-slate-700 text-left">
                  Consumo (m³) mes pasado
                </label>
                <input
                  type="text"
                  name="codigo"
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
                  name="consumo"
                  value={form.servicio_alcantarillado}
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
                  name="consumo"
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
                  name="consumo"
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
                  name="consumo"
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
                  name="consumo"
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
                  name="consumo"
                  value={form.redondeo_actual}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: 0.01"
                />
              </div>
            </div>

            {/* Botón */}
            <div className="text-right  my-4">
              <button
                type="submit"
                className="w-50 rounded-md bg-purple-600 py-2 text-white text-sm
                   hover:bg-purple-700 transition "
              >
                Guardar registro
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
