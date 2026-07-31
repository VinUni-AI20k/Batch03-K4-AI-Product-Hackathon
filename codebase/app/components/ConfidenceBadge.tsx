export default function ConfidenceBadge({ score, label }: { score: number; label: string }) {
  const tone = score >= 85 ? "high" : score >= 70 ? "medium" : "low";
  return <span className={`confidence-badge ${tone}`} title={`Điểm khớp dữ liệu: ${score}%`}><i />{label}</span>;
}
