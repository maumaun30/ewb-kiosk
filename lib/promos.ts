import { cache } from "react";
import type { Promo } from "@/lib/types";

// --- Auth helpers ---

function getBasicAuthHeader(): string {
  const auth = Buffer.from(
    `${process.env.API_BASIC_USER}:${process.env.API_BASIC_PASS}`,
  ).toString("base64");
  return `Basic ${auth}`;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getJwtAuthHeader(): Promise<string> {
  const now = Date.now();

  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return `Bearer ${cachedToken.value}`;
  }

  // Step 1: login to get session cookie
  const loginRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login?_format=json`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: process.env.API_BASIC_USER,
        pass: process.env.API_BASIC_PASS,
      }),
    },
  );

  if (!loginRes.ok) throw new Error("JWT login failed");

  const sessionCookie = loginRes.headers.get("set-cookie");

  // Step 2: exchange session for JWT token
  const tokenRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/jwt/token`,
    {
      headers: { Cookie: sessionCookie ?? "" },
    },
  );

  if (!tokenRes.ok) throw new Error("Failed to fetch JWT token");

  const { token } = await tokenRes.json();

  // Decode expiry from JWT payload (no verification needed server-side here)
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64url").toString(),
  );

  cachedToken = { value: token, expiresAt: payload.exp * 1000 };

  return `Bearer ${token}`;
}

async function getAuthHeader(): Promise<string> {
  return process.env.API_AUTH_MODE === "jwt"
    ? getJwtAuthHeader()
    : getBasicAuthHeader();
}

// --- API fetchers ---

async function drupalFetch(path: string, next: NextFetchRequestConfig) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`,
    {
      headers: { Authorization: await getAuthHeader() },
      next,
    },
  );

  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);

  return res.json();
}

export const getPromos = cache(async (): Promise<Promo[]> => {
  return drupalFetch("/api/promos", { revalidate: 60 });
});

export const getPromo = cache(async (nid: string): Promise<Promo> => {
  const data = await drupalFetch(`/api/promos/${nid}`, { revalidate: 300 });
  return data[0];
});