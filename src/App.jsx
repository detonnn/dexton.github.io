import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import './app.css';
import { translations, CF_MODELS } from './i18n';

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

function App() {
  useEffect(() => {
    console.log("React Portofolio Ibnu Dexton Berhasil Jalan!");

    console.log('[PORTAL] DOM siap, memuat semua modul...');
    (function() {

      const loader = document.getElementById('loader');
      const enterBtn = document.getElementById('enterBtn');

      let siteEntered = false;

      const swiperSound = new Audio();
      swiperSound.src = '/swiper.MP3';
      swiperSound.preload = 'auto';
      swiperSound.load(); // Paksa Brave untuk langsung download file audio di awal

      // Sound loop selama font loading gonta-ganti, mati pas di-hover (Web Audio API = gapless loop)
      let fontLoopCtx = null;
      let fontLoopBuffer = null;
      let isFontLoopReady = false;
      let fontLoopSource = null;
      let fontSoundActive = true; // jadi false begitu user hover judulnya

      async function preloadFontLoopSound() {
          try {
              fontLoopCtx = new (window.AudioContext || window.webkitAudioContext)();
              const response = await fetch('/camera%20porto.MP3');
              const arrayBuffer = await response.arrayBuffer();
              fontLoopBuffer = await fontLoopCtx.decodeAudioData(arrayBuffer);
              isFontLoopReady = true;
              console.log('[AUDIO FONT] Buffer loop siap!');
          } catch (err) {
              console.warn('[AUDIO FONT] Gagal preload:', err);
          }
      }
      preloadFontLoopSound();

      function playFontLoopSound() {
          if (!isFontLoopReady || !fontLoopCtx || !fontLoopBuffer || fontLoopSource) return;
          if (fontLoopCtx.state === 'suspended') fontLoopCtx.resume();
          const source = fontLoopCtx.createBufferSource();
          const gain = fontLoopCtx.createGain();
          gain.gain.value = 0.5; // Atur volume sound loop font di sini
          source.buffer = fontLoopBuffer;
          source.loop = true; // gapless, beda sama HTMLAudioElement.loop yg suka ada micro-gap
          source.connect(gain);
          gain.connect(fontLoopCtx.destination);
          source.start(0);
          fontLoopSource = source;
      }

      function stopFontLoopSound() {
          if (fontLoopSource) {
              try { fontLoopSource.stop(); } catch (err) {}
              fontLoopSource.disconnect();
              fontLoopSource = null;
          }
      }

      let isAudioUnlocked = false;

      // --- AUDIO CONTEXT UTK TOMBOL ENTER (ANTI-DELAY) ---
      let enterAudioCtx = null;
      let enterAudioBuffer = null;
      let isEnterAudioReady = false;

      async function preloadEnterHoverSound() {
          try {
              enterAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
              const response = await fetch('/swiper.MP3');
              const arrayBuffer = await response.arrayBuffer();
              enterAudioBuffer = await enterAudioCtx.decodeAudioData(arrayBuffer);
              isEnterAudioReady = true;
              console.log('[AUDIO ENTER] Buffer siap, anti-delay aktif!');
          } catch (err) {
              console.warn('[AUDIO ENTER] Gagal preload:', err);
          }
      }
      // Jalankan preload langsung di awal
      preloadEnterHoverSound();

      function playEnterHoverSound() {
          if (!isEnterAudioReady || !enterAudioCtx || !enterAudioBuffer) return;
          
          if (enterAudioCtx.state === 'suspended') {
              enterAudioCtx.resume().then(executeEnterPlay).catch(() => {});
              return;
          }
          executeEnterPlay();
      }

      function executeEnterPlay() {
          if (!enterAudioCtx || enterAudioCtx.state !== 'running') return;
          const source = enterAudioCtx.createBufferSource();
          const gain = enterAudioCtx.createGain();
          gain.gain.value = 0.5; // Atur volume suara hover teks di sini (0.0 s/d 1.0)
          source.buffer = enterAudioBuffer;
          source.connect(gain);
          gain.connect(enterAudioCtx.destination);
          source.start(0);
      }

      function unlockAudioContext() {
          if (isAudioUnlocked) return;
          
          // Resume kontek audio enter jika statusnya tertahan browser
          if (enterAudioCtx && enterAudioCtx.state === 'suspended') {
              enterAudioCtx.resume();
          }
          
          swiperSound.play()
              .then(() => {
                  swiperSound.pause();
                  swiperSound.currentTime = 0;
                  isAudioUnlocked = true;
                  console.log('[AUDIO] Berhasil di-unlock & siap digunakan!');

                  // Mulai loop sound font-shuffle (kalau belum di-hover)
                  if (fontSoundActive) playFontLoopSound();

                  // Hapus event penangkap agar hemat memori
                  window.removeEventListener('click', unlockAudioContext);
                  window.removeEventListener('mousemove', unlockAudioContext);
                  window.removeEventListener('touchstart', unlockAudioContext);
              })
              .catch(err => {
                  console.log('[AUDIO] Menunggu interaksi pertama untuk unlock:', err);
              });
      }

      // Tangkap interaksi pertama user apa saja untuk unlock audio
      window.addEventListener('click', unlockAudioContext);
      window.addEventListener('mousemove', unlockAudioContext, { once: true });
      window.addEventListener('touchstart', unlockAudioContext);


      // --- PROSES ANIMASI TEXT MENCAR ---
      const loaderTitle = document.querySelector('.loader-title');
      if (loaderTitle) {
          loaderTitle.innerHTML = loaderTitle.textContent
              .split('')
              .map(char => char === ' ' ? '<span class="space">&nbsp;</span>' : `<span>${char}</span>`)
              .join('');

          const spans = loaderTitle.querySelectorAll('span');

          // --- FONT GONTA-GANTI RANDOM SAAT LOADING ---
          // Ganti daftar font di sini sesuai yang lo mau
          const LOADER_FONTS = [
              "'Cormorant Garamond', serif",
              "'Playfair Display', serif",
              "'Abril Fatface', serif",
              "'Bungee', cursive",
              "'Press Start 2P', monospace",
              "'VT323', monospace",
              "'Orbitron', sans-serif",
              "'Pacifico', cursive",
              "'Great Vibes', cursive",
              "'Caveat', cursive",
              "'UnifrakturMaguntia', cursive",
              "'Nosifer', cursive",
              "'Creepster', cursive",
              "'Monoton', cursive",
              "'Permanent Marker', cursive",
              "'Bangers', cursive",
              "'Lobster', cursive",
              "'Luckiest Guy', cursive",
              "'Amatic SC', cursive",
              "'Rakkas', cursive",       // vibe Arab
              "'Lalezar', cursive",      // vibe Arab
              "'Jomhuria', cursive",     // vibe Arab
              "'East Sea Dokdo', cursive", // vibe Korea
              "'Poor Story', cursive",   // vibe Korea
              "'Do Hyeon', sans-serif",  // vibe Korea
              "'Ma Shan Zheng', cursive", // vibe China
              "'Long Cang', cursive",    // vibe China
              "'Chonburi', cursive",     // vibe Thailand
              "'Charmonman', cursive",   // vibe Thailand
              "'Yuji Syuku', serif",     // vibe Jepang
          ];
          const fontShuffleInterval = setInterval(() => {
              loaderTitle.style.fontFamily = LOADER_FONTS[(Math.random() * LOADER_FONTS.length) | 0];
          }, 180);

          loaderTitle.addEventListener('mouseenter', () => {
              // Stop random font: otomatis freeze di font terakhir yang kelihatan
              clearInterval(fontShuffleInterval);
              fontSoundActive = false;
              stopFontLoopSound();

              // Munculkan tombol Enter dengan animasi fade-in
              if (enterBtn) enterBtn.classList.add('show-enter');

              // Mainkan sound effect secara instan lewat Web Audio API Buffer (ANTI DELAY)
              playEnterHoverSound();

              const shardData = [];
              spans.forEach((span, index) => {
                  if (span.classList.contains('space')) return;

                  const tx = Math.random() * 300 - 150;
                  const ty = Math.random() * 200 - 100;
                  const tz = Math.random() * 200 - 50;
                  const rx = Math.random() * 100 - 50;
                  const ry = Math.random() * 100 - 50;
                  const rz = Math.random() * 100 - 50;

                  const speedX = (Math.random() * 0.15 - 0.075);
                  const speedY = (Math.random() * 0.15 - 0.075);
                  const speedZ = (Math.random() * 0.15 - 0.075);
                  const rotSpeedX = (Math.random() * 0.05 - 0.025);
                  const rotSpeedY = (Math.random() * 0.05 - 0.025);
                  const rotSpeedZ = (Math.random() * 0.05 - 0.025);
                  const delay = index * 25; // Delay ripple antar-huruf agar sinematik

                  shardData.push({
                      element: span,
                      currentX: 0, currentY: 0, currentZ: 0,
                      currentRX: 0, currentRY: 0, currentRZ: 0,
                      targetX: tx, targetY: ty, targetZ: tz,
                      targetRX: rx, targetRY: ry, targetRZ: rz,
                      speedX, speedY, speedZ,
                      rotSpeedX, rotSpeedY, rotSpeedZ,
                      delay, exploded: false, startTime: null
                  });
              });

              loaderTitle.classList.add('shattered');
              const explosionStartTime = performance.now();

              function animateShatter(timestamp) {
                  shardData.forEach(shard => {
                      const elapsed = timestamp - explosionStartTime;
                      if (elapsed >= shard.delay) {
                          if (!shard.startTime) shard.startTime = timestamp;
                          const progressTime = timestamp - shard.startTime;

                          if (!shard.exploded) {
                              const duration = 1200; // Durasi sinkron penuh dengan sound swiper (1.2 detik)
                              const t = Math.min(progressTime / duration, 1);
                              const ease = 1 - Math.pow(1 - t, 4);

                              shard.currentX = shard.targetX * ease;
                              shard.currentY = shard.targetY * ease;
                              shard.currentZ = shard.targetZ * ease;
                              shard.currentRX = shard.targetRX * ease;
                              shard.currentRY = shard.targetRY * ease;
                              shard.currentRZ = shard.targetRZ * ease;

                              if (t === 1) shard.exploded = true;
                          } else {
                              shard.currentX += shard.speedX;
                              shard.currentY += shard.speedY;
                              shard.currentZ += shard.speedZ;
                              shard.currentRX += shard.rotSpeedX;
                              shard.currentRY += shard.rotSpeedY;
                              shard.currentRZ += shard.rotSpeedZ;
                          }

                          shard.element.style.transform = `
                              translate3d(${shard.currentX}px, ${shard.currentY}px, ${shard.currentZ}px)
                              rotateX(${shard.currentRX}deg)
                              rotateY(${shard.currentRY}deg)
                              rotateZ(${shard.currentRZ}deg)
                          `;
                          shard.element.style.opacity = '0.85';
                      }
                  });
                  requestAnimationFrame(animateShatter);
              }
              requestAnimationFrame(animateShatter);
          }, { once: true });
      }

      function hideLoader() {
          if (!loader) return;
          loader.classList.add('hide');
          console.log('[LOADER] Tersembunyi!');

          // BUKA KUNCI SCROLL: Aktifkan Lenis & hapus class lock di body saat masuk situs
          if (window.lenis) {
              window.lenis.start();
          }
          document.body.classList.remove('overflow-hidden');

          // Trigger animasi hero setelah loader hilang
          const hero = document.querySelector('.hero');
          if (hero) {
              setTimeout(() => {
                  hero.style.opacity = '1';
                  hero.style.transform = 'translateY(0)';
              }, 900);
          }
      }
      
      if (enterBtn) {
          enterBtn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();

              // Tandai user sudah masuk ke situs, baru dari sini sound lain boleh keluar
              siteEntered = true;

              // Mainkan sound enter.MP3 begitu tombol Enter ditekan
              new Audio('/enter.MP3').play().catch(err => console.log('[AUDIO] Enter sound error:', err));

              // 2. KUNCI UTAMA: Putar musik utama SEGERA tanpa delay saat klik enter
              if (typeof startMusicAfterEnter === 'function') {
                  startMusicAfterEnter();
              }

              // 3. Panggil fungsi bawaan template kamu untuk nutup loader
              if (typeof hideLoader === 'function') {
                  hideLoader();
              }
          });

          // Fallback: Tekan tombol Enter di keyboard
          document.addEventListener('keydown', function(e) {
              if (e.key === 'Enter' && loader && !loader.classList.contains('hide')) {
                  e.preventDefault();
                  hideLoader();
              }
          });

          console.log('[LOADER] Event listener tombol enter terpasang.');
      } else {
          console.warn('[LOADER] Tombol enter tidak ditemukan!');
      }

      // ================================================================
      // 2. LENIS SMOOTH SCROLL (DIBUNGKUS TRY-CATCH)
      // ================================================================
      try {
          if (typeof Lenis !== 'undefined') {
              const lenis = new Lenis({
                  duration: 1.2,
                  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                  orientation: 'vertical',
                  smoothWheel: true,
                  wheelMultiplier: 0.8,
                  touchMultiplier: 1.2,
              });

              window.lenis = lenis;
              
              // KUNCI UTAMA: Stop scroll Lenis langsung di awal
              lenis.stop();
              document.body.classList.add('overflow-hidden'); // Tambah class lock ke body

              window.targetVelocity = 0;
              window.currentVelocity = 0;
              window.scrollVelocity = 0;

              lenis.on('scroll', (e) => {
                  window.targetVelocity = e.velocity * 0.6;
              });

              function raf(time) {
                  lenis.raf(time);
                  requestAnimationFrame(raf);
              }
              requestAnimationFrame(raf);

              // Smooth scroll untuk anchor links
              document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                  anchor.addEventListener('click', function(e) {
                      e.preventDefault();
                      const target = document.querySelector(this.getAttribute('href'));
                      if (target) {
                          lenis.scrollTo(target, {
                              offset: -80,
                              duration: 1.2
                          });
                      }
                      this.blur();
                  });
              });

              console.log('[LENIS] Smooth scroll berhasil diinisialisasi.');
          } else {
              console.warn('[LENIS] Library tidak ditemukan, gunakan fallback native scroll.');
          }
      } catch (error) {
          console.warn('[LENIS] Error inisialisasi (dilewati):', error.message);
      }

      // ================================================================
      // 3. CURSOR FOLLOWER
      // ================================================================
      const cursorFollower = document.querySelector('.cursor-follower');
      let cursorX = 0, cursorY = 0, followerX = 0, followerY = 0;
      let animFrameId = null;

      function updateCursor(e) {
          cursorX = e.clientX;
          cursorY = e.clientY;
          if (cursorFollower && cursorFollower.style.opacity !== '1') {
              cursorFollower.style.opacity = '1';
          }
      }

      function animateFollower() {
          const lerp = 0.15;
          followerX += (cursorX - followerX) * lerp;
          followerY += (cursorY - followerY) * lerp;

          if (cursorFollower) {
              cursorFollower.style.transform =
                  `translate(${followerX - cursorFollower.offsetWidth/2}px, ${followerY - cursorFollower.offsetHeight/2}px)`;
          }
          animFrameId = requestAnimationFrame(animateFollower);
      }

      if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
          window.addEventListener('mousemove', updateCursor);
          animFrameId = requestAnimationFrame(animateFollower);
          document.addEventListener('mouseenter', () => {
              if (cursorFollower) cursorFollower.style.opacity = '1';
          });
          document.addEventListener('mouseleave', () => {
              if (cursorFollower) cursorFollower.style.opacity = '0';
          });
      } else {
          if (cursorFollower) cursorFollower.style.display = 'none';
      }

      // ================================================================
      // 3B. CURSOR FOLLOWER SETTINGS (toggle on/off & ganti model gif)
      // ================================================================
      (function() {
          const cfImg = document.getElementById('cursorFollowerImg');
          const cfSettings = document.getElementById('cfSettings');
          const cfBtn = document.getElementById('cfSettingsBtn');
          const cfMenu = document.getElementById('cfSettingsMenu');
          const cfToggleBtn = document.getElementById('cfToggleBtn');
          const cfToggleLabel = document.getElementById('cfToggleLabel');
          const cfModelList = document.getElementById('cfModelList');

          if (!cfImg || !cfSettings) return;

          let isOff = localStorage.getItem('cf_off') === '1';
          let activeModel = localStorage.getItem('cf_model') || CF_MODELS[0].id;

          // ============================================================
          // BAHASA / LANGUAGE SWITCHER (terpisah dari model cursor, tapi
          // masih satu panel Pengaturan biar rapi & gampang ditemukan)
          // ============================================================
          let currentLang = localStorage.getItem('site_lang') || 'id';

          function t(key) {
              return (translations[currentLang] && translations[currentLang][key]) || translations.id[key] || '';
          }

          function applyLanguage(lang) {
              currentLang = (lang === 'en') ? 'en' : 'id';
              localStorage.setItem('site_lang', currentLang);
              document.documentElement.lang = currentLang;

              document.querySelectorAll('[data-i18n]').forEach(el => {
                  const key = el.getAttribute('data-i18n');
                  const val = t(key);
                  if (val) el.textContent = val;
              });
              document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                  const key = el.getAttribute('data-i18n-placeholder');
                  const val = t(key);
                  if (val) el.placeholder = val;
              });
              document.querySelectorAll('[data-i18n-title]').forEach(el => {
                  const key = el.getAttribute('data-i18n-title');
                  const val = t(key);
                  if (val) el.title = val;
              });
              document.querySelectorAll('[data-i18n-aria]').forEach(el => {
                  const key = el.getAttribute('data-i18n-aria');
                  const val = t(key);
                  if (val) el.setAttribute('aria-label', val);
              });

              applyState(); // refresh label Matiin/Nyalain sesuai bahasa aktif
              renderLangList();

              // FIX: reposisi nav-indicator karena lebar teks navbar beda tiap bahasa
              const activeNavLink = document.querySelector('.nav-menu a.active');
              const navIndicatorEl = document.querySelector('.nav-indicator');
              if (activeNavLink && navIndicatorEl) {
                  navIndicatorEl.style.width = activeNavLink.offsetWidth + 'px';
                  navIndicatorEl.style.height = activeNavLink.offsetHeight + 'px';
                  navIndicatorEl.style.left = activeNavLink.offsetLeft + 'px';
                  navIndicatorEl.style.top = activeNavLink.offsetTop + 'px';
              }
          }

          function renderLangList() {
              if (!cfLangList) return;
              cfLangList.innerHTML = '';
              const LANGS = [
                  { id: 'id', labelKey: 'langIdLabel' },
                  { id: 'en', labelKey: 'langEnLabel' },
              ];
              LANGS.forEach(l => {
                  const item = document.createElement('button');
                  item.className = 'cf-settings-item cf-lang-item' + (l.id === currentLang ? ' active' : '');
                  item.innerHTML = `<i class="fas fa-language"></i> ${t(l.labelKey)}` + (l.id === currentLang ? ' <i class="fas fa-check cf-check"></i>' : '');
                  item.addEventListener('click', () => applyLanguage(l.id));
                  cfLangList.appendChild(item);
              });
          }

          const cfLangList = document.getElementById('cfLangList');

          function applyState() {
              const model = CF_MODELS.find(m => m.id === activeModel) || CF_MODELS[0];
              cfImg.src = model.src;
              cursorFollower.style.display = isOff ? 'none' : 'block';
              cfToggleLabel.textContent = isOff ? t('cfToggleOn') : t('cfToggleOff');
              cfToggleBtn.querySelector('i').className = isOff ? 'fas fa-eye-slash' : 'fas fa-eye';
          }

          function renderModelList() {
              cfModelList.innerHTML = '';
              CF_MODELS.forEach(m => {
                  const item = document.createElement('button');
                  item.className = 'cf-settings-item cf-model-item' + (m.id === activeModel ? ' active' : '');
                  item.innerHTML = `<i class="fas fa-image"></i> ${m.name}` + (m.id === activeModel ? ' <i class="fas fa-check cf-check"></i>' : '');
                  item.addEventListener('click', () => {
                      activeModel = m.id;
                      localStorage.setItem('cf_model', activeModel);
                      applyState();
                      renderModelList();
                  });
                  cfModelList.appendChild(item);
              });
          }

          cfBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              cfSettings.classList.toggle('open');
          });

          document.addEventListener('click', (e) => {
              if (!cfSettings.contains(e.target)) cfSettings.classList.remove('open');
          });

          cfToggleBtn.addEventListener('click', () => {
              isOff = !isOff;
              localStorage.setItem('cf_off', isOff ? '1' : '0');
              applyState();
          });

          applyState();
          renderModelList();
          applyLanguage(currentLang);
      })();

      // ================================================================
      // 4. NAVBAR SCROLL EFFECT & TOGGLE
      // ================================================================
      const navbar = document.querySelector('.navbar');
      window.addEventListener('scroll', function() {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          navbar.classList.toggle('scrolled', scrollY > 50);
      }, { passive: true });

      const navToggle = document.querySelector('.nav-toggle');
      const navMenu = document.querySelector('.nav-menu');
      if (navToggle && navMenu) {
          navToggle.addEventListener('click', function() {
              navMenu.classList.toggle('active');
              this.classList.toggle('active');
          });
          document.querySelectorAll('.nav-menu a').forEach(link => {
              link.addEventListener('click', () => {
                  navMenu.classList.remove('active');
                  navToggle.classList.remove('active');
              });
          });
      }

      // ================================================================
      // 5. SKILL BARS
      // ================================================================
      const skillBars = document.querySelectorAll('.skill-progress');
      let skillAnimated = false;

      function animateSkillBars() {
          skillBars.forEach(bar => {
              const width = bar.style.width;
              bar.style.width = '0%';
              setTimeout(() => { bar.style.width = width; }, 300);
          });
      }

      setTimeout(animateSkillBars, 2500);

      // Sebelumnya ini scroll listener yang manggil getBoundingClientRect() tiap event
      // scroll → forced layout tiap frame (layout thrashing), berat banget pas dipadu Lenis.
      // Diganti IntersectionObserver: browser yang ngasih tau kapan section masuk viewport,
      // gak perlu polling & baca layout manual sama sekali.
      const skillsSectionEl = document.querySelector('.skills');
      if (skillsSectionEl) {
          const skillTriggerObserver = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting && !skillAnimated) {
                      animateSkillBars();
                      skillAnimated = true;
                      skillTriggerObserver.disconnect();
                  }
              });
          }, { threshold: 0, rootMargin: '0px 0px -100px 0px' });
          skillTriggerObserver.observe(skillsSectionEl);
      }

      // ================================================================
      // 6. CONTACT FORM
      // ================================================================
      const contactForm = document.getElementById('contactForm');
      if (contactForm) {
          contactForm.addEventListener('submit', function(e) {
              e.preventDefault();
              const btn = this.querySelector('button');
              const originalText = btn.textContent;
              btn.textContent = 'Terkirim!';
              btn.style.background = '#4CAF50';
              btn.style.boxShadow = 'none';
              setTimeout(() => {
                  btn.textContent = originalText;
                  btn.style.background = '';
                  btn.style.boxShadow = '';
                  this.reset();
              }, 3000);
          });
      }

      // ================================================================
      // 7. SECTION REVEAL OBSERVER
      // ================================================================
      const sections = document.querySelectorAll('section');
      const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Toggle 2 arah: section muncul lagi tiap kali masuk viewport,
              // baik scroll ke bawah maupun ke atas, ga cuma sekali seumur hidup.
              entry.target.classList.toggle('revealed', entry.isIntersecting);
              if (entry.isIntersecting && entry.target.id === 'about') {
                  animateCounters();
              }
          });
      }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

      sections.forEach(section => {
          section.classList.add('reveal-init');
          revealObserver.observe(section);
      });


      const GRID_ITEM_SELECTOR = '.project-card-link, .skill-card, .client-card, .tech-card';
      const gridItems = document.querySelectorAll(GRID_ITEM_SELECTOR);

      const staggerCountByParent = new Map();
      gridItems.forEach((item) => {
          const parent = item.parentElement;
          const count = staggerCountByParent.get(parent) || 0;
          const delay = Math.min(count * 0.08, 0.4);
          item.style.setProperty('--reveal-delay', `${delay}s`);
          staggerCountByParent.set(parent, count + 1);
      });

      const gridItemObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Toggle 2 arah juga di level kartu, jadi tiap kartu pop-up lagi
              // setiap kali dia masuk viewport dari arah mana pun.
              entry.target.classList.toggle('in-view', entry.isIntersecting);
          });
      }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

      gridItems.forEach(item => gridItemObserver.observe(item));

      // ================================================================
      // 8. COUNTER ANIMATION
      // ================================================================
      function animateCounters() {
          if (!siteEntered) return;
          const counters = document.querySelectorAll('.stat-number');
          const tickSound = document.getElementById('tickSound');
          if (tickSound) tickSound.volume = 0.2;

          counters.forEach(counter => {
              if (counter.classList.contains('counting')) return;
              counter.classList.add('counting');
              const target = +counter.getAttribute('data-target');
              const duration = 1500;
              const stepTime = Math.max(Math.floor(duration / target), 30);
              let start = 0;

              const timer = setInterval(() => {
                  start += 1;
                  if (tickSound) {
                      tickSound.currentTime = 0;
                      tickSound.play().catch(() => {});
                  }
                  counter.textContent = (counter.getAttribute('data-target') === '4') ? start : start + '+';
                  if (start >= target) {
                      clearInterval(timer);
                      counter.classList.remove('counting');
                      if (tickSound) {
                          tickSound.pause();
                          tickSound.currentTime = 0;
                      }
                  }
              }, stepTime);
              counter.dataset.timer = timer;
          });
      }

      const aboutBox = document.querySelector('.about-text');
      if (aboutBox) {
          const tickSound = document.getElementById('tickSound');
          aboutBox.addEventListener('mouseenter', function() {
              document.querySelectorAll('.stat-number').forEach(c => c.classList.remove('counted'));
              animateCounters();
          });
          aboutBox.addEventListener('mouseleave', function() {
              document.querySelectorAll('.stat-number').forEach(counter => {
                  clearInterval(counter.dataset.timer);
                  counter.classList.remove('counting');
              });
              if (tickSound) {
                  tickSound.pause();
                  tickSound.currentTime = 0;
              }
          });
      }

      // ================================================================
      // 9. NAV INDICATOR
      // ================================================================
      const menuLinks = document.querySelectorAll('.nav-menu a');
      const sectionsToWatch = document.querySelectorAll('section[id]');
      const indicator = document.querySelector('.nav-indicator');

      function moveIndicator(activeLink) {
          if (!activeLink || !indicator) return;
          indicator.style.width = activeLink.offsetWidth + 'px';
          indicator.style.height = activeLink.offsetHeight + 'px';
          indicator.style.left = activeLink.offsetLeft + 'px';
          indicator.style.top = activeLink.offsetTop + 'px';
      }

      const sectionObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  const activeId = entry.target.getAttribute('id');
                  menuLinks.forEach(link => {
                      link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
                      if (link.classList.contains('active')) moveIndicator(link);
                  });
              }
          });
      }, { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0 });

      sectionsToWatch.forEach(section => sectionObserver.observe(section));

      window.addEventListener('resize', () => {
          const activeLink = document.querySelector('.nav-menu a.active');
          if (activeLink) moveIndicator(activeLink);
      });

      // ================================================================
      // 10. HOVER SOUND (DENGAN AUDIO CONTEXT)
      // ================================================================
      const hoverSoundElement = document.getElementById('hoverSound');
      if (hoverSoundElement) {
          let audioCtx = null;
          let audioBuffer = null;
          let isAudioReady = false;
          const volumeValue = 0.3;
          let pendingPlays = [];

          async function preloadHoverSound() {
              try {
                  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                  const response = await fetch(hoverSoundElement.src);
                  const arrayBuffer = await response.arrayBuffer();
                  audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                  isAudioReady = true;
                  console.log('[HOV] Siap diputar');
                  while (pendingPlays.length) pendingPlays.shift()();
              } catch (err) {
                  console.warn('[HOV] Gagal preload:', err);
              }
          }
          preloadHoverSound();

          function playHoverSound() {
              if (!isAudioReady || !audioCtx || !audioBuffer) {
                  pendingPlays.push(() => playHoverSound());
                  return;
              }
              if (audioCtx.state === 'suspended') {
                  audioCtx.resume().then(executePlay).catch(() => {});
                  return;
              }
              executePlay();
          }

          function executePlay() {
              if (!audioCtx || audioCtx.state !== 'running') return;
              const source = audioCtx.createBufferSource();
              const gain = audioCtx.createGain();
              gain.gain.value = volumeValue;
              source.buffer = audioBuffer;
              source.connect(gain);
              gain.connect(audioCtx.destination);
              source.start(0);
          }

          const HOVER_SELECTORS = [
              '.skill-card', '.tech-card', '.project-card', '.hero-buttons .btn',
              '.hero-social a', '.profile-wrapper', '#enterBtn'
          ].join(', ');

          document.querySelectorAll(HOVER_SELECTORS).forEach(el => {
              el.removeEventListener('mouseenter', playHoverSound);
              el.addEventListener('mouseenter', playHoverSound);
          });

          let warmupDone = false;
          function warmupAudioContext() {
              if (warmupDone) return;
              if (audioCtx && audioCtx.state === 'suspended') {
                  audioCtx.resume().then(() => {
                      while (pendingPlays.length && isAudioReady) pendingPlays.shift()();
                  }).catch(() => {});
              }
              warmupDone = true;
              ['mousemove', 'click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
                  document.removeEventListener(evt, warmupAudioContext);
              });
          }
          ['mousemove', 'click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
              document.addEventListener(evt, warmupAudioContext, { passive: true, once: false });
          });
      }

      // ================================================================
      // 11. MUSIC PLAYER (KANAN & KIRI) + PLAYLIST
      // ================================================================
      const bgMusic = document.getElementById('bgMusic');
      const musicToggle = document.getElementById('musicToggle');
      const volumeSlider = document.getElementById('volumeSlider');

      if (bgMusic && musicToggle && volumeSlider) {
          bgMusic.volume = volumeSlider.value;
          
          let musicUnlocked = false;
          const startMusicOnInteraction = () => {
              if (!siteEntered || musicUnlocked || !bgMusic) return; 
              bgMusic.play().then(() => {
                  musicUnlocked = true;
                  unlockEvents.forEach(evt => document.removeEventListener(evt, startMusicOnInteraction));
              }).catch(() => {});
          };
          const unlockEvents = ['click', 'mousemove', 'scroll', 'touchstart', 'keydown'];
          unlockEvents.forEach(evt => {
              document.addEventListener(evt, startMusicOnInteraction, { passive: true });
          });

          musicToggle.addEventListener('click', (e) => {
              e.stopPropagation();
              if (bgMusic.muted) {
                  bgMusic.muted = false;
                  musicToggle.classList.remove('muted');
                  musicToggle.innerHTML = '<i class="fas fa-music"></i>';
                  volumeSlider.value = bgMusic.volume;
              } else {
                  bgMusic.muted = true;
                  musicToggle.classList.add('muted');
                  musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                  volumeSlider.value = 0;
              }
          });

          volumeSlider.addEventListener('input', (e) => {
              const val = parseFloat(e.target.value);
              bgMusic.volume = val;
              if (val === 0) {
                  bgMusic.muted = true;
                  musicToggle.classList.add('muted');
                  musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
              } else {
                  bgMusic.muted = false;
                  musicToggle.classList.remove('muted');
                  musicToggle.innerHTML = '<i class="fas fa-music"></i>';
              }
          });
      }

      // NavCat walking animation
      const navCat = document.getElementById('navCat');
      const navLogo = document.querySelector('.nav-logo');
      const contactLink = document.querySelector('.nav-menu a[href="#contact"]');
      const navbarContainer = document.querySelector('.nav-container');

      if (navCat && navLogo && contactLink && navbarContainer) {
          let currentX = 0, direction = 1, speed = 1.5;
          function animateNavCat() {
              const containerRect = navbarContainer.getBoundingClientRect();
              const minX = navLogo.getBoundingClientRect().left - containerRect.left;
              const maxX = contactLink.getBoundingClientRect().left - containerRect.left;
              if (currentX <= 0) currentX = minX || 10;
              currentX += speed * direction;
              if (currentX >= maxX && direction === 1) {
                  direction = -1;
                  navCat.style.transform = `translateX(${currentX}px) scaleX(-1)`;
              } else if (currentX <= minX && direction === -1) {
                  direction = 1;
                  navCat.style.transform = `translateX(${currentX}px) scaleX(1)`;
              } else {
                  navCat.style.transform = `translateX(${currentX}px) scaleX(${direction === 1 ? 1 : -1})`;
              }
              requestAnimationFrame(animateNavCat);
          }
          animateNavCat();

          window.addEventListener('scroll', function() {
              const scrollY = window.pageYOffset || document.documentElement.scrollTop;
              navCat.classList.toggle('visible', scrollY > 50);
          }, { passive: true });
      }


      const commentForm = document.getElementById('commentForm');
      const commentsList = document.getElementById('commentsList');

      if (commentForm && commentsList) {
          commentForm.addEventListener('submit', function(e) {
              e.preventDefault();
              const nameInput = document.getElementById('commentName');
              const textInput = document.getElementById('commentText');
              const name = nameInput.value.trim();
              const text = textInput.value.trim();

              if (name && text) {
                  const commentCard = document.createElement('div');
                  commentCard.className = 'comment-card';
                  commentCard.innerHTML = `
                      <div class="comment-avatar"><i class="fas fa-user-astronaut"></i></div>
                      <div class="comment-body">
                          <h4>${name}</h4>
                          <p>${text}</p>
                          <span class="comment-time">Baru saja</span>
                      </div>
                  `;
                  commentsList.insertBefore(commentCard, commentsList.firstChild);
                  this.reset();

                  const btn = this.querySelector('button');
                  const originalHTML = btn.innerHTML;
                  btn.innerHTML = 'Komentar Terkirim! <i class="fas fa-check-circle"></i>';
                  btn.style.backgroundColor = '#4CAF50';
                  btn.style.color = '#fff';
                  btn.style.borderColor = '#4CAF50';
                  setTimeout(() => {
                      btn.innerHTML = originalHTML;
                      btn.style = '';
                  }, 3000);
              }
          });
      }

      // ================================================================
      // EFFECT PARTICLES LEAVES (ELEGANT, FEWER, LARGER & CINEMATIC)
      // ================================================================
      const canvasBack = document.getElementById('particleCanvas');
      const canvasFront = document.getElementById('particleCanvasFront');
      if (canvasBack) {
          const ctxBack = canvasBack.getContext('2d');
          const ctxFront = canvasFront ? canvasFront.getContext('2d') : null;

          let backParticles = [], frontParticles = [];

          const setAllCanvasSizes = () => {
              canvasBack.width = window.innerWidth;
              canvasBack.height = window.innerHeight;
              if (canvasFront) {
                  canvasFront.width = window.innerWidth;
                  canvasFront.height = window.innerHeight;
              }
          };
          setAllCanvasSizes();
          window.addEventListener('resize', setAllCanvasSizes);

          class Particle {
              constructor(canvas, options) {
                  this.canvas = canvas;
                  this.x = Math.random() * canvas.width;
                  this.y = Math.random() * canvas.height;
                  this.baseSize = options.baseSize || 10;
                  this.size = this.baseSize;
                  const baseSpeed = (Math.random() * options.speedRange) + options.minSpeed;
                  const randomAngle = Math.random() * Math.PI * 2;
                  this.vx = Math.cos(randomAngle) * baseSpeed;
                  this.vy = Math.sin(randomAngle) * baseSpeed;
                  this.opacity = (Math.random() * options.opacityRange) + options.minOpacity;
                  this.glow = options.glow || 0;
                  this.noiseSeed = Math.random() * 100;
                  this.angle = Math.random() * Math.PI * 2;
                  this.spinSpeed = (Math.random() * 0.02 - 0.01);
              }

              update() {
                  this.x += this.vx;
                  this.y += this.vy;
                  this.angle += this.spinSpeed;

                  if (window.scrollVelocity) {
                      const velocity = window.scrollVelocity;
                      const cappedVelocity = Math.max(-2.5, Math.min(2.5, velocity));
                      const parallaxFactor = this.baseSize * 0.04;
                      this.y -= cappedVelocity * parallaxFactor;
                      const swirlStrength = this.baseSize * 0.02;
                      this.x += Math.sin(this.y * 0.005 + this.noiseSeed) * cappedVelocity * swirlStrength;
                  }

                  const padding = this.size * 2 + 40;
                  if (this.y < -padding) this.y = this.canvas.height + padding;
                  if (this.y > this.canvas.height + padding) this.y = -padding;
                  if (this.x < -padding) this.x = this.canvas.width + padding;
                  if (this.x > this.canvas.width + padding) this.x = -padding;
              }

              draw(ctx) {
                  ctx.save();
                  ctx.translate(this.x, this.y);

                  const velocity = window.scrollVelocity || 0;
                  const clampedVelocityForEffect = Math.max(-1.2, Math.min(1.2, velocity));
                  const absVelocityForEffect = Math.abs(clampedVelocityForEffect);

                  if (absVelocityForEffect > 0.02) {
                      const windTilt = clampedVelocityForEffect * 0.15 + Math.sin(this.y * 0.005 + this.noiseSeed) * 0.2;
                      ctx.rotate(this.angle + windTilt);
                      const stretchFactor = 1 + (absVelocityForEffect * 0.15);
                      ctx.scale(stretchFactor, 1 / Math.sqrt(stretchFactor));
                  } else {
                      ctx.rotate(this.angle);
                  }

                  if (this.glow > 0) {
                      ctx.shadowBlur = this.glow;
                      ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity * 0.6})`;
                  }

                  ctx.beginPath();
                  ctx.moveTo(-this.size, 0);
                  ctx.quadraticCurveTo(0, -this.size * 0.48, this.size, 0);
                  ctx.quadraticCurveTo(0, this.size * 0.48, -this.size, 0);
                  ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                  ctx.fill();
                  ctx.restore();
              }
          }

          const initBackParticles = () => {
              backParticles = [];
              for (let i = 0; i < 12; i++) {
                  backParticles.push(new Particle(canvasBack, {
                      baseSize: Math.random() * 4 + 7,
                      speedRange: 0.2,
                      minSpeed: 0.05,
                      opacityRange: 0.15,
                      minOpacity: 0.1,
                      glow: 0
                  }));
              }
          };

          const initFrontParticles = () => {
              frontParticles = [];
              if (!canvasFront) return;
              for (let i = 0; i < 5; i++) {
                  frontParticles.push(new Particle(canvasFront, {
                      baseSize: Math.random() * 10 + 16,
                      speedRange: 0.15,
                      minSpeed: 0.04,
                      opacityRange: 0.25,
                      minOpacity: 0.2,
                      glow: 12
                  }));
              }
          };

          initBackParticles();
          initFrontParticles();

          const animateParticles = () => {
              const target = window.targetVelocity || 0;
              const current = window.currentVelocity || 0;
              const lerpFactor = Math.abs(target) > Math.abs(current) ? 0.15 : 0.04;
              window.currentVelocity += (target - current) * lerpFactor;
              window.scrollVelocity = window.currentVelocity;
              window.targetVelocity *= 0.92;

              ctxBack.clearRect(0, 0, canvasBack.width, canvasBack.height);
              if (ctxFront) ctxFront.clearRect(0, 0, canvasFront.width, canvasFront.height);

              backParticles.forEach(p => { p.update(); p.draw(ctxBack); });
              frontParticles.forEach(p => { p.update(); p.draw(ctxFront); });

              requestAnimationFrame(animateParticles);
          };
          animateParticles();
      }

      // ================================================================
      // CHATBOT WIDGET (bottom-left virtual assistant)
      // ================================================================
      (function () {
          const widget = document.getElementById('chatbotWidget');
          const toggleBtn = document.getElementById('chatbotToggleBtn');
          const closeBtn = document.getElementById('chatbotCloseBtn');
          const body = document.getElementById('chatbotBody');
          const quickWrap = document.getElementById('chatbotQuickReplies');
          const input = document.getElementById('chatbotInput');
          const sendBtn = document.getElementById('chatbotSendBtn');
          const menuWrap = document.getElementById('chatbotMenuWrap');
          const menuBtn = document.getElementById('chatbotMenuBtn');
          const panel = document.getElementById('chatbotPanel');
          const scrim = document.getElementById('chatbotScrim');
          const newChatBtn = document.getElementById('chatbotNewChatBtn');
          const endChatBtn = document.getElementById('chatbotEndChatBtn');
          const historyBtn = document.getElementById('chatbotHistoryBtn');

          if (!widget || !toggleBtn) return;

          function lang() {
              return localStorage.getItem('site_lang') === 'en' ? 'en' : 'id';
          }
          function t(key) {
              return (translations[lang()] && translations[lang()][key]) || translations.id[key] || '';
          }

          // Link kontak asli — dipake buat nampilin tombol langsung di chat
          const CONTACT_LINKS = {
              instagram: { label: 'Buka Instagram', url: 'https://www.instagram.com/dxtnn_', iconClass: 'fab fa-instagram' },
              tiktok: { label: 'Buka TikTok', url: 'https://www.tiktok.com/@risemss', iconClass: 'fab fa-tiktok' },
              whatsapp: { label: 'Chat WhatsApp', url: 'https://wa.me/6285281144792', iconClass: 'fab fa-whatsapp' },
              email: { label: 'Kirim Email', url: 'mailto:ibnudexton@gmail.com', iconClass: 'fas fa-envelope' },
          };

          // Deteksi platform mana yang ditanya, biar tombolnya spesifik (bukan nge-dump semua link)
          function detectContactLinks(text) {
              const lower = ' ' + text.toLowerCase() + ' ';
              const matched = [];
              if (lower.includes('instagram') || lower.includes(' ig ')) matched.push(CONTACT_LINKS.instagram);
              if (lower.includes('tiktok') || lower.includes(' tt ')) matched.push(CONTACT_LINKS.tiktok);
              if (lower.includes('whatsapp') || lower.includes(' wa ') || lower.includes('nomor') || lower.includes('telepon') || lower.includes('hp ')) matched.push(CONTACT_LINKS.whatsapp);
              if (lower.includes('email') || lower.includes('gmail') || lower.includes('e-mail')) matched.push(CONTACT_LINKS.email);
              // Gak nyebut platform spesifik tapi nanya kontak secara umum -> kasih semua
              if (matched.length === 0 && (lower.includes('kontak') || lower.includes('contact') || lower.includes('hubungi'))) {
                  return [CONTACT_LINKS.whatsapp, CONTACT_LINKS.instagram, CONTACT_LINKS.email];
              }
              return matched;
          }

          function addMessage(text, sender, i18nKey, links) {
              const msg = document.createElement('div');
              msg.className = 'chatbot-msg ' + sender;
              if (i18nKey) msg.setAttribute('data-i18n', i18nKey);
              body.appendChild(msg);

              const renderLinks = () => {
                  if (!links || !links.length) return;
                  const linkRow = document.createElement('div');
                  linkRow.className = 'chatbot-link-row';
                  links.forEach(link => {
                      const a = document.createElement('a');
                      a.href = link.url;
                      a.target = '_blank';
                      a.rel = 'noopener noreferrer';
                      a.className = 'chatbot-link-btn';
                      a.innerHTML = `<i class="${link.iconClass}"></i> ${link.label}`;
                      linkRow.appendChild(a);
                  });
                  body.appendChild(linkRow);
                  body.scrollTop = body.scrollHeight;
              };

              if (sender === 'bot') {
                  let i = 0;
                  const speed = 14;
                  (function typeChar() {
                      msg.textContent = text.slice(0, i);
                      body.scrollTop = body.scrollHeight;
                      i++;
                      if (i <= text.length) setTimeout(typeChar, speed);
                      else renderLinks();
                  })();
              } else {
                  msg.textContent = text;
              }
              body.scrollTop = body.scrollHeight;
          }

          function showTyping(callback) {
              const typing = document.createElement('div');
              typing.className = 'chatbot-typing';
              typing.innerHTML = '<span></span><span></span><span></span>';
              body.appendChild(typing);
              body.scrollTop = body.scrollHeight;
              setTimeout(() => {
                  typing.remove();
                  callback();
              }, 650 + Math.random() * 450);
          }

          // Riwayat chat sederhana, disimpan di localStorage
          function loadHistory() {
              try { return JSON.parse(localStorage.getItem('chatbot_history') || '[]'); }
              catch (e) { return []; }
          }
          function saveHistoryEntry(text) {
              const hist = loadHistory();
              hist.unshift({ text, time: Date.now() });
              localStorage.setItem('chatbot_history', JSON.stringify(hist.slice(0, 8)));
          }

          const QUICK_KEYS = ['chatbotQ1', 'chatbotQ2', 'chatbotQ3', 'chatbotQ4'];
          const ANSWER_MAP = {
              chatbotQ1: 'chatbotAns1',
              chatbotQ2: 'chatbotAns2',
              chatbotQ3: 'chatbotAns3',
              chatbotQ4: 'chatbotAns4',
          };

          function renderQuickReplies() {
              quickWrap.innerHTML = '';
              QUICK_KEYS.forEach(key => {
                  const btn = document.createElement('button');
                  btn.className = 'chatbot-quick-btn';
                  btn.setAttribute('data-i18n', key);
                  btn.textContent = t(key);
                  btn.addEventListener('click', () => handleUserInput(t(key), ANSWER_MAP[key]));
                  quickWrap.appendChild(btn);
              });
          }

          // Deteksi kata kunci buat balesan free-text (ID & EN sekaligus)
          const KEYWORD_MAP = [
              { keys: ['halo', 'hai', ' hi ', 'hello', 'pagi', 'siang', 'malam', 'hey'], answer: 'chatbotAnsGreeting' },
              { keys: ['makasih', 'terima kasih', 'thanks', 'thank you'], answer: 'chatbotAnsThanks' },
              { keys: ['kamu siapa', 'siapa kamu', 'who are you', 'kamu bot', 'are you a bot'], answer: 'chatbotAnsBotId' },
              { keys: ['tangerang'], answer: 'chatbotAnsLocation' },
              { keys: ['dimana ibnu', 'lokasi ibnu', 'alamat ibnu', 'ibnu dimana', 'ibnu tinggal', 'kamu dimana', 'kamu tinggal', 'domisili', 'where does ibnu', 'where is ibnu'], answer: 'chatbotAnsLocation' },
              { keys: ['sekolah ibnu', 'smk ibnu', 'pendidikan ibnu', 'lulusan ibnu', 'kuliah ibnu', 'ibnu sekolah', 'ibnu kuliah', 'ibnu lulusan', 'kamu sekolah', 'kamu kuliah', 'education of ibnu'], answer: 'chatbotAnsEducation' },
              { keys: ['pengalaman ibnu', 'pengalaman kamu', 'ibnu berapa tahun', 'ibnu experience', 'experience of ibnu'], answer: 'chatbotAnsExperience' },
              { keys: ['react', 'next', 'javascript', 'tailwind', 'php', 'laravel', 'mysql', 'firebase', 'flutter', 'dart', 'tech stack', 'teknologi', 'framework'], answer: 'chatbotAnsTech' },
              { keys: ['harga', 'biaya', 'price', 'order', 'jasa', 'sewa', 'hire'], answer: 'chatbotAnsOrder' },
              { keys: ['tentang ibnu', 'tentang kamu', 'tentang dirimu', 'siapa ibnu', 'siapa dexton', 'siapa itu ibnu', 'profil ibnu', 'profil kamu', 'about ibnu', 'about dexton', 'who is ibnu', 'who is dexton'], answer: 'chatbotAns1' },
              { keys: ['skill ibnu', 'skill kamu', 'keahlian ibnu', 'keahlian kamu', 'kemampuan ibnu', 'ibnu bisa apa', 'kamu bisa apa', 'expertise of ibnu'], answer: 'chatbotAns2' },
              { keys: ['proyek ibnu', 'project ibnu', 'karya ibnu', 'portofolio ibnu', 'portfolio ibnu', 'proyek kamu', 'project kamu', 'karya kamu', 'work of ibnu'], answer: 'chatbotAns3' },
              { keys: ['kontak', 'contact', 'hubungi', 'email', 'whatsapp', ' wa ', 'instagram', ' ig '], answer: 'chatbotAns4' },
              { keys: ['makanan favorit ibnu', 'hobi ibnu', 'umur ibnu', 'makanan favorit kamu', 'hobi kamu', 'umur kamu', 'age of ibnu', 'lahir ibnu', 'ulang tahun ibnu'], answer: 'chatbotAnsUnknownPersonal' },
          ];

          // Catatan: keyword di atas sengaja dianchor pake 'ibnu'/'kamu'/dll biar gak
          // asal nyamber pertanyaan soal orang/topik lain (misal "siapa soekarno").
          // Kalau gak ada anchor yang cocok, otomatis lolos ke askAI() di bawah,
          // dan backend AI sendiri yang nolak kalau emang di luar topik Ibnu Dexton.
          function detectAnswer(text) {
              const lower = ' ' + text.toLowerCase() + ' ';
              const found = KEYWORD_MAP.find(entry => entry.keys.some(k => lower.includes(k)));
              return found ? found.answer : null;
          }

          // Panggil backend AI HANYA kalau keyword lokal gak nemu jawaban (hemat token/biaya)
          async function askAI(userText) {
              try {
                  const res = await fetch('/api/chat', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ message: userText }),
                  });
                  const data = await res.json();
                  return data.reply || t('chatbotFallback');
              } catch (err) {
                  console.warn('[CHATBOT AI] Gagal manggil /api/chat:', err);
                  return t('chatbotFallback');
              }
          }

          function handleUserInput(displayText, forcedAnswerKey) {
              if (!displayText || !displayText.trim()) return;
              addMessage(displayText, 'user');
              saveHistoryEntry(displayText);
              if (input) input.value = '';

              const answerKey = forcedAnswerKey || detectAnswer(displayText);

              if (answerKey) {
                  // Ketemu di keyword map lokal -> gratis, gak kena API sama sekali
                  const links = answerKey === 'chatbotAns4' ? detectContactLinks(displayText) : null;
                  showTyping(() => addMessage(t(answerKey), 'bot', null, links));
              } else {
                  // Gak ketemu lokal -> baru lempar ke AI backend
                  showTyping(async () => {
                      const aiReply = await askAI(displayText);
                      const links = detectContactLinks(displayText);
                      addMessage(aiReply, 'bot', null, links.length ? links : null);
                  });
              }
          }

          let chatInitialized = false;
          function startFreshChat() {
              body.innerHTML = '';
              chatInitialized = true;
              addMessage(t('chatbotGreeting'), 'bot', 'chatbotGreeting');
              renderQuickReplies();
          }

          function openChat() {
              widget.classList.add('open');
              if (!chatInitialized) startFreshChat();
              setTimeout(() => input && input.focus(), 350);
          }

          function closeChat() {
              widget.classList.remove('open');
              closeMenu();
          }

          function closeMenu() {
              if (menuWrap) menuWrap.classList.remove('open');
              if (panel) panel.classList.remove('menu-open');
          }

          toggleBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              widget.classList.contains('open') ? closeChat() : openChat();
          });
          if (closeBtn) closeBtn.addEventListener('click', closeChat);

          if (menuBtn) {
              menuBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  const willOpen = !menuWrap.classList.contains('open');
                  menuWrap.classList.toggle('open', willOpen);
                  if (panel) panel.classList.toggle('menu-open', willOpen);
              });
          }
          if (scrim) scrim.addEventListener('click', closeMenu);
          if (newChatBtn) newChatBtn.addEventListener('click', () => { closeMenu(); startFreshChat(); });
          if (endChatBtn) endChatBtn.addEventListener('click', () => { chatInitialized = false; closeChat(); });
          if (historyBtn) {
              historyBtn.addEventListener('click', () => {
                  closeMenu();
                  const hist = loadHistory();
                  if (!hist.length) {
                      addMessage(t('chatbotNoHistory'), 'bot');
                      return;
                  }
                  const wrap = document.createElement('div');
                  wrap.className = 'chatbot-msg bot chatbot-history-list';
                  wrap.innerHTML = hist.map(h => `<div class="chatbot-history-item">${h.text}</div>`).join('');
                  body.appendChild(wrap);
                  body.scrollTop = body.scrollHeight;
              });
          }

          if (sendBtn) sendBtn.addEventListener('click', () => handleUserInput(input.value));
          if (input) {
              input.addEventListener('keydown', (e) => {
                  if (e.key === 'Enter') handleUserInput(input.value);
              });
          }

          document.addEventListener('click', (e) => {
              if (menuWrap && !menuWrap.contains(e.target)) closeMenu();
              if (widget.classList.contains('open') && !widget.contains(e.target)) closeChat();
          });
      })();

      console.log('[PORTAL] Semua modul selesai dimuat!');

      window.startMusicAfterEnter = function() {
          const bgMusic = document.getElementById('bgMusic'); 
          if (bgMusic) {
              console.log('[AUDIO] Memutar musik utama secara instan setelah Enter...');
              bgMusic.muted = false; 
              bgMusic.play()
                  .then(() => console.log('[AUDIO] Musik utama berhasil berputar!'))
                  .catch(error => console.log('[AUDIO] Playback terblokir:', error));
          } else {
              console.warn('[AUDIO] Elemen #bgMusic tidak ditemukan!');
          }
      };

    })();
  }, []);

  return (
    <>
      <canvas id="particleCanvas"></canvas>
      <canvas id="particleCanvasFront"></canvas>

      <div className="cursor-follower">
        <img src="/money-cash.gif" alt="Cursor Follower" id="cursorFollowerImg" />
      </div>

      {/* Cursor Follower Settings + Language Switcher (satu panel, dua grup terpisah) */}
      <div className="cf-settings" id="cfSettings">
        <button className="cf-settings-btn" id="cfSettingsBtn" data-i18n-aria="cfSettingsAria" aria-label="Pengaturan Cursor">
          <i className="fas fa-gear"></i>
        </button>
        <div className="cf-settings-menu" id="cfSettingsMenu">
          <button className="cf-settings-item" id="cfToggleBtn">
            <i className="fas fa-eye"></i> <span id="cfToggleLabel" data-i18n="cfToggleOff">Matiin</span>
          </button>
          <div className="cf-settings-divider"></div>
          <span className="cf-settings-title" data-i18n="cfChangeModel">Ganti Model</span>
          <div id="cfModelList"></div>

          <div className="cf-settings-divider"></div>
          <span className="cf-settings-title" data-i18n="langSectionTitle">Bahasa</span>
          <div id="cfLangList"></div>
        </div>
      </div>
      
      {/* Chatbot Widget (bottom-left) */}
      <div className="chatbot-widget" id="chatbotWidget">
        <div className="chatbot-panel" id="chatbotPanel">
          <div className="chatbot-header">
            <div className="chatbot-avatar"><i className="fas fa-robot"></i></div>
            <div className="chatbot-header-info">
              <strong data-i18n="chatbotName">Ibnu's Virtual Assistant</strong>
              <span className="chatbot-status">
                <span className="chatbot-status-dot"></span>
                <span data-i18n="chatbotStatus">Online</span>
              </span>
            </div>
            <div className="chatbot-menu-wrap" id="chatbotMenuWrap">
              <button className="chatbot-menu-btn" id="chatbotMenuBtn" data-i18n-aria="chatbotMenuAria" aria-label="Menu Chat">
                <i className="fas fa-ellipsis"></i>
              </button>
              <div className="chatbot-menu-dropdown" id="chatbotMenuDropdown">
                <button className="chatbot-menu-item" id="chatbotNewChatBtn">
                  <i className="fas fa-pen"></i> <span data-i18n="chatbotMenuNew">Mulai Chat Baru</span>
                </button>
                <button className="chatbot-menu-item" id="chatbotEndChatBtn">
                  <i className="fas fa-xmark"></i> <span data-i18n="chatbotMenuEnd">Akhiri Chat</span>
                </button>
                <button className="chatbot-menu-item" id="chatbotHistoryBtn">
                  <i className="fas fa-clock-rotate-left"></i> <span data-i18n="chatbotMenuHistory">Lihat Riwayat Chat</span>
                </button>
              </div>
            </div>
            <button className="chatbot-close" id="chatbotCloseBtn" aria-label="Close">
              <i className="fas fa-xmark"></i>
            </button>
          </div>

          <div className="chatbot-scrim" id="chatbotScrim"></div>

          <div className="chatbot-body" id="chatbotBody" data-lenis-prevent></div>

          <div className="chatbot-quick-replies" id="chatbotQuickReplies"></div>

          <div className="chatbot-input-row">
            <input
              type="text"
              className="chatbot-input"
              id="chatbotInput"
              data-i18n-placeholder="chatbotPlaceholder"
              placeholder="Tulis pesan..."
              autoComplete="off"
            />
            <button className="chatbot-send-btn" id="chatbotSendBtn" aria-label="Send">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>

        <button className="chatbot-toggle-btn" id="chatbotToggleBtn" data-i18n-aria="chatbotAria" aria-label="Buka Asisten Virtual">
          <i className="fas fa-comment-dots chatbot-icon-chat"></i>
          <i className="fas fa-xmark chatbot-icon-close"></i>
        </button>
      </div>

      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
      </div>

      {/* Loading Screen */}
      <div id="loader">
        <div className="loader-content">
          <h2 className="loader-title">Ibnu dexton</h2>
          <button id="enterBtn" className="enter-btn">
            <span>enter</span>
            <span className="enter-btn-icon"><i className="fas fa-arrow-right"></i></span>
          </button>
        </div>
      </div>

      {/* Navigation */}
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

      {/* Hero Section */}
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

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
                <h2 data-i18n="aboutHeader">Tentang Saya</h2>
                <div className="underline"></div>
          </div>
          <div className="about-content">
            <div className="about-text">
              <h3 data-i18n="aboutSubtitle">amateur nya tangerang</h3>
              <p data-i18n="aboutP1">Saya Ibnu Dexton, lulusan SMKN 5 Kota Tangerang dengan jurusan Desain Komunikasi Visual. Dengan passion dalam menciptakan desain yang bermakna, saya telah bekerja dengan berbagai klien dari berbagai industries.</p>
              <p data-i18n="aboutP2">Pendekatan saya adalah menggabungkan estetika modern dengan fungsi yang jelas, memastikan setiap proyek tidak hanya terlihat indah tetapi juga efektif dalam menyampaikan pesan.</p>
              <div className="about-stats">
                <div className="stat">
                  <span className="stat-number" data-target="20">0+</span>
                  <span className="stat-label" data-i18n="statProjects">Proyek Selesai</span>
                </div>
                <div className="stat">
                  <span className="stat-number" data-target="15">0+</span>
                  <span className="stat-label" data-i18n="statClients">Klien Puas</span>
                </div>
                <div className="stat">
                  <span className="stat-number" data-target="4">0</span>
                  <span className="stat-label" data-i18n="statYears">Tahun Pengalaman</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img src="/black-cat.gif" alt="Black Cat" className="about-cat-gif" />
              <div className="about-img-wrapper">
                <img src="/GARUDA PS 2026.jpg" alt="About Ibnu" />
              </div>
            </div>
          </div>
          <audio id="tickSound" src="/counting.MP3" preload="auto"></audio>
        </div>
      </section>

      {/* Skills Section */}
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

      {/* Tech Stack Section */}
      <section id="techstack" className="techstack">
        <div className="container">
          <div className="section-header">
            <h2 data-i18n="techstackHeader">Tech Stack</h2>
            <div className="underline"></div>
          </div>
          <div className="tech-grid">
            <div className="tech-card">
              <div className="tech-card-top">
                <span className="tech-category tag-frontend">Frontend</span>
                <span className="tech-version">v18.2</span>
              </div>
              <div className="tech-icon"><img src="https://cdn.simpleicons.org/react/61DAFB" alt="React" loading="lazy" /></div>
              <h3>React</h3>
              <p className="tech-desc" data-i18n="techReactDesc">Jadi tulang punggung hampir semua UI yang saya bangun—component-based, gampang di-reuse, dan enak dipadukan dengan state management ringan.</p>
            </div>

            <div className="tech-card">
              <div className="tech-card-top">
                <span className="tech-category tag-framework">Framework</span>
                <span className="tech-version">v14.0</span>
              </div>
              <div className="tech-icon"><img src="https://cdn.simpleicons.org/nextdotjs/ffffff" alt="Next.js" loading="lazy" /></div>
              <h3>Next.js</h3>
              <p className="tech-desc" data-i18n="techNextDesc">Andalan untuk proyek yang butuh performa lebih—SSR dan routing bawaannya bikin loading halaman terasa instan tanpa konfigurasi ribet.</p>
            </div>

            <div className="tech-card">
              <div className="tech-card-top">
                <span className="tech-category tag-language">Language</span>
                <span className="tech-version">ES6+</span>
              </div>
              <div className="tech-icon"><img src="https://cdn.simpleicons.org/javascript/F7DF1E" alt="JavaScript" loading="lazy" /></div>
              <h3>JavaScript</h3>
              <p className="tech-desc" data-i18n="techJsDesc">Bahasa yang paling sering saya sentuh tiap hari—dari logika interaktif kecil sampai integrasi API, selalu jadi lem penghubung antar teknologi lain.</p>
            </div>

            <div className="tech-card">
              <div className="tech-card-top">
                <span className="tech-category tag-uilib">UI Lib</span>
                <span className="tech-version">v3.4</span>
              </div>
              <div className="tech-icon"><img src="https://cdn.simpleicons.org/tailwindcss/38BDF8" alt="Tailwind CSS" loading="lazy" /></div>
              <h3>Tailwind</h3>
              <p className="tech-desc" data-i18n="techTailwindDesc">Bikin proses styling jauh lebih cepat tanpa bolak-balik file CSS terpisah—utility class-nya cocok banget buat iterasi desain yang gesit.</p>
            </div>

            <div className="tech-card">
              <div className="tech-card-top">
                <span className="tech-category tag-language">Language</span>
                <span className="tech-version">v8.2</span>
              </div>
              <div className="tech-icon"><img src="https://cdn.simpleicons.org/php/8892BF" alt="PHP" loading="lazy" /></div>
              <h3>PHP</h3>
              <p className="tech-desc" data-i18n="techPhpDesc">Fondasi logika server-side yang saya pakai sejak awal belajar backend—stabil, dokumentasinya luas, dan tetap relevan untuk banyak proyek nyata.</p>
            </div>

            <div className="tech-card">
              <div className="tech-card-top">
                <span className="tech-category tag-backend">Backend</span>
                <span className="tech-version">v10.0</span>
              </div>
              <div className="tech-icon"><img src="https://cdn.simpleicons.org/laravel/FF2D20" alt="Laravel" loading="lazy" /></div>
              <h3>Laravel</h3>
              <p className="tech-desc" data-i18n="techLaravelDesc">Framework favorit untuk merapikan struktur backend—Eloquent dan routing-nya bikin saya bisa fokus ke logika bisnis, bukan boilerplate.</p>
            </div>

            <div className="tech-card">
              <div className="tech-card-top">
                <span className="tech-category tag-database">Database</span>
                <span className="tech-version">v8.0</span>
              </div>
              <div className="tech-icon"><img src="https://cdn.simpleicons.org/mysql/4479A1" alt="MySQL" loading="lazy" /></div>
              <h3>MySQL</h3>
              <p className="tech-desc" data-i18n="techMysqlDesc">Tempat saya menaruh kepercayaan untuk data yang butuh relasi jelas dan query yang terstruktur rapi di balik layar setiap aplikasi.</p>
            </div>

            <div className="tech-card">
              <div className="tech-card-top">
                <span className="tech-category tag-baas">BaaS</span>
                <span className="tech-version">Latest</span>
              </div>
              <div className="tech-icon"><img src="https://cdn.simpleicons.org/firebase/FFCA28" alt="Firebase" loading="lazy" /></div>
              <h3>Firebase</h3>
              <p className="tech-desc" data-i18n="techFirebaseDesc">Solusi cepat saat proyek butuh autentikasi atau database real-time tanpa harus bangun server sendiri dari nol.</p>
            </div>

            <div className="tech-card">
              <div className="tech-card-top">
                <span className="tech-category tag-mobile">Mobile</span>
                <span className="tech-version">v3.19</span>
              </div>
              <div className="tech-icon"><img src="https://cdn.simpleicons.org/flutter/02569B" alt="Flutter" loading="lazy" /></div>
              <h3>Flutter</h3>
              <p className="tech-desc" data-i18n="techFlutterDesc">Pilihan saya untuk masuk ke dunia mobile—satu codebase bisa jalan di Android dan iOS, hemat waktu tanpa mengorbankan tampilan.</p>
            </div>

            <div className="tech-card">
              <div className="tech-card-top">
                <span className="tech-category tag-core">Core</span>
                <span className="tech-version">v3.0</span>
              </div>
              <div className="tech-icon"><img src="https://cdn.simpleicons.org/dart/0175C2" alt="Dart" loading="lazy" /></div>
              <h3>Dart</h3>
              <p className="tech-desc" data-i18n="techDartDesc">Bahasa di balik setiap widget Flutter yang saya susun—null safety-nya bikin aplikasi mobile lebih jarang crash saat runtime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
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

      {/* Contact Section */}
      <section id="contact" className="contact reveal-init">
        <div className="container">
          <div className="section-header">
            <h2 data-i18n="contactHeader">Hubungi Saya</h2>
            <div className="underline"></div>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>ibnudexton@gmail.com</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+62 852 8114 4792</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span data-i18n="contactLocation">Tangerang, Indonesia</span>
              </div>
              <div className="contact-social">
                <a href="https://www.instagram.com/dxtnn_" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="https://www.tiktok.com/@risemss" target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok"></i></a>
                <a href="https://github.com/detonnn" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                <a href="https://wa.me/6285281144792" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>

            <form className="contact-form" id="contactForm">
              <div className="input-group">
                <input type="text" id="contactName" placeholder=" " required />
                <label htmlFor="contactName" data-i18n="formNameLabel">Nama Lengkap</label>
              </div>
              <div className="input-group">
                <input type="email" id="contactEmail" placeholder=" " required />
                <label htmlFor="contactEmail" data-i18n="formEmailLabel">Email</label>
              </div>
              <div className="input-group">
                <input type="text" id="contactSubject" placeholder=" " />
                <label htmlFor="contactSubject" data-i18n="formSubjectLabel">Subjek</label>
              </div>
              <div className="input-group">
                <textarea id="contactMessage" rows="5" placeholder=" " required></textarea>
                <label htmlFor="contactMessage" data-i18n="formMessageLabel">Pesan Anda...</label>
              </div>
              <button type="submit" className="btn btn-primary btn-animate"><span data-i18n="formSendBtn">Kirim Pesan</span> <i className="fas fa-paper-plane"></i></button>
            </form>
          </div>

          {/* Comments Section */}
          <div className="comments-section reveal-init">
            <h3 data-i18n="commentsHeader">Apa Kata Pengunjung</h3>
            <div className="comments-list" id="commentsList">
              <div className="comment-card">
                <div className="comment-avatar"><i className="fas fa-user-astronaut"></i></div>
                <div className="comment-body">
                  <h4>Rangga Desainer</h4>
                  <p data-i18n="comment1Text">Gila, interfacenya smooth banget bro! Terutama efek transisi pas ngescroll. Semangat terus karyanya 🔥</p>
                  <span className="comment-time" data-i18n="comment1Time">1 jam yang lalu</span>
                </div>
              </div>
            </div>

            <form id="commentForm" className="comment-form">
              <h4 data-i18n="commentFormHeader">Tinggalkan Jejakmu</h4>
              <div className="form-row">
                <div className="input-group">
                  <input type="text" id="commentName" placeholder=" " required />
                  <label htmlFor="commentName" data-i18n="commentNameLabel">Nama Kamu</label>
                </div>
              </div>
              <div className="input-group">
                <textarea id="commentText" rows="2" placeholder=" " required></textarea>
                <label htmlFor="commentText" data-i18n="commentTextLabel">Komentar mantapmu...</label>
              </div>
              <button type="submit" className="btn btn-secondary btn-animate"><span data-i18n="commentSendBtn">Kirim Komentar</span> <i className="fas fa-comment-dots"></i></button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p data-i18n="footerText">&copy; 2026 Ibnu Dexton. All rights reserved.</p>
        </div>
      </footer>

      {/* AUDIO SOUNDTRACK — single track: no pole (Don Toliver) */}
      <audio id="bgMusic" src="/pole.mp3" preload="auto" />
      
      <div className="music-controller">
        <div className="volume-popover">
          <span className="track-title" id="miniTrackTitle">no pole - Don Toliver</span>
          <input type="range" id="volumeSlider" min="0" max="1" step="0.05" defaultValue="0.4" />
        </div>
        <button id="musicToggle" className="music-btn" data-i18n-title="musicToggleTitle" title="Mute/Unmute Musik">
          <i className="fas fa-music"></i>
        </button>
      </div>

      <audio id="hoverSound" src="/hov.MP3" preload="auto" />
    </>
  );
}

export default App;