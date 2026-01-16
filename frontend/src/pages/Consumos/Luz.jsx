import { useContext, useEffect, useState } from "react";
import logo from "../../assets/images/pluz_logo_1.png";
import { LUZ_DATA_DEFAULT } from "../../constants/luzData";
import FileUploader from "../../componens/FileUploader";
import { ReciboContext } from "../../context/ReciboContext";
import InputRecibo from "../../componens/InputRecibo";
import { FileCheck } from "lucide-react";
import { notify } from "../../utils/notifications";

export default function Luz() {
  const {
    historialLuz,
    setHistorialLuz,
    periodoSeleccionado,
    setPeriodoSeleccionado,
    configuracion,
  } = useContext(ReciboContext);

  const [form, setForm] = useState(LUZ_DATA_DEFAULT);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (periodoSeleccionado === "nuevo") {
      const guardados = historialLuz || [];
      if (guardados.length > 0) {
        const ultimoRecibo = [...guardados].sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        )[0];

        setForm({
          ...LUZ_DATA_DEFAULT,
          consumo_pasado: ultimoRecibo.consumo_actual,
        });
      } else {
        setForm(LUZ_DATA_DEFAULT);
      }
      setTotal(0);
    } else {
      const encontrado = historialLuz.find((r) =>
        r.fecha.startsWith(periodoSeleccionado)
      );

      if (encontrado) {
        setForm(encontrado);
        setTotal(encontrado.total || 0);
      } else {
        setForm({
          ...LUZ_DATA_DEFAULT,
          fecha: `${periodoSeleccionado}-01`,
        });
        setTotal(0);
      }
    }
  }, [periodoSeleccionado, historialLuz]);

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
      mora: toFloat(datos.mora),
      redondeo_anterior: toFloat(datos.redondeo_anterior),
      redondeo_actual: toFloat(datos.redondeo_actual),
      consumo_kWh: toFloat(datos.consumo_kWh),
    };

    const division_pisos =
      (parsedDatos.reposicion +
        parsedDatos.cargo_fijo +
        parsedDatos.interes_compensatorio +
        parsedDatos.alumbrado +
        parsedDatos.igv +
        parsedDatos.aporte_ley +
        parsedDatos.mora +
        parsedDatos.redondeo_anterior +
        parsedDatos.redondeo_actual) /
        configuracion?.totalPisos || 5;
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

    const {
      fecha,
      consumo_pasado,
      consumo_actual,
      importe_total,
      consumo_kWh,
    } = form;

    if (
      !fecha ||
      !consumo_pasado ||
      !consumo_actual ||
      !importe_total ||
      !consumo_kWh
    ) {
      return notify.warn("Ingresar campos obligatorios");
    }

    // Optional: Check if consumption is logical (current should be higher than past)
    if (Number(consumo_actual) < Number(consumo_pasado)) {
      return notify.error(
        "El consumo actual no puede ser inferior al consumo anteriorior"
      );
    }
    const periodoNuevo = form.fecha.substring(0, 7);

    const recibosActuales =
      JSON.parse(localStorage.getItem("recibosLuz")) || [];

    const indexExistente = recibosActuales.findIndex(
      (r) => r.fecha.substring(0, 7) === periodoNuevo
    );

    const nuevoRecibo = {
      ...form,
      id:
        indexExistente !== -1
          ? recibosActuales[indexExistente].id
          : crypto.randomUUID(),
      total: calculateLuz(form),
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
    localStorage.setItem("recibosLuz", JSON.stringify(nuevaLista));
    setHistorialLuz(nuevaLista);
    setPeriodoSeleccionado(periodoNuevo);

    notify.success(
      indexExistente !== -1
        ? "Recibo actualizado correctamente"
        : "Recibo guardado correctamente"
    );
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <img src={logo} alt="cargando logo sedapal" className="w-32" />
        <div className="text-right">
          <h1 className="text-xl font-bold text-slate-800">
            Cálculo de Recibo de Luz
          </h1>
          <p className="text-sm text-slate-500">
            Sube tu PDF para autocompletar
          </p>
        </div>
      </div>
      <FileUploader
        type="luz"
        onDataExtracted={(data) => {
          // Usamos la versión de función de setForm para acceder al estado anterior (prev)
          setForm((prev) => ({
            ...prev, // Mantenemos lo que ya existe (como el consumo_pasado sugerido)
            consumo_kWh: data.consumo_kWh || data.consumo_kWh || 0,
            cargo_fijo: data.cargo_fijo || 0,
            alumbrado: data.alumbrado || 0,
            interes_compensatorio: data.interes_compensatorio || 0,
            igv: data.igv || 0,
            mora: data.mora || 0,
            reposicion: data.reposicion || 0,
            aporte_ley: data.aporte_ley || 0,
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
            <InputRecibo
              label="Consumo mes pasado"
              name="consumo_pasado"
              value={form.consumo_pasado}
              onChange={handleChange}
              isWarning={form.consumo_pasado == 0}
            />
            <InputRecibo
              label="Consumo mes actual"
              name="consumo_actual"
              value={form.consumo_actual}
              onChange={handleChange}
              isWarning={form.consumo_actual == 0}
            />

            <InputRecibo
              label="Consumo KWh"
              name="consumo_kWh"
              value={form.consumo_kWh}
              onChange={handleChange}
              isWarning={form.consumo_kWh == 0}
            />
            <InputRecibo
              label="Reposic. y Mant. de Conex"
              name="reposicion"
              value={form.reposicion}
              onChange={handleChange}
              isWarning={form.reposicion == 0}
            />

            <InputRecibo
              label="Cargo Fijo"
              name="cargo_fijo"
              value={form.cargo_fijo}
              onChange={handleChange}
              isWarning={form.cargo_fijo == 0}
            />

            <InputRecibo
              label="Interés Compensatorio"
              name="interes_compensatorio"
              value={form.interes_compensatorio}
              onChange={handleChange}
              isWarning={form.interes_compensatorio == 0}
            />

            <InputRecibo
              label="Alumbrado Público"
              name="alumbrado"
              value={form.alumbrado}
              onChange={handleChange}
              isWarning={form.alumbrado == 0}
            />

            <InputRecibo
              label="IGV"
              name="igv"
              value={form.igv}
              onChange={handleChange}
              isWarning={form.igv == 0}
            />

            <InputRecibo
              label="Aporte Ley N°28749"
              name="aporte_ley"
              value={form.aporte_ley}
              onChange={handleChange}
              isWarning={form.aporte_ley == 0}
            />

            <InputRecibo
              label="Mora"
              name="mora"
              value={form.mora}
              onChange={handleChange}
              isWarning={form.mora == 0}
            />

            <InputRecibo
              label="Redondeo del mes anterior"
              name="redondeo_anterior"
              value={form.redondeo_anterior}
              onChange={handleChange}
              isWarning={form.redondeo_anterior == 0}
            />

            <InputRecibo
              label="Redondeo del mes actual"
              name="redondeo_actual"
              value={form.redondeo_actual}
              onChange={handleChange}
              isWarning={form.redondeo_actual == 0}
            />

            <InputRecibo
              label="Fecha de vencimiento"
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              isWarning={form.fecha == 0}
            />

            <InputRecibo
              label="Importe total"
              name="importe_total"
              value={form.importe_total}
              onChange={handleChange}
              isWarning={form.importe_total == 0}
            />
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
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition-colors"
            >
              <FileCheck size={18} />
              Guardar recibo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
