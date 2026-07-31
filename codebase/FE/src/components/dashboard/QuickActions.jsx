import { Icon } from "../common/Icon.jsx";
import { quickActions } from "../../data.js";

export function QuickActions({ active, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() => onSelect(action.id)}
          className={`flex items-center gap-3 rounded-2xl border bg-white p-3 text-left transition-colors hover:-translate-y-0.5 hover:shadow-md ${
            active === action.id ? "border-blue-300 ring-4 ring-blue-50" : "border-slate-200"
          }`}
        >
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${action.color}`}>
            <Icon className="text-xl">{action.icon}</Icon>
          </span>
          <span className="text-xs font-bold leading-4 text-slate-700">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
