import { createContext, useState } from "react";

export const ReciboContext = createContext();

export const ReciboProvider = ({ children }) => {
  // 1. Cargamos los datos directamente en el estado inicial para evitar el renderizado doble
  const [historialAgua, setHistorialAgua] = useState(() => {
    return JSON.parse(localStorage.getItem("recibosAgua")) || [];
  });

  const [historialLuz, setHistorialLuz] = useState(() => {
    return JSON.parse(localStorage.getItem("recibosLuz")) || [];
  });

  const [configuracion, setConfiguracion] = useState(() => {
    const data = JSON.parse(localStorage.getItem("configuracion"));
    return data || null;
  });

  // 2. Calculamos el periodo inicial basándonos en los estados que ya tienen data
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(() => {
    const todos = [...historialAgua, ...historialLuz];
    if (todos.length > 0) {
      const ordenados = todos.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
      return ordenados[0].fecha.substring(0, 7);
    }
    return "nuevo";
  });

  // 3. Este useEffect ya no necesita cargar data, solo sincronizar si fuera necesario
  // Pero para lo que haces ahora, ¡podrías incluso borrar los useEffect anteriores!

  return (
    <ReciboContext.Provider
      value={{
        historialAgua,
        setHistorialAgua,
        historialLuz,
        setHistorialLuz,
        periodoSeleccionado,
        setPeriodoSeleccionado,
        configuracion, // No olvides exportar esto también
        setConfiguracion,
      }}
    >
      {children}
    </ReciboContext.Provider>
  );
};
