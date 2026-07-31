import React, { useState } from 'react';
import { MoneyTreeIcon, PiggyBankIcon, RoadTripIcon } from './Illustrations';

const DEFAULT_SLIDES = [
  { title: 'Time to Prep', icon: PiggyBankIcon, bg: 'var(--flat-pink-bg)' },
  { title: 'Find Weak Spots', icon: MoneyTreeIcon, bg: 'var(--flat-blue-bg)' },
  { title: 'Retest & Relax', icon: RoadTripIcon, bg: 'var(--flat-yellow-bg)' },
];

export default function SlideCarousel({ slides = DEFAULT_SLIDES }: { slides?: typeof DEFAULT_SLIDES }) {
  const [active, setActive] = useState(0);

  return (
    <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
      {slides.map((slide, i) => {
        const Icon = slide.icon;
        return (
          <div
            key={slide.title}
            className="slide-phone"
            onClick={() => setActive(i)}
            style={{ maxWidth: 220, cursor: 'pointer', transform: i === active ? 'translateY(-6px)' : 'none', transition: 'transform .2s ease' }}
          >
            <div className="slide-phone__header">
              <span className="slide-phone__logo">Co</span>
              <span aria-hidden style={{ fontSize: 18 }}>☰</span>
            </div>
            <div className="slide-phone__illustration" style={{ background: slide.bg }}>
              <Icon size={110} />
            </div>
            <span className="slide-phone__title">{slide.title}</span>
            <div className="slide-phone__dots">
              {slides.map((_, dotIdx) => (
                <span key={dotIdx} className={`slide-dot ${dotIdx === i ? 'slide-dot--active' : ''}`} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
