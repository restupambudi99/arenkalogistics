export const prerender = false;

import { cookieNames, verifySessionToken } from "../../lib/auth";

function initials(name: string, email: string): string {
  const src = (name || email || "").trim();
  if (!src) return "MA";
  const parts = src.split(/\s+/).filter(Boolean);
  const two = (parts[0]?.[0] || "") + (parts[1]?.[0] || parts[0]?.[1] || "");
  return two.toUpperCase() || "MA";
}

export async function GET({ cookies }: any) {
  const token = cookies.get(cookieNames.session)?.value;
  const user = await verifySessionToken(token);
  const headers = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
  if (!user) {
    return new Response(JSON.stringify({ ok: false }), { status: 401, headers });
  }
  const firstName = (user.name || "").split(/\s+/)[0] || "Member";
  return new Response(
    JSON.stringify({
      ok: true,
      user: {
        name: user.name || user.email,
        firstName,
        email: user.email,
        picture: user.picture || "",
        marking: user.marking,
        initials: initials(user.name, user.email),
      },
    }),
    { status: 200, headers },
  );
}
