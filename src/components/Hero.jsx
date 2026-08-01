import React from 'react';

// --- Helper untuk animasi hover nama (huruf per huruf dengan delay bertahap) ---
function renderAnimatedName(text, keyPrefix) {
  const words = text.split(' ');
  let letterIndex = 0;
  const nodes = [];

  words.forEach((word, wi) => {
    nodes.push(
      <span className="name-word" key={`${keyPrefix}-w${wi}`}>
        {word.split('').map((ch, ci) => {
          const delay = (letterIndex++) * 0.028;
          return (
            <span
              key={`${keyPrefix}-w${wi}-c${ci}`}
              className="name-letter"
              style={{ transitionDelay: `${delay}s` }}
            >
              {ch}
            </span>
          );
        })}
      </span>
    );
    if (wi < words.length - 1) {
      nodes.push(' ');
    }
  });

  return nodes;
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          {/* === KOTAK TEKS (SISI KIRI) === */}
          <div className="hero-text">
            <p className="hero-greeting" data-i18n="heroGreeting">Halo, Saya</p>
            <h1 className="hero-title hero-name-hover">
              <span className="name-short">{renderAnimatedName('Ibnu Dexton', 'short')}</span>
              <span className="name-full" aria-hidden="true">{renderAnimatedName('Muhamad Ibnu Dexton Alfathir', 'full')}</span>
            </h1>
            <p className="hero-subtitle" data-i18n="heroSubtitle">Desainer Komunikasi Visual | Lulusan SMKN 5 Kota Tangerang</p>
            <p className="hero-desc" data-i18n="heroDesc">Menciptakan karya visual yang impactful dan estetis untuk berbagai client ternama.</p>
            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary" data-i18n="heroBtnProjects">Lihat Proyek</a>
              <a href="#contact" className="btn btn-secondary" data-i18n="heroBtnContact">Hubungi Saya</a>
            </div>
            <div className="hero-social">
              <a href="https://www.instagram.com/dxtnn_" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://www.tiktok.com/@risemss" target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok"></i></a>
              <a href="https://wa.me/6285281144792" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>

          {/* === KOTAK FOTO PROFIL (SISI KANAN) === */}
          <div className="hero-image">
            <div className="profile-wrapper">
              <img src="/newpfp.png" alt="Ibnu Dexton" className="profile-img" id="profile-img" />
              <div className="profile-ring"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="scroll-indicator">
        <span data-i18n="scrollIndicator">Scroll</span>
        <i className="fas fa-chevron-down"></i>
      </div>
    </section>
  );
}

export default Hero;
