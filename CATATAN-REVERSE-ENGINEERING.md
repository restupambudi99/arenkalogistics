# Bedah lomiles.com → situs Arenka

Dibedah: 11 November 2026, dari halaman yang terbuka di browser Claude + salinan statisnya.

## Temuan arsitektur (lomiles.com)
- Shell **Next.js** (Turbopack, Tailwind, font Inter) hanya merender header + garis gradien.
- Badan halaman = file **HTML statis** `/htmls/index.html` yang dimuat lewat `<iframe>` fixed layar penuh (z-index 40).
- Halaman statis: `styles.css` (~76 KB, token warna di `:root`), `app.js` (~43 KB, JavaScript murni tanpa framework), font Inter woff2 di-preload.
- Pelacakan: Google Tag Manager, Google Analytics 4, Google Ads, Meta Pixel, Cloudflare Insights.
- Section berurutan: hero → layanan (Titip Beli/Titip Kirim + jalur LCL/FCL/Udara) → strip USP → pita angka → keunggulan (6) → cara kerja (tab 2 × 5 langkah) → CTA tengah → testimoni (carousel autoplay) → FAQ (11 accordion) → CTA akhir → kontak (form → pesan WhatsApp) → footer.
- Interaksi di `app.js`: dropdown nav (`<details>`), drawer mobile (`<dialog>`), subjudul hero berganti otomatis, slider kartu, tab proses, count-up angka, carousel testimoni + jeda, dialog bantuan yang muncul sendiri sekali per sesi, form yang menyusun pesan WhatsApp, tombol "Jeda animasi", UI login berbasis cookie.

## Yang dipakai ulang vs. ditulis baru
| Dipakai ulang (struktur) | Ditulis/dibuat baru |
|---|---|
| Urutan section, layout grid, pola interaksi, alur form → WhatsApp | Semua teks (bahasa sendiri), logo Arenka, semua ilustrasi (SVG), palet warna |
| Nama layanan generik industri: Titip Beli, Titip Kirim, OEM/ODM, Pengadaan, LCL, FCL | Angka, testimoni, kontak, kebijakan → **placeholder** (tidak menyalin klaim Lomiles) |

## Pemetaan warna
| Lomiles | Arenka |
|---|---|
| Navy `#071d56` (judul, pita gelap) | Heritage Blue `#002e62` |
| Blue `#0c43e9` (aksen judul, tombol) | Heritage Blue + stabilo Lime di bawah teks |
| Orange `#ff841f` (CTA, pita angka, pita CTA) | Lime `#d0f600` dengan teks Heritage Blue |
| Footer `#051a45` | `#001b3a` |

## Yang harus diisi sebelum online
Buka `index.html`, cari `const ARENKA = {` di bagian bawah, lalu isi:
- `whatsapp` (format 628xxxx), `email`, `instagram`, `address`, `hours`, `kurs`, `loginUrl`, `coverage`, `reviewSource`
- `stats` (7 angka), `policy` (minimum beli/kirim, estimasi udara/laut, waktu pembayaran, klaim)
- `testimonials`: hanya ulasan asli pelanggan
Semua placeholder bergaris putus-putus di halaman akan terganti otomatis.
Tambahkan juga kode pelacakan (Meta Pixel / GA4) sendiri bila diperlukan; versi ini tidak memuat pelacak apa pun.
