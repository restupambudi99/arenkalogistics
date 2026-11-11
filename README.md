# Arenka Logistics: website

Landing page satu file untuk **Arenka Logistics**, jasa import China ke Indonesia
(Titip Beli, Titip Kirim, OEM/ODM, Pengadaan; jalur laut LCL, laut FCL, udara).

## Cara melihat

Buka `index.html` di browser. Tidak ada build step dan tidak ada dependensi selain font dari Google Fonts.
Semua CSS, JavaScript, ikon dan ilustrasi (SVG) ada di dalam file itu.

## Asal desain

Struktur, urutan section dan interaksinya hasil bedah (reverse engineering) halaman lomiles.com dengan
skill REA. Teks ditulis ulang untuk Arenka. Teks, foto, angka, testimoni dan kontak milik Lomiles tidak disalin.
Detail temuan ada di [`CATATAN-REVERSE-ENGINEERING.md`](CATATAN-REVERSE-ENGINEERING.md).

## Identitas merek

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--heritage` | `#002e62` Heritage Blue | judul, pita gelap, tombol utama |
| `--lime` | `#d0f600` Lime | tombol CTA, aksen, pita terang |
| Font | Inter (Google Fonts) | semua teks |

Semua warna didefinisikan di blok `:root` paling atas `<style>`.

## Urutan section

Header (dropdown Layanan & Tentang, kurs, tombol Masuk, menu mobile) → Hero → Layanan (Titip Beli, Titip Kirim,
jalur LCL/FCL/Udara) → Strip keunggulan → Pita angka → Kenapa Arenka → Cara kerja (tab Titip Kirim / Titip Beli,
5 langkah) → CTA tengah → Testimoni (carousel) → FAQ → CTA akhir → Kontak (formulir → pesan WhatsApp) → Footer →
tombol konsultasi melayang + dialog bantuan.

## Mengisi data asli

Semua data yang belum ada tampil sebagai penanda bergaris putus-putus. Isi di objek `ARENKA` di bagian bawah
`index.html`; penanda di halaman terganti otomatis:

- `whatsapp` (format `628xxxxxxxxxx`), `email`, `instagram`, `address`, `hours`
- `kurs`, `loginUrl`, `coverage`, `reviewSource`
- `stats`: angka pesanan, kiriman, kota, paket, pelanggan, tepat waktu, kepuasan
- `policy`: minimum beli, minimum kirim, estimasi udara/laut, waktu pembayaran, klaim
- `testimonials`: hanya ulasan asli pelanggan

## Status

Versi 1. Lihat [`AGENTS.md`](AGENTS.md) untuk aturan dan tugas berikutnya.
