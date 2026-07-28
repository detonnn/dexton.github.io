// api/chat.js
// Vercel Serverless Function — backend AI buat "Ibnu's Virtual Assistant"
// API key JANGAN pernah ditulis di sini. Set di Vercel Dashboard:
// Project Settings -> Environment Variables -> OPENAI_API_KEY

// ==== ISI DATA DIRI DI SINI (dipakai AI biar jawabannya akurat & personal) ====
const PROFILE_FACTS = `
Nama: Ibnu Dexton
Umur: 19 tahun
Domisili: Tangerang, Indonesia
Pendidikan: Mahasiswa aktif di Universitas Pamulang
Keluarga: Anak pertama dari 2 bersaudara
Makanan favorit: Nasi goreng dan ayam geprek Sabana
Hobi: Mencari hal-hal baru (eksplorasi/eksperimen hal baru) dan bersepeda
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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY belum di-set di Environment Variables' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: safeMessage },
        ],
        max_tokens: 150, // dijaga kecil biar hemat
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI error:', errText);
      return res.status(502).json({ error: 'Gagal menghubungi AI' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'Maaf, aku belum bisa jawab itu.';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan di server' });
  }
}
