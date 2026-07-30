export default function CourseHeader({ info, progressPercent=0, onStart }){
  return (
    <div className="bg-white">
      <div className="container-centered flex items-center justify-between py-6">
        <div>
          <div className="text-xs font-bold text-red-600 tracking-wider">VLEARN · VINUNI AI THỰC CHIẾN</div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2">{info?.title ?? 'COMP2010 - Khoá 3 + 4 Phase 1'}</h2>
          <div className="text-sm text-muted mt-1">{info?.students ?? 1074} học viên cùng lớp</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-slate-900"><span className="text-green-600 font-bold">✓</span> Đã đọc {info?.progress_completed ?? 0}/{info?.progress_total ?? 6} ngày</div>
            <div className="w-40 bg-slate-200 h-2 rounded mt-2 overflow-hidden">
              <div className="bg-[color:var(--tw-color-primary)] h-2" style={{width: `${progressPercent}%`, backgroundColor:'#0B3B60'}}></div>
            </div>
            <div className="text-xs text-muted mt-1">{progressPercent}%</div>
          </div>
          <button onClick={onStart} className="px-6 py-2.5 bg-[#0B3B60] text-white rounded-full font-semibold hover:opacity-90">Bắt đầu đọc</button>
        </div>
      </div>
    </div>
  )
}
