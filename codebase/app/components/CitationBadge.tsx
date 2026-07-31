import type { Citation } from "../types";

export default function CitationBadge({ citation, onNavigate }: { citation: Citation; onNavigate: (page: number) => void }) {
  return (
    <button className="citation-badge" onClick={() => onNavigate(citation.page)} title={`Mở ${citation.label}`}>
      <span>↗</span> Nguồn: {citation.label}
    </button>
  );
}
