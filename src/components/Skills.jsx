import React from 'react';

function Skills() {
  return (
    <section id="skills" className="skills">
      <div className="container">
        <div className="section-header">
          <h2 data-i18n="skillsHeader">Keahlian</h2>
          <div className="underline"></div>
        </div>
        <div className="skills-grid">
          <div className="skill-card">
            <div className="skill-icon"><i className="fab fa-figma"></i></div>
            <h3 data-i18n="skillUiuxTitle">UI/UX Design</h3>
            <p data-i18n="skillUiuxDesc">Mendesain antarmuka yang intuitif dan pengalaman pengguna yang engaging.</p>
            <div className="skill-bar"><div className="skill-progress" style={{ width: '90%' }}></div></div>
          </div>
          <div className="skill-card">
            <div className="skill-icon"><i className="fas fa-pen-nib"></i></div>
            <h3 data-i18n="skillGraphicTitle">Graphic Design</h3>
            <p data-i18n="skillGraphicDesc">Desain grafis untuk branding, marketing, dan kebutuhan visual lainnya.</p>
            <div className="skill-bar"><div className="skill-progress" style={{ width: '95%' }}></div></div>
          </div>
          <div className="skill-card">
            <div className="skill-icon"><i className="fas fa-mobile-alt"></i></div>
            <h3 data-i18n="skillMotionTitle">Motion Design</h3>
            <p data-i18n="skillMotionDesc">Animasi dan motion graphics untuk konten digital yang dinamis.</p>
            <div className="skill-bar"><div className="skill-progress" style={{ width: '80%' }}></div></div>
          </div>
          <div className="skill-card">
            <div className="skill-icon"><i className="fas fa-code"></i></div>
            <h3 data-i18n="skillFrontendTitle">Frontend Dev</h3>
            <p data-i18n="skillFrontendDesc">Membangun website responsif dengan HTML, CSS, dan JavaScript.</p>
            <div className="skill-bar"><div className="skill-progress" style={{ width: '75%' }}></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
