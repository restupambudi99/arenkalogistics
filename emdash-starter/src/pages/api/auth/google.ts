export const prerender = false;

import { cookieNames, googleClientId, randomState, siteBase } from "../../../lib/auth";

export async function GET({ cookies, redirect }: any) {
  const state = randomState();
  cookies.set(cookieNames.state, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  const params = new URLSearchParams({
    client_id: googleClientId(),
    redirect_uri: siteBase() + "/api/auth/callback/google",
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });
  return redirect("https://accounts.google.com/o/oauth2/v2/auth?" + params.toString(), 302);
}
