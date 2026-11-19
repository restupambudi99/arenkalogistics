(() => {
  const key = "arenka-cookie-notice-v1";
  try {
    if (localStorage.getItem(key) === "accepted") return;
  } catch {}

  const style = document.createElement("style");
  style.textContent = `
    .arenka-cookie-notice{position:fixed;z-index:1000;inset:auto 16px 16px;max-width:680px;margin-left:auto;padding:16px 18px;display:flex;align-items:center;gap:18px;border:1px solid rgba(255,255,255,.18);border-radius:16px;background:rgba(0,27,58,.97);color:#fff;box-shadow:0 14px 38px rgba(0,20,45,.25);font:14px/1.5 Inter,Segoe UI,Arial,sans-serif}
    .arenka-cookie-notice p{margin:0;flex:1}.arenka-cookie-notice a{color:#d0f600;text-underline-offset:3px}
    .arenka-cookie-notice button{flex:none;border:0;border-radius:10px;background:#d0f600;color:#002e62;padding:11px 15px;font-family:inherit;font-size:14px;line-height:1.2;font-weight:700;cursor:pointer}
    .arenka-cookie-notice button:focus-visible,.arenka-cookie-notice a:focus-visible{outline:3px solid #fff;outline-offset:3px}
    @media(max-width:560px){.arenka-cookie-notice{inset:auto 12px 12px;gap:12px;padding:14px;border-radius:14px;font-size:13px}.arenka-cookie-notice button{padding:10px 12px;white-space:nowrap}}
  `;
  document.head.append(style);

  const notice = document.createElement("aside");
  notice.className = "arenka-cookie-notice";
  notice.setAttribute("role", "region");
  notice.setAttribute("aria-label", "Pemberitahuan cookie");
  notice.innerHTML = '<p>Kami memakai cookie penting untuk fungsi dasar, seperti sesi login. <a href="/privasi">Baca Kebijakan Privasi</a>.</p><button type="button">Terima &amp; tutup</button>';
  notice.querySelector("button").addEventListener("click", () => {
    try { localStorage.setItem(key, "accepted"); } catch {}
    notice.remove();
  });
  document.body.append(notice);
})();
