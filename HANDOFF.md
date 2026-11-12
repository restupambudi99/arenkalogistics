# Hand-off: Migrasi Arenka Logistics ke EmDash + Cloudflare Workers

Dokumen ini merangkum status deployment agar agen AI lain bisa melanjutkan tanpa mengulang kerja. Semua perubahan ada di branch `emdash-seo`.

## Ringkasan tujuan

Memindahkan website Arenka Logistics ke Astro + EmDash CMS di Cloudflare Workers, dengan domain `arenkalogistics.com` (HTTPS/SSL), tanpa mengubah tampilan visual, dengan penyesuaian struktur untuk SEO/GEO/AEO. Target paket gratis (free plan) Cloudflare.

## Project lokal

- Repo: `H:\Arenka Logistics\repo` (GitHub: `restupambudi99/arenkalogistics`, branch `emdash-seo`).
- Project EmDash/Astro: `emdash-starter/` (EmDash 1.4.0, Astro 7.4.8, `@astrojs/cloudflare` 14.4.6, wrangler 4.159.0).
- Build/deploy: `pnpm run deploy` (menjalankan `astro build && wrangler deploy`).
- `emdash-starter/.env` hanya berisi `EMDASH_ENCRYPTION_KEY` (gitignored). Backup kunci ini; tanpa kunci, secret plugin terenkripsi tidak bisa dibaca.

## Resource Cloudflare (akun restupambudi1991@gmail.com)

- Account ID: `29a64e44df77067dcaa8e10197e9ac8e`
- Worker: `arenka-logistics` (custom domain `arenkalogistics.com` + `www.arenkalogistics.com`, cron `* * * * *`)
- D1 database `arenka-logistics`, UUID `8159a06b-1e5a-430b-b4d4-cd0ecec012b9` (binding `DB`)
- R2 bucket `arenka-logistics-media` (binding `MEDIA`, region APAC, Standard)
- KV namespace `arenka-logistics-session` id `4e04dd6611ce4e7b9534b9d0ea8f985d` (binding `SESSION`) — sudah ditulis manual ke `wrangler.jsonc` karena namespace sudah ada sebelumnya.
- Zone `arenkalogistics.com` id `9d59329b6261ec99efa0860cee5fbc0f`, SSL mode Full, sertifikat aktif. DNS AAAA `arenkalogistics.com` dan `www` diproxy ke Worker (record hosting lama `2.57.91.91` sudah dihapus).

## Yang sudah selesai

- Homepage v1 di-port ke Astro sebagai HTML utuh (`src/home.html` + `src/pages/index.astro`) tanpa mengubah tampilan.
- D1, R2, KV, IMAGES binding terpasang; Worker ter-deploy ke dua custom domain dengan HTTPS.
- Migrasi database EmDash: semula berhenti di `035` dengan migration lock macet. Lock sudah diambil alih dan SEMUA migrasi `001`..`091` diterapkan. `pnpm emdash migrate --check` lulus (Pending: none).
- Backup D1 pra-migrasi ada di `%TEMP%\arenka-before-migrations-20261111.sql` (mesin lokal, bukan di repo).
- `INDEXING_ENABLED=true` di `wrangler.jsonc` agar halaman indexable (robots index,follow + `X-Robots-Tag` dilepas untuk produksi).
- Perbaikan 404: `src/middleware.ts` dan `src/pages/index.astro` semula memakai `Astro.locals.runtime.env` yang sudah dihapus di Astro v6+, menyebabkan semua route render error lalu 404. Diganti ke `import { env } from "cloudflare:workers"` lalu di-deploy ulang (Version ID `86cc7a52-631c-4f14-babb-d0d171c7278a`).
- Setup Wizard EmDash SELESAI (2026-11-12): `emdash:setup_complete` dan `emdash:seed_complete` = true. Admin dibuat (`restupambudi1991@gmail.com`, role 50). Site title/tagline/logo tersimpan; logo terunggah ke R2 (upload media terverifikasi). Cron scheduler berjalan.
- Verifikasi live (HTTPS 200): homepage render penuh, `www` 301 ke apex, `/_emdash/admin/` 302 ke `/login` (butuh login), `robots.txt` & `sitemap.xml` 200. Situs TERBIT di https://arenkalogistics.com.
- Catatan: EmDash 1.5.0 sudah rilis (project memakai 1.4.0). Upgrade opsional via `emdash` + deploy ulang.

## Menjalankan migrasi EmDash (untuk agen berikutnya)

`emdash migrate` butuh `CLOUDFLARE_API_TOKEN` (login wrangler saja tidak cukup). Token bisa diambil dari sesi wrangler yang sudah login tanpa menyimpannya:

```powershell
$arenkaAuth = (pnpm wrangler auth token --json | ConvertFrom-Json)
$env:CLOUDFLARE_API_TOKEN = $arenkaAuth.token
try {
  pnpm emdash migrate --check --account-id 29a64e44df77067dcaa8e10197e9ac8e --d1 8159a06b-1e5a-430b-b4d4-cd0ecec012b9
} finally { Remove-Item Env:CLOUDFLARE_API_TOKEN -ErrorAction SilentlyContinue }
```

Target fingerprint: `6801293a482d45cc936fde5d9128a429eaf87b2ef959c59339a019fa8574156c`.

## Langkah berikutnya (TODO)

1. (SELESAI) Verifikasi HTTPS: homepage & admin tidak lagi 404; situs live. Catatan: HTTPS dari shell Windows sesi ini bisa gagal (Schannel `SEC_E_NO_CREDENTIALS`) — pakai `node -e "fetch(...)"` atau browser.
2. (SELESAI) Setup Wizard EmDash: admin & seed selesai, situs terbit.
3. Lanjutkan penyesuaian struktur untuk SEO/GEO/AEO tanpa mengubah tampilan: structured data JSON-LD (Organization/LocalBusiness + WebSite) di homepage, lengkapi Open Graph/Twitter, isi sitemap setelah ada artikel.

## Catatan paket gratis

- D1 free: 5 GB total, 5 juta baris baca/hari, 100k tulis/hari. R2 free: 10 GB-bulan, 1M Class A, 10M Class B/bulan. KV free untuk sesi. Semua masuk free plan. R2 sudah diaktifkan oleh pemilik akun.
