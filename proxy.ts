import { NextResponse, type NextRequest } from "next/server";

/**
 * HTTP Basic Auth gate for the whole site.
 *
 * Enabled only when both BASIC_AUTH_USER and BASIC_AUTH_PASSWORD are set,
 * so local dev and environments without them stay open.
 */

function safeEqual(a: string, b: string) {
  // Constant-time comparison to avoid leaking credential length/prefix via timing
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function isAuthorized(header: string | null, user: string, pass: string) {
  if (!header?.startsWith("Basic ")) {
    return false;
  }
  let decoded: string;
  try {
    decoded = atob(header.slice("Basic ".length).trim());
  } catch {
    return false;
  }
  const sep = decoded.indexOf(":");
  if (sep === -1) {
    return false;
  }
  const givenUser = decoded.slice(0, sep);
  const givenPass = decoded.slice(sep + 1);
  // Evaluate both so timing doesn't reveal which part was wrong
  const userOk = safeEqual(givenUser, user);
  const passOk = safeEqual(givenPass, pass);
  return userOk && passOk;
}

export function proxy(request: NextRequest) {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASSWORD;

  if (!user || !pass) {
    return NextResponse.next();
  }

  if (isAuthorized(request.headers.get("authorization"), user, pass)) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="EastWest Kiosk", charset="UTF-8"' },
  });
}

export const config = {
  // Everything except Next.js build assets and image optimizer output
  matcher: ["/((?!_next/static|_next/image).*)"],
};
