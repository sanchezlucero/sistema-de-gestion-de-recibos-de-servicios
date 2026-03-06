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
  console.log("data ", data);
  const floorCount = config?.totalFloors || 5;
  const toFloat = (v) => (v === "" || v === undefined ? 0 : parseFloat(v));

  // Convertimos todo el objeto a números de una vez
  const d = Object.keys(data).reduce((acc, key) => {
    acc[key] = toFloat(data[key]);
    return acc;
  }, {});
  console.log(d);
  const consumptionDelta = d.consumo_actual - d.consumo_pasado;

  if (type === "luz") {
    const individualUsage = d.consumo_kWh * consumptionDelta;

    const sharedKeys = [
      "reposicion",
      "cargo_fijo",
      "interes_compensatorio",
      "alumbrado",
      "igv",
      "aporte_ley",
      "mora",
      "redondeo_anterior",
      "redondeo_actual",
      "refacturacion",
      "igv_refact",
    ];

    const sharedTotalBuilding = sharedKeys.reduce(
      (acc, key) => acc + (d[key] || 0),
      0,
    );
    const sharedPerFloor = Number(
      (sharedTotalBuilding / floorCount).toFixed(2),
    );
    const total = (individualUsage + sharedPerFloor).toFixed(2);

    return {
      individual: individualUsage.toFixed(2),
      shared: sharedPerFloor.toFixed(2),
      consumptionDelta: consumptionDelta.toFixed(2),
      total: total,
    };
  }

  if (type === "agua") {
    // Respetando tu lógica original:
    // 1. Solo el Volumen de Agua es variable por m3
    const mult = d.volumen_agua / d.consumo;
    console.log("mult ", mult);
    const sub = consumptionDelta * mult;
    console.log("sub ", sub);

    // 2. El Alcantarillado y todo lo demás va a la suma compartida (/5)
    const sharedSum =
      d.servicio_alcantarillado +
      d.cargo_fijo +
      d.igv +
      d.mora +
      d.redondeo_anterior +
      d.redondeo_actual;

    const div_sharedSum = sharedSum / floorCount;
    const totalValue = sub + div_sharedSum;

    // Retornamos el objeto con los nombres de variables en inglés
    return {
      individual: sub.toFixed(2),
      shared: div_sharedSum.toFixed(2),
      unitPrice: mult.toFixed(2),
      consumptionDelta: consumptionDelta.toFixed(2),
      total: totalValue.toFixed(2),
    };
  }
  return { total: "0.00" };
};
