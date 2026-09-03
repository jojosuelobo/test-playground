import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  const isValid = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !isValid) {
    return NextResponse.json(
      { error: "invalid_credentials", message: "Email ou senha inválidos." },
      { status: 401 }
    );
  }

  await setSessionCookie(user.id, user.email);

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email },
  });
}
