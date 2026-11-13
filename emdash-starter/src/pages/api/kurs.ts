export const prerender = false;

// Kurs 1 CNY (Yuan) ke IDR dari pasar, lalu ditambah margin agar tetap untung.
// Website ikut naik/turun mengikuti kurs, tetapi selalu di atas kurs pasar (Google).
const MARGIN = 1.025; // +2,5%

const SOURCES = [
  { url: "https://open.er-api.com/v6/latest/CNY", pick: (j) => j && j.rates && j.rates.IDR },
  { url: "https://api.frankfurter.app/latest?from=CNY&to=IDR", pick: (j) => j && j.rates && j.rates.IDR },
];

export async function GET() {
  let base = 0;
  let source = "";
  for (const s of SOURCES) {
    try {
      const res = await fetch(s.url, {
        headers: { accept: "application/json" },
        cf: { cacheTtl: 10800, cacheEverything: true },
      });
      if (!res.ok) continue;
      const data = await res.json();
      const value = Number(s.pick(data));
      if (value > 0) { base = value; source = s.url; break; }
    } catch (err) { /* coba sumber berikutnya */ }
  }

  if (!base) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 503,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    });
  }

  const kurs = Math.round(base * MARGIN);
  const kursText = new Intl.NumberFormat("id-ID").format(kurs);
  const body = JSON.stringify({
    ok: true,
    kurs,
    kursText,
    base: Math.round(base * 100) / 100,
    marginPct: 2.5,
    source,
    updated: new Date().toISOString(),
  });

  return new Response(body, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=1800, s-maxage=10800",
    },
  });
}

