import React from 'react';

function Projects() {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="section-header">
          <h2 data-i18n="projectsHeader">Proyek Archive</h2>
          <div className="underline"></div>
        </div>
        <div className="projects-grid">
          <a href="https://www.garudaps.com/" target="_blank" rel="noopener noreferrer" className="project-card-link">
            <div className="project-card">
              <div className="project-img" style={{ backgroundImage: "url('GARUDA PS 2026.jpg')" }}></div>
              <div className="project-info">
                <h3 data-i18n="proj1Title">brand identity server - Garuda Private Server</h3>
                <p data-i18n="proj1Desc">Produksi dan editing video kreatif menggunakan CapCut PC, pembuatan poster, banner, serta optimasi visual thumbnail YouTube untuk meningkatkan CTR klien.</p>
                <span className="project-tag tag-amber" data-i18n="proj1Tag">Branding</span>
                <span className="view-project"><span data-i18n="viewProject">Lihat Proyek</span> <i className="fas fa-arrow-right"></i></span>
              </div>
            </div>
          </a>
          <a href="https://www.behance.net/" target="_blank" rel="noopener noreferrer" className="project-card-link">
            <div className="project-card">
              <div className="project-img" style={{ backgroundImage: "url('logos.jpg')" }}></div>
              <div className="project-info">
                <h3 data-i18n="proj2Title">Custom Vector Logo & Typography Modification</h3>
                <p data-i18n="proj2Desc">Eksperimen dan pengerjaan modifikasi font serta pembuatan logo vektor kustom menggunakan Adobe Illustrator untuk kebutuhan branding komersial.</p>
                <span className="project-tag tag-cyan" data-i18n="proj2Tag">custom edit</span>
                <span className="view-project"><span data-i18n="viewProject">Lihat Proyek</span> <i className="fas fa-arrow-right"></i></span>
              </div>
            </div>
          </a>
          <a href="https://www.instagram.com/azkaprint.official/" target="_blank" rel="noopener noreferrer" className="project-card-link">
            <div className="project-card">
              <div className="project-img" style={{ backgroundImage: "url('azka.png')" }}></div>
              <div className="project-info">
                <h3 data-i18n="proj3Title">Print Media Design & Packaging Workflow - Internship</h3>
                <p data-i18n="proj3Desc">Pengalaman 3 bulan magang di industri percetakan dan online shop packing, menangani kesiapan berkas desain sebelum naik cetak dan standardisasi visual produk.</p>
                <span className="project-tag tag-lime" data-i18n="proj3Tag">Layout & Cetak</span>
                <span className="view-project"><span data-i18n="viewProject">Lihat Proyek</span> <i className="fas fa-arrow-right"></i></span>
              </div>
            </div>
          </a>
          <a href="https://www.instagram.com/attics.std?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="project-card-link">
            <div className="project-card">
              <div className="project-img" style={{ backgroundImage: "url('atticsjpg.jpg')" }}></div>
              <div className="project-info">
                <h3 data-i18n="proj4Title">create own brand</h3>
                <p data-i18n="proj4Desc">Desain layout katalog dan majalah visual berskala cetak untuk mempromosikan brand fashion lokal asal Tangerang.</p>
                <span className="project-tag tag-amber" data-i18n="proj4Tag">Layout & Cetak</span>
                <span className="view-project"><span data-i18n="viewProject">Lihat Proyek</span> <i className="fas fa-arrow-right"></i></span>
              </div>
            </div>
          </a>
          <a href="https://www.behance.net/gallery/103215571/Tempeh-Chips-Packaging-Design" target="_blank" rel="noopener noreferrer" className="project-card-link">
            <div className="project-card">
              <div className="project-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80')" }}></div>
              <div className="project-info">
                <h3 data-i18n="proj5Title">Packaging Design - Keripik Tempe Modern</h3>
                <p data-i18n="proj5Desc">Desain kemasan makanan ringan lokal dengan ilustrasi modern dan ramah lingkungan agar bersaing di pasar modern.</p>
                <span className="project-tag tag-lime" data-i18n="proj5Tag">Packaging</span>
                <span className="view-project"><span data-i18n="viewProject">Lihat Proyek</span> <i className="fas fa-arrow-right"></i></span>
              </div>
            </div>
          </a>
          <a href="https://www.behance.net/gallery/121115321/Sneakers-Brand-Social-Media-Campaign-Design" target="_blank" rel="noopener noreferrer" className="project-card-link">
            <div className="project-card">
              <div className="project-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80')" }}></div>
              <div className="project-info">
                <h3 data-i18n="proj6Title">Social Media Kit - Campaign Launch</h3>
                <p data-i18n="proj6Desc">Pembuatan aset visual promosi Instagram feeds dan story untuk produk sepatu lokal berkolaborasi dengan seniman mural.</p>
                <span className="project-tag tag-cyan" data-i18n="proj6Tag">Social Media</span>
                <span className="view-project"><span data-i18n="viewProject">Lihat Proyek</span> <i className="fas fa-arrow-right"></i></span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Projects;
