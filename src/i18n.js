// ================================================================
// I18N — Kamus terjemahan situs (Indonesia asli & English gaul US)
// Semua teks yang tampil ke user ditandai lewat atribut data-i18n
// di JSX, lalu diisi ulang oleh applyLanguage() di App.jsx.
// ================================================================
export const translations = {
  id: {
    // Loader
    enterBtn: 'enter',

    // Navbar
    navHome: 'Home',
    navAbout: 'Tentang',
    navSkills: 'Keahlian',
    navTechstack: 'Tumpukan Teknologi',
    navProjects: 'Proyek',
    navContact: 'Kontak',

    // Hero
    heroGreeting: 'Halo, Saya',
    heroSubtitle: 'Desainer Komunikasi Visual | Lulusan SMKN 5 Kota Tangerang',
    heroDesc: 'Menciptakan karya visual yang impactful dan estetis untuk berbagai client ternama.',
    heroBtnProjects: 'Lihat Proyek',
    heroBtnContact: 'Hubungi Saya',
    scrollIndicator: 'Scroll',

    // About
    aboutHeader: 'Tentang Saya',
    aboutSubtitle: 'PROFIL PROFESIONAL',
    aboutP1: 'Saya Ibnu Dexton, lulusan SMKN 5 Kota Tangerang dengan jurusan Desain Komunikasi Visual. Dengan passion dalam menciptakan desain yang bermakna, saya telah bekerja dengan berbagai klien dari berbagai industries.',
    aboutP2: 'Pendekatan saya adalah menggabungkan estetika modern dengan fungsi yang jelas, memastikan setiap proyek tidak hanya terlihat indah tetapi juga efektif dalam menyampaikan pesan.',
    statProjects: 'Proyek Selesai',
    statClients: 'Klien Puas',
    statYears: 'Tahun Pengalaman',

    // Skills
    skillsHeader: 'Keahlian',
    skillUiuxTitle: 'UI/UX Design',
    skillUiuxDesc: 'Mendesain antarmuka yang intuitif dan pengalaman pengguna yang engaging.',
    skillGraphicTitle: 'Graphic Design',
    skillGraphicDesc: 'Desain grafis untuk branding, marketing, dan kebutuhan visual lainnya.',
    skillMotionTitle: 'Motion Design',
    skillMotionDesc: 'Animasi dan motion graphics untuk konten digital yang dinamis.',
    skillFrontendTitle: 'Frontend Dev',
    skillFrontendDesc: 'Membangun website responsif dengan HTML, CSS, dan JavaScript.',

    // Tech Stack
    techstackHeader: 'Tumpukan Teknologi',
    techReactDesc: 'Jadi tulang punggung hampir semua UI yang saya bangun—component-based, gampang di-reuse, dan enak dipadukan dengan state management ringan.',
    techNextDesc: 'Andalan untuk proyek yang butuh performa lebih—SSR dan routing bawaannya bikin loading halaman terasa instan tanpa konfigurasi ribet.',
    techJsDesc: 'Bahasa yang paling sering saya sentuh tiap hari—dari logika interaktif kecil sampai integrasi API, selalu jadi lem penghubung antar teknologi lain.',
    techTailwindDesc: 'Bikin proses styling jauh lebih cepat tanpa bolak-balik file CSS terpisah—utility class-nya cocok banget buat iterasi desain yang gesit.',
    techPhpDesc: 'Fondasi logika server-side yang saya pakai sejak awal belajar backend—stabil, dokumentasinya luas, dan tetap relevan untuk banyak proyek nyata.',
    techLaravelDesc: 'Framework favorit untuk merapikan struktur backend—Eloquent dan routing-nya bikin saya bisa fokus ke logika bisnis, bukan boilerplate.',
    techMysqlDesc: 'Tempat saya menaruh kepercayaan untuk data yang butuh relasi jelas dan query yang terstruktur rapi di balik layar setiap aplikasi.',
    techFirebaseDesc: 'Solusi cepat saat proyek butuh autentikasi atau database real-time tanpa harus bangun server sendiri dari nol.',
    techFlutterDesc: 'Pilihan saya untuk masuk ke dunia mobile—satu codebase bisa jalan di Android dan iOS, hemat waktu tanpa mengorbankan tampilan.',
    techDartDesc: 'Bahasa di balik setiap widget Flutter yang saya susun—null safety-nya bikin aplikasi mobile lebih jarang crash saat runtime.',

    // Projects
    projectsHeader: 'Proyek Archive',
    proj1Title: 'brand identity server - Garuda Private Server',
    proj1Desc: 'Produksi dan editing video kreatif menggunakan CapCut PC, pembuatan poster, banner, serta optimasi visual thumbnail YouTube untuk meningkatkan CTR klien.',
    proj1Tag: 'Branding',
    proj2Title: 'Custom Vector Logo & Typography Modification',
    proj2Desc: 'Eksperimen dan pengerjaan modifikasi font serta pembuatan logo vektor kustom menggunakan Adobe Illustrator untuk kebutuhan branding komersial.',
    proj2Tag: 'custom edit',
    proj3Title: 'Print Media Design & Packaging Workflow - Internship',
    proj3Desc: 'Pengalaman 3 bulan magang di industri percetakan dan online shop packing, menangani kesiapan berkas desain sebelum naik cetak dan standardisasi visual produk.',
    proj3Tag: 'Layout & Cetak',
    proj4Title: 'pemilik merek',
    proj4Desc: 'Desain layout katalog dan majalah visual berskala cetak untuk mempromosikan brand fashion lokal asal Tangerang.',
    proj4Tag: 'Layout & Cetak',
    proj5Title: 'Packaging Design - Keripik Tempe Modern',
    proj5Desc: 'Desain kemasan makanan ringan lokal dengan ilustrasi modern dan ramah lingkungan agar bersaing di pasar modern.',
    proj5Tag: 'Packaging',
    proj6Title: 'Social Media Kit - Campaign Launch',
    proj6Desc: 'Pembuatan aset visual promosi Instagram feeds dan story untuk produk sepatu lokal berkolaborasi dengan seniman mural.',
    proj6Tag: 'Social Media',
    viewProject: 'Lihat Proyek',

    // Contact
    contactHeader: 'Hubungi Saya',
    contactLocation: 'Tangerang, Indonesia',
    formNameLabel: 'Nama Lengkap',
    formEmailLabel: 'Email',
    formSubjectLabel: 'Subjek',
    formMessageLabel: 'Pesan Anda...',
    formSendBtn: 'Kirim Pesan',
    commentsHeader: 'Apa Kata Pengunjung',
    comment1Author: 'Rangga Desainer',
    comment1Text: 'Gila, interfacenya smooth banget bro! Terutama efek transisi pas ngescroll. Semangat terus karyanya 🔥',
    comment1Time: '1 jam yang lalu',
    commentFormHeader: 'Tinggalkan Jejakmu',
    commentNameLabel: 'Nama Kamu',
    commentTextLabel: 'Komentar mantapmu...',
    commentSendBtn: 'Kirim Komentar',

    // Footer
    footerText: '© 2026 Ibnu Dexton. All rights reserved.',

    // Cursor / Settings panel
    cfSettingsAria: 'Pengaturan Cursor',
    cfToggleOn: 'Nyalain',
    cfToggleOff: 'Matiin',
    cfChangeModel: 'Ganti Model',
    langSectionTitle: 'Bahasa',
    langIdLabel: 'Indonesia (Asli)',
    langEnLabel: 'English (Gaul)',

    // Music player
    musicToggleTitle: 'Mute/Unmute Musik',
  },

  en: {
    // Loader
    enterBtn: 'enter',

    // Navbar
    navHome: 'Home',
    navAbout: 'About',
    navSkills: 'Skills',
    navTechstack: 'Tech Stack',
    navProjects: 'Work',
    navContact: 'Contact',

    // Hero
    heroGreeting: "Yo, it's",
    heroSubtitle: 'Visual Communication Designer | SMKN 5 Tangerang Grad',
    heroDesc: 'Cooking up visual work that hits different for legit, big-name clients.',
    heroBtnProjects: 'Check My Work',
    heroBtnContact: 'Hit Me Up',
    scrollIndicator: 'Scroll',

    // About
    aboutHeader: 'About Me',
    aboutSubtitle: "GET TO KNOW ME",
    aboutP1: "I'm Ibnu Dexton, a Visual Communication Design grad from SMKN 5 Tangerang. I'm all about creating designs that actually mean something, and I've teamed up with clients across a bunch of different industries.",
    aboutP2: "My whole approach is blending modern aesthetics with clear function, so every project doesn't just look good — it actually gets the message across.",
    statProjects: 'Projects Done',
    statClients: 'Happy Clients',
    statYears: 'Years in the Game',

    // Skills
    skillsHeader: 'Skills',
    skillUiuxTitle: 'UI/UX Design',
    skillUiuxDesc: 'Designing interfaces that just make sense and UX that actually keeps people around.',
    skillGraphicTitle: 'Graphic Design',
    skillGraphicDesc: 'Graphic design for branding, marketing, and pretty much any visual need.',
    skillMotionTitle: 'Motion Design',
    skillMotionDesc: 'Animation and motion graphics that give digital content some life.',
    skillFrontendTitle: 'Frontend Dev',
    skillFrontendDesc: 'Building responsive sites with HTML, CSS, and JavaScript.',

    // Tech Stack
    techstackHeader: 'Tech Stack',
    techReactDesc: 'The backbone of pretty much every UI I build — component-based, easy to reuse, and plays nice with lightweight state management.',
    techNextDesc: "My go-to when a project needs extra performance — built-in SSR and routing make pages feel instant with zero config headaches.",
    techJsDesc: "The language I touch the most, every single day — from tiny interactive bits to full API integrations, it's the glue holding everything together.",
    techTailwindDesc: 'Makes styling way faster without bouncing between separate CSS files — the utility classes are perfect for quick design iteration.',
    techPhpDesc: "The server-side foundation I've used since day one learning backend — rock solid, well documented, and still relevant for real projects.",
    techLaravelDesc: 'My favorite framework for keeping backend structure clean — Eloquent and routing let me focus on business logic instead of boilerplate.',
    techMysqlDesc: 'Where I put my trust for data that needs clear relationships and clean, structured queries running behind every app.',
    techFirebaseDesc: 'My quick fix when a project needs auth or a real-time database without building a server from scratch.',
    techFlutterDesc: 'My pick for stepping into mobile — one codebase runs on Android and iOS, saving time without sacrificing the look.',
    techDartDesc: "The language behind every Flutter widget I put together — null safety means way fewer crashes at runtime.",

    // Projects
    projectsHeader: 'Project Archive',
    proj1Title: 'Brand Identity Server - Garuda Private Server',
    proj1Desc: 'Creative video production and editing in CapCut PC, plus posters, banners, and YouTube thumbnail optimization to boost the client\'s CTR.',
    proj1Tag: 'Branding',
    proj2Title: 'Custom Vector Logo & Typography Modification',
    proj2Desc: 'Font modification experiments and custom vector logo work in Adobe Illustrator for commercial branding needs.',
    proj2Tag: 'custom edit',
    proj3Title: 'Print Media Design & Packaging Workflow - Internship',
    proj3Desc: 'A 3-month internship in printing and online shop packing, handling design file prep before print and standardizing product visuals.',
    proj3Tag: 'Print & Layout',
    proj4Title: 'brand owner',
    proj4Desc: 'Catalog and print-scale magazine layout design to promote a local Tangerang fashion brand.',
    proj4Tag: 'Print & Layout',
    proj5Title: 'Packaging Design - Modern Tempeh Chips',
    proj5Desc: 'Packaging design for a local snack brand with modern, eco-friendly illustrations to stand out on shelves.',
    proj5Tag: 'Packaging',
    proj6Title: 'Social Media Kit - Campaign Launch',
    proj6Desc: 'Instagram feed and story promo assets for a local sneaker brand, made in collab with a mural artist.',
    proj6Tag: 'Social Media',
    viewProject: 'View Project',

    // Contact
    contactHeader: 'Get In Touch',
    contactLocation: 'Tangerang, Indonesia',
    formNameLabel: 'Full Name',
    formEmailLabel: 'Email',
    formSubjectLabel: 'Subject',
    formMessageLabel: 'Your Message...',
    formSendBtn: 'Send Message',
    commentsHeader: "What People Are Saying",
    comment1Author: 'Rangga Desainer',
    comment1Text: "Yo, this interface is smooth as heck bro! That scroll transition effect especially. Keep killin' it 🔥",
    comment1Time: '1 hour ago',
    commentFormHeader: 'Leave Your Mark',
    commentNameLabel: 'Your Name',
    commentTextLabel: 'Drop your thoughts...',
    commentSendBtn: 'Post Comment',

    // Footer
    footerText: '© 2026 Ibnu Dexton. All rights reserved.',

    // Cursor / Settings panel
    cfSettingsAria: 'Cursor Settings',
    cfToggleOn: 'Turn On',
    cfToggleOff: 'Turn Off',
    cfChangeModel: 'Swap Model',
    langSectionTitle: 'Language',
    langIdLabel: 'Indonesian (Original)',
    langEnLabel: 'English (Slang)',

    // Music player
    musicToggleTitle: 'Mute/Unmute Music',
  },
};

export const CF_MODELS = [
  { id: 'money', name: 'Money', src: '/money-cash.gif' },
  { id: 'jellyfish', name: 'Jellyfish', src: '/jellyfish.gif' },
  { id: 'kriby', name: 'Kriby', src: '/kirby.gif' },
];
