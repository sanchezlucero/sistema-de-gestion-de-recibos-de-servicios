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
