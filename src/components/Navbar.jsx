import React from 'react';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <img src="/16bit-80s.gif" alt="Walking Cat" className="nav-cat-walking" id="navCat" />

        <div className="nav-logo" data-aos="fade-right">
          <span>Ibnu dexton</span>
        </div>
        <ul className="nav-menu">
          <li><a href="#home" className="active" data-i18n="navHome">Home</a></li>
          <li><a href="#about" data-i18n="navAbout">Tentang</a></li>
          <li><a href="#skills" data-i18n="navSkills">Keahlian</a></li>
          <li><a href="#techstack" data-i18n="navTechstack">Tech Stack</a></li>
          <li><a href="#projects" data-i18n="navProjects">Proyek</a></li>
          <li><a href="#contact" data-i18n="navContact">Kontak</a></li>
          <div className="nav-indicator"></div>
        </ul>
        <div className="nav-toggle" id="mobile-menu" data-aos="fade-left">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
