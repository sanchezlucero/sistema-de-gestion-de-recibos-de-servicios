import FileUploader from "./FileUploader";

export default function FormGeneral({logo, type, onFileExtracted, children}) {
  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <img src={logo} alt="cargando logo" className="w-32" />
        <div className="text-right">
          <h1 className="text-xl font-bold text-slate-800">
            Cálculo de Recibo de {type}
          </h1>
          <p className="text-sm text-slate-500">
            Sube tu PDF para autocompletar
          </p>
        </div>
      </div>
      <FileUploader
        type={type?.toLowerCase()}
        onDataExtracted={(data)=> onFileExtracted(data)}
      />
      <div className="py-2">
        {children}
      </div>
    </div>
  );
}
