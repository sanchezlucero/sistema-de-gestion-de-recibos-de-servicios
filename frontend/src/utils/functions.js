import { notify } from "./notifications";

export const saveReceiptData = ({
  form,
  storageKey,
  calculateFn,
  requiredFields = [],
  setHistorial,
  setSelectedPeriod,
}) => {
  const missingFields = requiredFields.filter(
    (field) => !form[field] || form[field] === 0,
  );

  if (missingFields.length > 0) {
    notify.warn("Por favor, ingresa todos los campos obligatorios.");
    return false;
  }

  if (form.consumo_actual && form.consumo_pasado) {
    if (Number(form.consumo_actual) < Number(form.consumo_pasado)) {
      notify.error("El consumo actual no puede ser inferior al anterior.");
      return false;
    }
  }

  try {
    const newPeriod = form.fecha.substring(0, 7);
    const currentReceipts = JSON.parse(localStorage.getItem(storageKey)) || [];

    const existingIndex = currentReceipts.findIndex(
      (item) => item.fecha.substring(0, 7) === newPeriod,
    );

    const newReceipt = {
      ...form,
      id:
        existingIndex !== -1
          ? currentReceipts[existingIndex].id
          : crypto.randomUUID(),
      total: calculateFn(form),
    };

    let updatedList;
    if (existingIndex !== -1) {
      updatedList = [...currentReceipts];
      updatedList[existingIndex] = newReceipt;
    } else {
      updatedList = [...currentReceipts, newReceipt];
    }

    localStorage.setItem(storageKey, JSON.stringify(updatedList));

    setHistorial(updatedList);
    setSelectedPeriod(newPeriod);

    notify.success(
      existingIndex !== -1
        ? "Recibo actualizado correctamente"
        : "Recibo guardado correctamente",
    );

    return true;
  } catch (error) {
    console.error("Error saving receipt:", error);
    notify.error("Ocurrió un error al guardar.");
    return false;
  }
};

export const formatPhoneForWhatsApp = (phoneNumber) => {
  if (!phoneNumber) return "";
  return phoneNumber.replace(/\D/g, "");
};

export const calculateServiceTotal = (data, type, config) => {
  const toFloat = (v) => (v === "" || v === undefined ? 0 : parseFloat(v));

  // Convertimos a objeto con números
  const d = Object.keys(data).reduce((acc, key) => {
    acc[key] = toFloat(data[key]);
    return acc;
  }, {});
  const floorCount = config?.totalFloors || 1;
  const consumption = d.consumo_actual - d.consumo_pasado;

if (type === "luz") {
  const kwhPriceWithTax = d.consumo_kWh * 1.18;
  const individualPower = Number((consumption * kwhPriceWithTax).toFixed(2));
  
  const sharedSum = (d.reposicion + d.cargo_fijo + d.interes_compensatorio + d.alumbrado + d.aporte_ley + d.refacturacion + d.igv_refact + d.mora + d.redondeo_anterior + d.redondeo_actual);
  const sharedTotal = Number((sharedSum / floorCount).toFixed(2));

  return (individualPower + sharedTotal).toFixed(2);
}

  if (type === "agua") {
    // 1. Calculate the cost per cubic meter (Water + Sewerage)
    const costPerUnit =
      (d.volumen_agua + d.servicio_alcantarillado) / (d.consumo || 1);
    const individualNet = consumption * costPerUnit;
    const individualTax = individualNet * 0.18;
    const individualTotal = individualNet + individualTax;

    const sharedBase =
      d.cargo_fijo + d.mora + d.redondeo_anterior + d.redondeo_actual;
    const sharedTax = d.cargo_fijo * 0.18;
    const sharedTotal = (sharedBase + sharedTax) / floorCount;
    return (individualTotal + sharedTotal).toFixed(2);
  }

  return "0.00";
};
