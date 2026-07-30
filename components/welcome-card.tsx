export function WelcomeCard() {
  return (
    <section className="welcome-card">
      <div className="welcome-topline" />
      <div className="welcome-red" />
      <div className="relative max-w-3xl">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#c72127]">VLearn · VinUni AI Thực Chiến</p>
        <h2 className="text-xl font-black text-[#134d8b] md:text-2xl">Chào mừng trở lại, TRẦN VĂN ĐÔNG!</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
          VLearn đang tổng hợp tiến độ đọc và các tín hiệu học tập. Mở Khóa học của tôi để tiếp tục ngày học hoặc trao đổi cùng VLearn Tutor.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <span className="status-chip status-blue"><i />Tín hiệu học tập đang hoạt động</span>
          <span className="status-chip status-red">Đã đọc 0/6 ngày học</span>
        </div>
      </div>
    </section>
  );
}
