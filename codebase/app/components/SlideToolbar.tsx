export default function SlideToolbar({ page, total, zoom, onPageChange, onZoomChange }: {
  page: number; total: number; zoom: number;
  onPageChange: (page: number) => void;
  onZoomChange: (zoom: number) => void;
}) {
  return (
    <div className="slide-toolbar" aria-label="Điều khiển slide">
      <div className="page-controls">
        <button aria-label="Trang trước" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>‹</button>
        <div><input aria-label="Trang hiện tại" type="number" min={1} max={total} value={page} onChange={(event) => onPageChange(Number(event.target.value))} /><span>/ {total}</span></div>
        <button aria-label="Trang sau" onClick={() => onPageChange(page + 1)} disabled={page >= total}>›</button>
      </div>
      <div className="zoom-controls">
        <button aria-label="Thu nhỏ" onClick={() => onZoomChange(zoom - 10)} disabled={zoom <= 70}>−</button>
        <span>{zoom}%</span>
        <button aria-label="Phóng to" onClick={() => onZoomChange(zoom + 10)} disabled={zoom >= 130}>＋</button>
        <button className="fit-button" aria-label="Vừa khung" onClick={() => onZoomChange(100)}>↔</button>
      </div>
    </div>
  );
}
