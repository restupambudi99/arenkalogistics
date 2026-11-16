import { env } from "cloudflare:workers";

// Util auth sederhana untuk login Google (OpenID Connect) di Cloudflare Workers.
// Sesi disimpan sebagai cookie bertanda-tangan (HMAC-SHA256) agar tanpa state server.

const SESSION_COOKIE = "arenka_session";
const STATE_COOKIE = "arenka_oauth_state";
const SESSION_TTL = 60 * 60 * 24 * 14; // 14 hari

export interface SessionUser {
  uid: string;
  email: string;
  name: string;
  picture?: string;
  marking: string; // contoh: RESTU-3349
  exp: number;
}

function b64urlEncode(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlToBytes(str: string): Uint8Array {
  const s = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function strToBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

async function hmacKey(): Promise<CryptoKey> {
  const secret = (env as any).AUTH_SECRET as string;
  return crypto.subtle.importKey(
    "raw",
    strToBytes(secret || "dev-insecure-secret"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(data: string): Promise<string> {
  const key = await hmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, strToBytes(data));
  return b64urlEncode(new Uint8Array(sig));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function createSessionToken(user: Omit<SessionUser, "exp">): Promise<string> {
  const payload: SessionUser = { ...user, exp: Math.floor(Date.now() / 1000) + SESSION_TTL };
  const body = b64urlEncode(strToBytes(JSON.stringify(payload)));
  const sig = await sign(body);
  return body + "." + sig;
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionUser | null> {
  if (!token || token.indexOf(".") < 0) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = await sign(body);
  if (!timingSafeEqual(sig, expected)) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(body))) as SessionUser;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const cookieNames = { session: SESSION_COOKIE, state: STATE_COOKIE };
export const sessionMaxAge = SESSION_TTL;

export function randomState(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return b64urlEncode(b);
}

export function siteBase(): string {
  return ((env as any).EMDASH_SITE_URL as string) || "https://arenkalogistics.com";
}

export function googleClientId(): string {
  return (env as any).GOOGLE_CLIENT_ID as string;
}
export function googleClientSecret(): string {
  return (env as any).GOOGLE_CLIENT_SECRET as string;
}

// Decode payload JWT id_token (sudah tepercaya karena dari token endpoint Google via TLS).
export function decodeJwtPayload(jwt: string): any {
  const parts = jwt.split(".");
  if (parts.length < 2) return null;
  try {
    return JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[1])));
  } catch {
    return null;
  }
}

// Pastikan skema tabel users ada (lazy migration).
export async function ensureSchema(db: any): Promise<void> {
  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE, name TEXT, picture TEXT, marking_code TEXT, created_at INTEGER, last_login INTEGER)",
    )
    .run();
}

function makeMarking(name: string, email: string): string {
  const base = (name || email || "USER").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8) || "USER";
  const num = Math.floor(1000 + Math.random() * 9000);
  return base + "-" + num;
}

export interface DbUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  marking_code: string;
}

// Upsert user dari profil Google, menghasilkan marking_code tetap per akun.
export async function upsertUser(
  db: any,
  profile: { sub: string; email: string; name?: string; picture?: string },
): Promise<DbUser> {
  await ensureSchema(db);
  const now = Math.floor(Date.now() / 1000);
  const existing = await db.prepare("SELECT id, email, name, picture, marking_code FROM users WHERE id = ?").bind(profile.sub).first();
  if (existing) {
    await db
      .prepare("UPDATE users SET name = ?, picture = ?, last_login = ? WHERE id = ?")
      .bind(profile.name || existing.name, profile.picture || existing.picture, now, profile.sub)
      .run();
    return existing as DbUser;
  }
  const marking = makeMarking(profile.name || "", profile.email);
  await db
    .prepare("INSERT INTO users (id, email, name, picture, marking_code, created_at, last_login) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(profile.sub, profile.email, profile.name || "", profile.picture || "", marking, now, now)
    .run();
  return { id: profile.sub, email: profile.email, name: profile.name || "", picture: profile.picture || "", marking_code: marking };
}
