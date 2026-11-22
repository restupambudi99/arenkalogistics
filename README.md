# Arenka Logistics: website

Website **Arenka Logistics** (https://arenkalogistics.com), jasa import China ke Indonesia
(Titip Beli, Titip Kirim, OEM/ODM, Pengadaan; jalur laut LCL, laut FCL, udara).

## Struktur repo

| Lokasi | Isi |
|---|---|
| `emdash-starter/` | **Situs yang live.** Astro + EmDash CMS di Cloudflare Workers (D1, R2, KV). |
| `emdash-starter/src/home.html` | Beranda: HTML, CSS dan JavaScript utuh, termasuk objek data `ARENKA` di bagian bawah. |
| `emdash-starter/src/pages/index.astro` | Membungkus `home.html`: canonical, Open Graph, JSON-LD (Organization, WebSite, FAQPage). |
| `emdash-starter/src/pages/` | Halaman lain: artikel (`posts/`), `kalkulator-cbm`, `privasi`, `ketentuan`, `masuk`, `dashboard`, `sitemap-static.xml`, `robots.txt`. |
| `emdash-starter/public/assets/img/` | Foto dan gambar situs. |
| `HANDOFF.md` | Status deployment, resource Cloudflare, dan riwayat perubahan. Baca sebelum bekerja. |
| `index.html`, `assets/`, `reference/` | Versi 1 statis (arsip dan pembanding visual). Tidak dipakai situs live. |

## Menjalankan dan deploy

```bash
cd emdash-starter
pnpm install
pnpm run build        # cek build
pnpm run deploy       # astro build && wrangler deploy (butuh wrangler login ke akun pemilik)
```

Deploy dilakukan manual dari mesin pemilik. Push ke GitHub saja tidak menayangkan perubahan.

## Identitas merek

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--heritage` | `#002e62` Heritage Blue | judul, pita gelap, tombol utama |
| `--lime` | `#d0f600` Lime | tombol CTA, aksen, pita terang |
| Font | Inter (Google Fonts) | semua teks, berat 400/500/600 |

Warna didefinisikan di blok `:root` di `home.html`.

## Asal desain

Struktur beranda berasal dari bedah (reverse engineering) lomiles.com dengan skill REA; teks ditulis ulang untuk Arenka.
Pada 2026-11-22 beranda dirapikan dengan skill unslop (polish mode) tanpa mengubah layout dan palet.
Detail di [`CATATAN-REVERSE-ENGINEERING.md`](CATATAN-REVERSE-ENGINEERING.md) dan [`HANDOFF.md`](HANDOFF.md).

## Foto pihak ketiga

| File | Sumber |
|---|---|
| `assets/img/feature-gudang-800.webp`, `-1400.webp` (versi 1) | [Stacked Boxes in a Warehouse](https://www.pexels.com/photo/stacked-boxes-in-a-warehouse-10834810/) oleh Ihsan Adityawarman, Pexels |

Aturan untuk agent AI ada di [`AGENTS.md`](AGENTS.md).
