import { useState, useEffect } from "react";

export const useReceiptManager = ({ initialData, history, selectedPeriod }) => {
  const [form, setForm] = useState(initialData);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (selectedPeriod === "nuevo") {
      const records = history || [];

      if (records.length > 0) {
        const lastReceipt = [...records].sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha),
        )[0];

        setForm({
          ...initialData,
          consumo_pasado: lastReceipt.consumo_actual || 0,
        });
      } else {
        setForm(initialData);
      }
      setTotal(0);
    } else {
      const existingRecord = history.find((record) =>
        record.fecha.startsWith(selectedPeriod),
      );

      if (existingRecord) {
        setForm(existingRecord);
        setTotal(existingRecord.total || 0);
      } else {
        setForm({
          ...initialData,
          fecha: `${selectedPeriod}-01`,
        });
        setTotal(0);
      }
    }
  }, [selectedPeriod, history, initialData]);

  return {
    form,
    setForm,
    total,
    setTotal,
    handleChange: (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
  };
};
