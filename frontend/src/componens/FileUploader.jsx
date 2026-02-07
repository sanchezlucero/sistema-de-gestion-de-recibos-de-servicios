import { useState } from "react";
import { Upload } from "lucide-react";

export default function FileUploader({ onDataExtracted, type }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      alert("Por favor, sube un archivo PDF válido.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("recibo", file);
    formData.append("categoria", type); // Aquí enviamos si es 'agua' o 'luz'

    try {
      const response = await fetch(API_URL + "/procesar-recibo", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      onDataExtracted(data);
    } catch (error) {
      console.error("Error al procesar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      className={`relative mb-8 p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all
        ${
          isDragging
            ? "border-purple-500 bg-purple-50 scale-[1.01]"
            : "border-slate-200 bg-white"
        }
        ${loading ? "opacity-50 pointer-events-none" : ""}`}
    >
      <Upload
        className={`w-10 h-10 mb-3 ${
          isDragging ? "text-purple-600" : "text-slate-400"
        }`}
      />
      <p className="text-sm font-medium text-slate-600">
        {loading ? "Extrayendo datos..." : `Arrastra tu recibo de ${type} aquí`}
      </p>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => handleFile(e.target.files[0])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}
