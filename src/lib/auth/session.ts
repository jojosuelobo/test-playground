import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
  signSessionToken,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/auth/jwt";

export async function setSessionCookie(userId: string, email: string) {
  const token = await signSessionToken({ sub: userId, email });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionPayload(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getCurrentUser() {
  const session = await getSessionPayload();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.sub } });
}
