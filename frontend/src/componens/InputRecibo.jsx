// InputRecibo.jsx
export default function InputRecibo({
  label,
  name,
  value,
  onChange,
  type = "number",
  placeholder,
  isWarning,
}) {
  return (
    <div className="relative group">
      <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider transition-colors group-focus-within:text-purple-600 text-left">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border p-3 text-sm outline-none transition-all shadow-sm
          ${
            isWarning
              ? "border-orange-300 bg-orange-50 focus:ring-2 focus:ring-orange-200"
              : "border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          }`}
      />
      {isWarning && (
        <span className="text-[10px] text-orange-600 absolute -bottom-4 left-0 font-medium animate-pulse">
          ⚠️ Verificar en recibo físico
        </span>
      )}
    </div>
  );
}
