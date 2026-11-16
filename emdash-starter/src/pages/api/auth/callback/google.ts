export const prerender = false;

import { env } from "cloudflare:workers";
import {
  cookieNames,
  createSessionToken,
  decodeJwtPayload,
  googleClientId,
  googleClientSecret,
  sessionMaxAge,
  siteBase,
  upsertUser,
} from "../../../../lib/auth";

export async function GET({ request, cookies, redirect }: any) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error");
  if (err) return redirect("/masuk?error=" + encodeURIComponent(err), 302);

  const expected = cookies.get(cookieNames.state)?.value;
  cookies.delete(cookieNames.state, { path: "/" });
  if (!code || !state || !expected || state !== expected) {
    return redirect("/masuk?error=state", 302);
  }

  try {
  // Tukar authorization code dengan token.
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: googleClientId(),
      client_secret: googleClientSecret(),
      redirect_uri: siteBase() + "/api/auth/callback/google",
      grant_type: "authorization_code",
    }).toString(),
  });
  if (!tokenRes.ok) {
    return redirect("/masuk?error=token", 302);
  }
  const tokens: any = await tokenRes.json();
  const idToken = tokens.id_token as string | undefined;
  const claims = idToken ? decodeJwtPayload(idToken) : null;
  if (!claims || !claims.sub || !claims.email) {
    return redirect("/masuk?error=profile", 302);
  }

  const user = await upsertUser((env as any).DB, {
    sub: String(claims.sub),
    email: String(claims.email),
    name: claims.name ? String(claims.name) : "",
    picture: claims.picture ? String(claims.picture) : "",
  });

  const token = await createSessionToken({
    uid: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    marking: user.marking_code,
  });
  cookies.set(cookieNames.session, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAge,
  });
  return redirect("/dashboard", 302);
  } catch (e: any) {
    console.error("auth/callback error:", e && (e.stack || e.message || String(e)));
    return redirect("/masuk?error=auth", 302);
  }
}
