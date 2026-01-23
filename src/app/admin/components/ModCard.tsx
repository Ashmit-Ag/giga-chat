import { Check } from "lucide-react";

export default function ModCard({ mod, onChange, onSelect }: any) {
  return (
    <div className={`border rounded-lg p-4 bg-[#0f1424] transition ${
      mod.selected ? "border-indigo-500 text-white" : "border-white/10"
    }`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs uppercase">Moderator</span>
        <button
          onClick={() => onSelect(!mod.selected)}
          className={`h-5 w-5 border rounded flex items-center justify-center ${
            mod.selected ? "bg-indigo-600 border-indigo-600" : "border-white/20"
          }`}
        >
          {mod.selected && <Check size={12} />}
        </button>
      </div>

      <div className="space-y-3">
        <input
          className="w-full bg-transparent border border-white/10 focus:text-white rounded px-3 py-2 text-sm"
          value={mod.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />

        <input
          className="w-full bg-transparent border border-white/10 focus:text-white rounded px-3 py-2 text-sm"
          value={mod.password}
          type="password"
          onChange={(e) => onChange({ password: e.target.value })}
        />
      </div>
    </div>
  );
}
