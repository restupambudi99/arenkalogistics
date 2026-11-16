export const prerender = false;

import { cookieNames } from "../../../lib/auth";

export async function GET({ cookies, redirect }: any) {
  cookies.delete(cookieNames.session, { path: "/" });
  return redirect("/", 302);
}

export async function POST({ cookies, redirect }: any) {
  cookies.delete(cookieNames.session, { path: "/" });
  return redirect("/", 302);
}
