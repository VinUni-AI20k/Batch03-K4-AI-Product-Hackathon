import React from 'react';

/** Shared stroke style for the whole icon set — keeps every icon feeling hand-drawn & consistent */
const S = { stroke: 'var(--flat-ink)', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

/** A simple rounded "blob person" — swap `fill` to recolor without redrawing */
export function BlobPerson({ fill = '#F6C453', size = 90 }: { fill?: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 90 118" fill="none">
      <circle cx="45" cy="24" r="16" fill={fill} {...S} />
      <path d="M25 60c0-14 9-24 20-24s20 10 20 24v34c0 4-3 6-6 6H31c-3 0-6-2-6-6V60Z" fill={fill} {...S} />
      <path d="M20 70 5 50M70 70l15-20" {...S} fill="none" />
      <circle cx="39" cy="22" r="2.2" fill="var(--flat-ink)" />
      <circle cx="51" cy="22" r="2.2" fill="var(--flat-ink)" />
      <path d="M39 29c2 2 8 2 12 0" {...S} fill="none" />
    </svg>
  );
}

export function PiggyBankIcon({ size = 140 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 140" fill="none">
      <ellipse cx="80" cy="80" rx="55" ry="40" fill="#F7A8C4" {...S} />
      <path d="M118 60c8-6 18-4 20 2-4 6-12 8-20 6" fill="#F7A8C4" {...S} />
      <circle cx="112" cy="70" r="3" fill="var(--flat-ink)" />
      <path d="M25 95v14M40 100v12" {...S} />
      <rect x="70" y="55" width="24" height="10" rx="5" fill="var(--flat-ink)" />
      <circle cx="150" cy="40" r="16" fill="#F6C453" {...S} />
      <text x="150" y="46" fontSize="14" textAnchor="middle" fontWeight="700" fill="var(--flat-ink)">$</text>
    </svg>
  );
}

export function MoneyTreeIcon({ size = 140 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      <rect x="72" y="90" width="16" height="55" rx="6" fill="#B9895B" {...S} />
      <circle cx="80" cy="65" r="52" fill="#3F7A6B" {...S} />
      {[[45, 45], [110, 40], [40, 90], [115, 95], [80, 30]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="12" fill="#F6C453" stroke="var(--flat-ink)" strokeWidth={2.5} />
      ))}
    </svg>
  );
}

export function RoadTripIcon({ size = 140 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 130" fill="none">
      <path d="M20 100h160" {...S} />
      <rect x="35" y="55" width="130" height="45" rx="18" fill="#FFFFFF" {...S} />
      <rect x="55" y="20" width="60" height="35" rx="10" fill="#E86A5B" {...S} />
      <circle cx="65" cy="100" r="14" fill="var(--flat-ink)" />
      <circle cx="140" cy="100" r="14" fill="var(--flat-ink)" />
    </svg>
  );
}
