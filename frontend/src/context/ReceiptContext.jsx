import { createContext, useState } from "react";

export const ReceiptContext = createContext();

export const ReceiptProvider = ({ children }) => {
  const [waterHistory, setWaterHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("recibosAgua")) || [];
  });

  const [lightHistory, setLightHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("recibosLuz")) || [];
  });

  const [config, setConfig] = useState(() => {
    const data = JSON.parse(localStorage.getItem("configuracion"));
    return data || null;
  });

  const updateConfig = (newConfig) => {
    localStorage.setItem("configuracion", JSON.stringify(newConfig));
    setConfig(newConfig); // <--- ESTO es lo que avisa al Dashboard que debe redibujarse
  };

  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const allReceipts = [...waterHistory, ...lightHistory];
    if (allReceipts.length > 0) {
      const ordenados = allReceipts.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha),
      );
      return ordenados[0].fecha.substring(0, 7);
    }
    return "nuevo";
  });

  return (
    <ReceiptContext.Provider
      value={{
        waterHistory,
        setWaterHistory,
        lightHistory,
        setLightHistory,
        selectedPeriod,
        setSelectedPeriod,
        config,
        setConfig,
        updateConfig,
      }}
    >
      {children}
    </ReceiptContext.Provider>
  );
};
