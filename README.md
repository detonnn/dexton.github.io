# Dexton — Personal Portfolio Website

Portfolio pribadi Ibnu Dexton, dibangun pakai React + Vite dengan tema **glassmorphism**, dukungan bahasa **Indonesia/English**, dan sederet fitur interaktif — mulai dari loading screen dengan efek font-shuffle, sampai chatbot AI yang ditenagai Claude.

**Live Preview:** [muhammad-ibnu.vercel.app](https://muhammad-ibnu.vercel.app/)

---

## Preview

<!-- Ganti src di bawah dengan GIF/screenshot hasil recording lo sendiri.
     Simpen file GIF-nya di folder /public/preview/ atau /docs/, lalu update path-nya.
     Rekomendasi tool buat bikin GIF: ScreenToGif (Windows), Kap (Mac), atau screen record lalu convert ke GIF di ezgif.com -->

| Loading Screen | Hero Section |
|---|---|
| ![Loading screen preview](./public/preview/loading-screen.gif) | ![Hero section preview](./public/preview/hero-section.gif) |

| Project Showcase | AI Chatbot |
|---|---|
| ![Project showcase preview](./public/preview/project-showcase.gif) | ![Chatbot preview](./public/preview/chatbot.gif) |

---

## Fitur Utama

- **Glassmorphism UI** — tampilan modern, halus, dan estetik di seluruh halaman.
- **Bilingual (ID/EN)** — sistem i18n custom (`i18n.js`) dengan atribut `data-i18n` di seluruh komponen, jadi ganti bahasa mulus tanpa reload.
- **AI Chatbot Widget** — chatbot interaktif yang terhubung ke Anthropic API lewat Vercel serverless function (`api/chat.js`), lengkap dengan efek typewriter, keyword detection, riwayat chat via `localStorage`, dan dropdown menu tiga titik.
- **Loading Screen Custom** — animasi font-shuffle yang cycle lewat ±30 Google Fonts berbeda gaya (gothic, pixel, CJK, Arab, Thai, dll), plus looping sound via Web Audio API.
- **Interactive Tech Stack Cards** — efek pop 3D on-hover yang smooth.
- **Optimized Scroll Performance** — integrasi Lenis, `IntersectionObserver` untuk skill bar, passive scroll listener, dan fix compositor-layer background.
- **Responsive Design** — dioptimalkan buat mobile, tablet, hingga desktop, termasuk fix overflow di elemen hero name.
- **Music Player Minimalis** — kontrol musik simpel di pojok kanan bawah.
- **Project Showcase** — galeri interaktif buat nampilin karya di bidang UI/UX design, graphic design, dan web development.

---

## Tech Stack & Tools

### Web Development
- **Framework:** React (Vite)
- **Styling:** CSS custom dengan pendekatan glassmorphism
- **Animasi/Scroll:** Lenis, Web Audio API
- **Backend/API:** Vercel Serverless Function (`api/chat.js`) sebagai proxy ke Anthropic API
- **Deployment:** [Vercel](https://vercel.com/)

### Design & Multimedia
- **UI/UX & Web Design:** Figma / Adobe Photoshop / Canva
- **Graphic Design:** Adobe Illustrator (vector, banner, poster)
- **Video Production:** CapCut PC (editing & thumbnail)

---

## Struktur Folder

```
├── api/              # Vercel serverless functions (mis. chat.js — proxy ke Anthropic API)
├── public/           # Asset gambar, icon, favicon
├── src/
│   ├── components/   # Komponen UI reusable
│   ├── i18n.js        # Sistem terjemahan ID/EN
│   ├── styles/        # File styling (CSS)
│   └── App.jsx        # Entry point utama aplikasi
├── vite.config.js    # Konfigurasi Vite
├── vercel.json       # Konfigurasi deployment Vercel
├── package.json      # Konfigurasi project & dependencies
└── README.md         # Dokumentasi ini
```

---

## Menjalankan Secara Lokal

```bash
# Clone repo
git clone https://github.com/detonnn/dexton.github.io.git
cd dexton.github.io

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka `http://localhost:5173` (atau port yang muncul di terminal) di browser.

### Environment Variables

Untuk fitur chatbot AI, buat file `.env` di root project dan isi API key Anthropic:

```
ANTHROPIC_API_KEY=your_api_key_here
```

> Serverless function di `api/chat.js` akan pakai key ini buat proxy request ke Anthropic API, jadi key-nya nggak pernah kebuka di sisi client.

---

## Deployment

Project ini di-deploy otomatis lewat **Vercel**. Setiap push ke branch `main` akan trigger build & deploy baru. Pastikan environment variable `ANTHROPIC_API_KEY` juga sudah diset di dashboard Vercel (Project Settings → Environment Variables).

---

## Kontak

Kalau mau connect, kolaborasi, atau sekadar ngobrol soal project ini, cek langsung [live site](https://muhammad-ibnu.vercel.app/) buat info kontak lengkapnya.

---

## License

Project ini dibuat untuk keperluan personal portfolio. Silakan lihat-lihat kodenya buat referensi, tapi jangan copy-paste mentah-mentah ya.
