import { useContext, useEffect, useState } from "react";
import logo from "../../assets/images/logotipo-sedapal.png";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import InputRecibo from "../../componens/InputRecibo";
import { AGUA_DATA_DEFAULT } from "../../constants/aguaData";
import { ReciboContext } from "../../context/ReciboContext";
import FileUploader from "../../componens/FileUploader";
import { FileCheck } from "lucide-react";
import { notify } from "../../utils/notifications";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function Agua() {
  const {
    historialAgua,
    setHistorialAgua,
    periodoSeleccionado,
    setPeriodoSeleccionado,
    configuracion,
  } = useContext(ReciboContext);
  const [form, setForm] = useState(AGUA_DATA_DEFAULT);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (periodoSeleccionado === "nuevo") {
      const guardados = historialAgua || [];
      if (guardados.length > 0) {
        const ultimoRecibo = [...guardados].sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        )[0];

        setForm({
          ...AGUA_DATA_DEFAULT,
          consumo_pasado: ultimoRecibo.consumo_actual,
        });
      } else {
        setForm(AGUA_DATA_DEFAULT);
      }
      setTotal(0);
    } else {
      const encontrado = historialAgua.find((r) =>
        r.fecha.startsWith(periodoSeleccionado)
      );

      if (encontrado) {
        setForm(encontrado);
        setTotal(encontrado.total || 0);
      } else {
        setForm({
          ...AGUA_DATA_DEFAULT,
          fecha: `${periodoSeleccionado}-01`,
        });
        setTotal(0);
      }
    }
  }, [periodoSeleccionado, historialAgua]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const calculateAgua = (datos) => {
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
      redondeo_anterior: toFloat(datos.redondeo_anterior),
      redondeo_actual: toFloat(datos.redondeo_actual),
    };
    console.log("parsedDatos: ", parsedDatos);
    console.log("configuracion: ", configuracion);
    const division_pisos =
      (parsedDatos.servicio_alcantarillado +
        parsedDatos.cargo_fijo +
        parsedDatos.igv +
        parsedDatos.mora +
        parsedDatos.redondeo_anterior +
        parsedDatos.redondeo_actual) /
        configuracion?.totalPisos || 5;
    console.log("division_pisos: ", division_pisos);
    const subtotal =
      (parsedDatos.consumo_actual - parsedDatos.consumo_pasado) *
      (parsedDatos.volumen_agua / parsedDatos.consumo);
    console.log("subtotal: ", subtotal);
    const total = subtotal + division_pisos;
    console.log("total: ", total);
    setTotal(total);
    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const periodoNuevo = form.fecha.substring(0, 7);

      const recibosActuales =
        JSON.parse(localStorage.getItem("recibosAgua")) || [];

      const indexExistente = recibosActuales.findIndex(
        (r) => r.fecha.substring(0, 7) === periodoNuevo
      );

      const nuevoRecibo = {
        ...form,
        id:
          indexExistente !== -1
            ? recibosActuales[indexExistente].id
            : crypto.randomUUID(),
        total: calculateAgua(form),
      };

      let nuevaLista;

      if (indexExistente !== -1) {
        nuevaLista = [...recibosActuales];
        nuevaLista[indexExistente] = nuevoRecibo;
        console.log(
          "Mes duplicado detectado: Se actualizó el registro existente."
        );
      } else {
        nuevaLista = [...recibosActuales, nuevoRecibo];
        console.log("Nuevo mes registrado.");
      }

      localStorage.setItem("recibosAgua", JSON.stringify(nuevaLista));

      setHistorialAgua(nuevaLista);
      setPeriodoSeleccionado(periodoNuevo);

      notify.success(
        indexExistente !== -1
          ? "Recibo actualizado correctamente"
          : "Recibo guardado correctamente"
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <img src={logo} alt="cargando logo sedapal" className="w-32" />
        <div className="text-right">
          <h1 className="text-xl font-bold text-slate-800">
            Cálculo de Recibo de Agua
          </h1>
          <p className="text-sm text-slate-500">
            Sube tu PDF para autocompletar
          </p>
        </div>
      </div>
      <FileUploader
        type="agua"
        onDataExtracted={(data) => {
          // Usamos la versión de función de setForm para acceder al estado anterior (prev)
          setForm((prev) => ({
            ...prev, // Mantenemos lo que ya existe (como el consumo_pasado sugerido)
            consumo: data.consumo || data.consumo_m3 || 0,
            volumen_agua: data.volumen_agua || data.importe_agua || 0,
            servicio_alcantarillado: data.servicio_alcantarillado || 0,
            cargo_fijo: data.cargo_fijo || 0,
            igv: data.igv || 0,
            mora: data.mora || 0,
            redondeo_anterior:
              data.redondeo_anterior || data.redondeo_mes_anterior || 0,
            redondeo_actual:
              data.redondeo_actual || data.redondeo_mes_actual || 0,
            importe_total: data.importe_total || 0,
            fecha: data.fecha
              ? data.fecha.split("/").reverse().join("-")
              : prev.fecha,
          }));
        }}
      />
      <div className="py-2">
        <form action="" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
            <InputRecibo
              label="Consumo mes pasado"
              name="consumo_pasado"
              value={form.consumo_pasado}
              onChange={handleChange}
              placeholder="0.00"
            />

            <InputRecibo
              label="Consumo mes actual"
              name="consumo_actual"
              value={form.consumo_actual}
              onChange={handleChange}
              placeholder="0.00"
            />
            <InputRecibo
              label="Consumo"
              name="consumo"
              value={form.consumo}
              onChange={handleChange}
              placeholder="0.00"
            />

            <InputRecibo
              label="Volumen de agua potable"
              name="volumen_agua"
              value={form.volumen_agua}
              onChange={handleChange}
              isWarning={form.volumen_agua == 0} // <--- ¡Lógica automática!
            />

            <InputRecibo
              label="Servicio de Alcantarillado"
              name="servicio_alcantarillado"
              value={form.servicio_alcantarillado}
              onChange={handleChange}
              isWarning={form.servicio_alcantarillado == 0} // <--- ¡Lógica automática!
            />

            <InputRecibo
              label="Cargo fijo"
              name="cargo_fijo"
              value={form.cargo_fijo}
              onChange={handleChange}
              isWarning={form.cargo_fijo == 0} // <--- ¡Lógica automática!
            />

            <InputRecibo
              label="I.G.V."
              name="igv"
              value={form.igv}
              onChange={handleChange}
              isWarning={form.igv == 0} // <--- ¡Lógica automática!
            />

            <InputRecibo
              label="Mora"
              name="mora"
              value={form.mora}
              onChange={handleChange}
              isWarning={form.mora == 0} // <--- ¡Lógica automática!
            />

            <InputRecibo
              label="Redondeo del Anterior"
              name="redondeo_anterior"
              value={form.redondeo_anterior}
              onChange={handleChange}
              isWarning={form.redondeo_anterior == 0}
            />

            <InputRecibo
              label="Redondeo del Actual"
              name="redondeo_actual"
              value={form.redondeo_actual}
              onChange={handleChange}
              isWarning={form.redondeo_actual == 0}
            />

            <InputRecibo
              label="Importe Total"
              name="importe_total"
              value={form.importe_total}
              onChange={handleChange}
              isWarning={form.importe_total == 0}
            />

            <InputRecibo
              label="Fecha de Vencimiento"
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
            />
          </div>

          <div className="mt-8 rounded-xl border border-purple-200 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total a pagar</p>
              <p className="text-3xl font-bold text-purple-700">
                S/ {total.toFixed(2)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition-colors"
              >
                <FileCheck size={18} />
                Guardar recibo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
