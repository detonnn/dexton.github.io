// api/chat.js
// Vercel Serverless Function — backend AI buat "Ibnu's Virtual Assistant"
// Manggil 9Router (proxy lokal/tunnel, OpenAI-compatible) bukan OpenAI langsung.
// API key JANGAN pernah ditulis di sini. Set di Vercel Dashboard:
// Project Settings -> Environment Variables -> ROUTER_API_KEY (dan ROUTER_BASE_URL)

// ==== ISI DATA DIRI DI SINI (dipakai AI biar jawabannya akurat & personal) ====
const PROFILE_FACTS = `
Nama: Ibnu Dexton
Umur: 19 tahun
Domisili: Tangerang, Indonesia
Pendidikan: Mahasiswa aktif di Universitas Pamulang
Keluarga: Anak pertama dari 2 bersaudara
Makanan favorit: Nasi goreng dan ayam geprek Sabana
Hobi: Mencari hal-hal baru (eksplorasi/eksperimen hal baru) dan bersepeda
Game: Red Dead Redemption 2 , Clair Obscur:Expedition 33 , Dark soul III  ,Ghost Of Yotei , Diablo V , Roblox dan beberapa game indie&party
Keahlian: Desain grafis (Adobe Illustrator/Photoshop), UI/UX, sedikit front-end (React, Tailwind)
Pengalaman: Magang 3 bulan di percetakan/online shop (Azka Print), pernah bikin brand fashion lokal (Attics)
Kontak: ibnudexton@gmail.com, WhatsApp +62 852-8114-4792, Instagram @dxtnn_, GitHub detonnn
Kepribadian & hal personal lain: jawab santai kalau relevan, kalau tidak tahu jawabannya, bilang jujur tidak tahu — jangan ngarang.
`.trim();

const SYSTEM_PROMPT = `
Kamu adalah asisten virtual pribadi milik Ibnu Dexton di portofolio websitenya.
ATURAN KETAT:
1. Kamu HANYA boleh menjawab pertanyaan seputar Ibnu Dexton: profil, skill, proyek, pengalaman, cara kontak, atau hal personal ringan (makanan favorit, hobi, dll) SELAMA datanya ada di CONTEXT di bawah.
2. Kalau ditanya hal di luar topik Ibnu Dexton (coding umum, PR sekolah, topik random, dll), tolak dengan sopan dan arahkan balik ke topik seputar Ibnu Dexton.
3. Kalau informasi yang ditanya tidak ada di CONTEXT, jujur bilang tidak tahu / belum ada datanya — jangan mengarang fakta.
4. Jawab singkat, maksimal 2-3 kalimat, gaya santai tapi sopan, boleh pakai Bahasa Indonesia atau Inggris mengikuti bahasa user.

CONTEXT tentang Ibnu Dexton:
${PROFILE_FACTS}
`.trim();

// Base URL proxy 9Router. WAJIB di-override via env ROUTER_BASE_URL di Vercel
// pake URL tunnel/Tailscale publik (localhost gak akan pernah nyambung dari Vercel).
const ROUTER_BASE_URL = process.env.ROUTER_BASE_URL || 'http://localhost:20128/v1/chat/completions';
// Ganti sesuai model gratis yang mau dipake di 9Router (cek daftar model di dashboard-nya)
const ROUTER_MODEL = process.env.ROUTER_MODEL || 'gemini-2.5-flash-lite';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Pesan kosong' });
  }

  // Batasi panjang input biar gak boros token / disalahgunakan
  const safeMessage = message.slice(0, 300);

  const apiKey = process.env.ROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ROUTER_API_KEY belum di-set di Environment Variables' });
  }

  // Timeout manual biar function gak nunggu tanpa kepastian kalau tunnel/9Router lemot
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s

  try {
    const response = await fetch(ROUTER_BASE_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: ROUTER_MODEL,
        stream: false, // PENTING: paksa non-streaming, kalau enggak balesannya format SSE "data: {...}" dan bikin JSON.parse gagal
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: safeMessage },
        ],
        max_tokens: 150, // dijaga kecil biar hemat
        temperature: 0.6,
      }),
    });

    clearTimeout(timeoutId);

    const rawText = await response.text();

    if (!response.ok) {
      console.error('9Router error:', rawText);
      return res.status(502).json({ error: 'Gagal menghubungi AI' });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      // Kalau masih ke-parse gagal, kemungkinan besar 9Router tetep ngirim format streaming
      console.error('Gagal parse response 9Router (kemungkinan format streaming):', rawText.slice(0, 300));
      return res.status(502).json({ error: 'Format balasan AI tidak dikenali' });
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || 'Maaf, aku belum bisa jawab itu.';

    return res.status(200).json({ reply });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.error('Chat API timeout: request ke 9Router kelamaan');
      return res.status(504).json({ error: 'AI kelamaan jawab, coba lagi' });
    }
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan di server' });
  }
}
