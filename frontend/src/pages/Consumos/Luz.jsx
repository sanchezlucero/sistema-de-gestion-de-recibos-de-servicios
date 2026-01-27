import { useContext, useEffect, useState } from "react";
import logo from "../../assets/images/pluz_logo_1.png";
import { LUZ_DATA_DEFAULT } from "../../constants/luzData";
import { ReceiptContext } from "../../context/ReceiptContext";
import InputRecibo from "../../componens/InputRecibo";
import { FileCheck } from "lucide-react";
import { notify } from "../../utils/notifications";
import FormGeneral from "../../componens/FormGeneral";
import FormFooter from "../../componens/FormFooter";
import { saveReceiptData } from "../../utils/functions";
import { useReceiptManager } from "../../hooks/useReceiptManager";

export default function Luz() {
  const {
    lightHistory,
    setLightHistory,
    selectedPeriod,
    setSelectedPeriod,
    config,
  } = useContext(ReceiptContext);

  const { form, setForm, total, setTotal, handleChange } = useReceiptManager({
    initialData: LUZ_DATA_DEFAULT,
    history: lightHistory,
    selectedPeriod: selectedPeriod,
  });

  const calculateLuz = (datos) => {
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
    console.log("config")
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
      config?.totalFloors;
    const subtotal =
      (parsedDatos.consumo_actual - parsedDatos.consumo_pasado) *
      parsedDatos.consumo_kWh;
    console.log("subtotal: ", subtotal);
    console.log("division_pisos: ", division_pisos);
    const total = (subtotal + division_pisos).toFixed(2);
    console.log("total: ", total);
    setTotal(total);
    console.log(":total", total);
    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    saveReceiptData({
      form,
      storageKey: "recibosLuz",
      calculateFn: calculateLuz,
      requiredFields: [
        "fecha",
        "consumo_pasado",
        "consumo_actual",
        "importe_total",
        "consumo_kWh",
      ],
      setHistorial: setLightHistory,
      setSelectedPeriod,
    });
  };

  const handleDataExtraction = (data) => {
    setForm((prev) => ({
      ...prev,
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
      redondeo_actual: data.redondeo_actual || data.redondeo_mes_actual || 0,
      importe_total: data.importe_total || 0,
      fecha: data.fecha
        ? data.fecha.split("/").reverse().join("-")
        : prev.fecha,
    }));
  };
  return (
    <>
      <FormGeneral
        logo={logo}
        type="luz"
        onFileExtracted={handleDataExtraction}
      >
        {" "}
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
          <FormFooter totalAmount={total} />
        </form>
      </FormGeneral>
    </>
  );
}
