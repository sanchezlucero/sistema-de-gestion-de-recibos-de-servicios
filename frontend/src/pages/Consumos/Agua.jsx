import { useContext, useEffect, useState } from "react";
import logo from "../../assets/images/logotipo-sedapal.png";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import InputRecibo from "../../componens/InputRecibo";
import { AGUA_DATA_DEFAULT } from "../../constants/aguaData";
import { ReceiptContext } from "../../context/ReceiptContext";
import FormGeneral from "../../componens/FormGeneral";
import FormFooter from "../../componens/FormFooter";
import { calculateServiceTotal, saveReceiptData } from "../../utils/functions";
import { useReceiptManager } from "../../hooks/useReceiptManager";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function Agua() {
  const {
    waterHistory,
    setWaterHistory,
    selectedPeriod,
    setSelectedPeriod,
    config,
  } = useContext(ReceiptContext);

  const { form, setForm, total, setTotal, handleChange } = useReceiptManager({
    initialData: AGUA_DATA_DEFAULT,
    history: waterHistory,
    selectedPeriod: selectedPeriod,
  });

  const calculateAgua = (datos) => {
    const total = calculateServiceTotal(datos, "agua", config);
    setTotal(total);
    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    saveReceiptData({
      form,
      storageKey: "recibosAgua",
      calculateFn: calculateAgua,
      requiredFields: [
        "fecha",
        "consumo_pasado",
        "consumo_actual",
        "importe_total",
        "consumo",
        "volumen_agua",
      ],
      setHistorial: setWaterHistory,
      setSelectedPeriod,
    });
  };

  const handleDataExtraction = (data) => {
    setForm((prev) => ({
      ...prev,
      consumo: data.consumo || data.consumo_m3 || "",
      volumen_agua: data.volumen_agua || data.importe_agua || "",
      servicio_alcantarillado: data.servicio_alcantarillado || "",
      cargo_fijo: data.cargo_fijo || "",
      igv: data.igv || "",
      mora: data.mora || "",
      redondeo_anterior: data.redondeo_anterior || "",
      redondeo_actual: data.redondeo_actual || "",
      importe_total: data.importe_total || "",
      fecha: data.fecha
        ? data.fecha.split("/").reverse().join("-")
        : prev.fecha,
    }));
  };

  return (
    <>
      <FormGeneral
        logo={logo}
        type="agua"
        onFileExtracted={handleDataExtraction}
      >
        <form action="" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
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
              isWarning={form.volumen_agua == 0}
              placeholder="0.00"
            />

            <InputRecibo
              label="Servicio de Alcantarillado"
              name="servicio_alcantarillado"
              value={form.servicio_alcantarillado}
              onChange={handleChange}
              isWarning={form.servicio_alcantarillado == 0}
              placeholder="0.00"
            />

            <InputRecibo
              label="Cargo fijo"
              name="cargo_fijo"
              value={form.cargo_fijo}
              onChange={handleChange}
              isWarning={form.cargo_fijo == 0}
              placeholder="0.00"
            />

            <InputRecibo
              label="I.G.V."
              name="igv"
              value={form.igv}
              onChange={handleChange}
              isWarning={form.igv == 0}
              placeholder="0.00"
            />

            <InputRecibo
              label="Mora"
              name="mora"
              value={form.mora}
              onChange={handleChange}
              isWarning={form.mora == 0}
              placeholder="0.00"
            />

            <InputRecibo
              label="Redondeo del Anterior"
              name="redondeo_anterior"
              value={form.redondeo_anterior}
              onChange={handleChange}
              isWarning={form.redondeo_anterior == 0}
              placeholder="0.00"
            />

            <InputRecibo
              label="Redondeo del Actual"
              name="redondeo_actual"
              value={form.redondeo_actual}
              onChange={handleChange}
              isWarning={form.redondeo_actual == 0}
              placeholder="0.00"
            />

            <InputRecibo
              label="Importe Total"
              name="importe_total"
              value={form.importe_total}
              onChange={handleChange}
              isWarning={form.importe_total == 0}
              placeholder="0.00"
            />

            <InputRecibo
              label="Fecha de Vencimiento"
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          <FormFooter totalAmount={total} />
        </form>
      </FormGeneral>
    </>
  );
}
