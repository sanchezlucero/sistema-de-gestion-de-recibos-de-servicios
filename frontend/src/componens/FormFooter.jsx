import { FileCheck } from "lucide-react";

export default function FormFooter({
  totalAmount,
  buttonText = "Guardar recibo",
}) {
  return (
    <div className="mt-8 rounded-xl border border-purple-200 p-6 flex items-center justify-between bg-purple-50/30">
      <div>
        <p className="text-sm text-slate-600 font-medium">Total a pagar</p>
        <p className="text-3xl font-bold text-purple-700">S/ {totalAmount}</p>
      </div>

      <button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-200"
      >
        <FileCheck size={20} />
        <span className="font-semibold">{buttonText}</span>
      </button>
    </div>
  );
}
