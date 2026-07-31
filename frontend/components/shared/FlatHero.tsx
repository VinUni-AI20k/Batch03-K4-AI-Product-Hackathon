import React from 'react';
import { BlobPerson, PiggyBankIcon } from './Illustrations';
import heroImg from '../../assets/DrawKit Vector Illustration Team Work (1).png';

/**
 * Reference-matched hero: pastel full-bleed section, white rounded card,
 * bold near-black Poppins headline, underlined text-link CTA.
 * Drop this in place of (or above) <UploadStep /> if you want the landing
 * screen to use the flat-illustration look instead of the clay look.
 */
export default function FlatHero() {
  return (
    <section className="flat-section flat-section--pink" style={{ borderRadius: 32 }}>
      <div className="flat-card">
        <nav className="flat-nav" style={{ marginBottom: 32 }}>
          <span className="flat-heading" style={{ fontSize: 20 }}>Co</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="#" className="flat-nav-link">Pricing</a>
            <a href="#" className="flat-nav-link">Support</a>
            <a href="#" className="flat-nav-link">About</a>
          </div>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 220, height: 180 }}>
            <img src={heroImg} alt="Hero" style={{ width: 220, height: 180, objectFit: 'cover', borderRadius: 12 }} />
          </div>

          <div style={{ flex: 1, minWidth: 240 }}>
            <h1 className="flat-heading" style={{ fontSize: 40 }}>
              Bring your studying to the 21st century
            </h1>
            <button className="flat-link" style={{ marginTop: 18 }}>
              Sign up today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
