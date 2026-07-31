import { useEffect, useState } from "react";
import { Icon } from "../common/Icon.jsx";

export function OutlookDeviceCodeDialog({ deviceCode, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [deviceCode]);

  if (!deviceCode) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(deviceCode.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — the code is
      // still shown on screen for the user to type manually.
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="outlook-device-code-title">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600">Đăng nhập Outlook</p>
            <h2 id="outlook-device-code-title" className="mt-1 text-xl font-extrabold text-ink">Nhập mã xác thực</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-slate-100" aria-label="Đóng"><Icon>close</Icon></button>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-500">
          Mình đã mở trang đăng nhập Microsoft ở một tab mới. Dán mã dưới đây vào đó rồi đăng nhập bằng tài khoản Outlook của bạn:
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 p-4">
          <p className="flex-1 text-center font-mono text-2xl font-extrabold tracking-[0.2em] text-ink">{deviceCode.code}</p>
          <button
            type="button"
            onClick={copyCode}
            className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${copied ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {copied ? "Đã copy" : "Copy mã"}
          </button>
        </div>
        <a
          href={deviceCode.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-xs font-bold text-blue-600 hover:underline"
        >
          Tab không tự mở? Bấm vào đây: {deviceCode.url}
        </a>
        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
          <Icon className="animate-spin text-base">progress_activity</Icon>Đang chờ bạn đăng nhập xong…
        </div>
      </div>
    </div>
  );
}
