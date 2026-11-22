# Instruksi untuk agent AI

Situs yang live ada di `emdash-starter/` (Astro + EmDash di Cloudflare Workers). Beranda ada di
`emdash-starter/src/home.html`. Baca `README.md` dan `HANDOFF.md` dulu. File `index.html` di root adalah arsip
versi 1 dan tidak dipakai situs live.

## Aturan dari pemilik (Restu)

- **Jangan merombak desain.** Struktur, urutan section, layout, interaksi dan warna beranda adalah dasar yang
  dipilih pemilik. Ubah hanya bagian yang diminta. Perombakan total pernah ditolak dan dikembalikan.
- **Tunjukkan dulu daftar perubahan** sebelum mengubah banyak hal, lalu tunggu persetujuan.
- Situs harus tetap terlihat modern saat dirapikan.
- Warna merek tetap: Heritage Blue `#002e62` dan Lime `#d0f600` (token di `:root`).

## Batas isi

- Jangan mengarang angka, testimoni, alamat atau nomor kontak. Data kontak ada di objek `ARENKA` di bagian bawah
  `home.html`; JSON-LD di `index.astro` membacanya dari sana.
- Angka statistik hanya boleh angka yang bisa dibuktikan pemilik (sebaiknya dengan periode, misalnya "sejak Januari 2026").
- Testimoni adalah chat asli pelanggan yang sedikit disunting; catatan "disunting untuk privasi" harus tetap ada.
- Gambar armada berlogo Arenka (pesawat, kapal) dipertahankan atas keputusan pemilik.
- Jangan menyalin teks, foto, angka, testimoni atau kontak milik lomiles.com.

## Cara cek setelah mengubah

- `cd emdash-starter && pnpm run build` harus lolos.
- Cek beranda di lebar 1440 px dan 390 px: tidak ada scroll ke samping, tidak ada error di console.
- Cek interaksi: dropdown navigasi, menu mobile, tab Cara kerja, carousel testimoni, formulir kontak,
  dialog bantuan (juga saat banner cookie tampil), tombol "Jeda animasi".
- **Push ke `main` = tayang ke produksi** (Cloudflare Workers Builds). Kerjakan di branch lain, cek build dan tampilan,
  baru gabungkan ke `main`. Catat perubahan di `HANDOFF.md`.
