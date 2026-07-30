import { useEffect, useState } from "react";
import { Icon } from "../common/Icon.jsx";

export function EditDialog({ event, onClose, onSave }) {
  const [time, setTime] = useState(event?.time ?? "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTime(event?.time ?? "");
    setIsSaving(false);
  }, [event]);

  if (!event) return null;

  const submit = async (submitEvent) => {
    submitEvent.preventDefault();
    setIsSaving(true);
    await onSave(event.id, time);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="edit-title">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600">Human in the loop</p>
            <h2 id="edit-title" className="mt-1 text-xl font-extrabold text-ink">Chỉnh sửa thời gian</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-slate-100" aria-label="Đóng"><Icon>close</Icon></button>
        </div>
        <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">{event.title}</p>
        <label htmlFor="event-time" className="mt-5 block text-xs font-bold text-slate-600">Thời gian chính xác</label>
        <input id="event-time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" autoFocus />
        <p className="mt-2 text-xs leading-5 text-slate-400">Thay đổi của bạn sẽ được ghi nhận để cải thiện lần trích xuất sau.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100">Hủy</button>
          <button type="submit" disabled={isSaving} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
            {isSaving ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
