import { Icon } from "../common/Icon.jsx";

export function TimelineError({ onRetry }) {
  return (
    <div className="mt-4 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
      <Icon className="text-4xl text-red-400">error</Icon>
      <p className="mt-3 text-sm font-bold text-red-700">Không tải được dòng thời gian từ backend.</p>
      <p className="mt-1 text-xs text-red-500">Kiểm tra server đang chạy tại VITE_API_BASE_URL rồi thử lại.</p>
      <button onClick={onRetry} className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-red-700">
        Thử lại
      </button>
    </div>
  );
}
