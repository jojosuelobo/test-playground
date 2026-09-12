import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { signupSchema } from "@/lib/validation/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, password, phone } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "email_taken", message: "Este email já está em uso." },
      { status: 409 }
    );
  }

  // Simulates a slow signup (e.g. a heavy provisioning step) for the Cypress "Waits" demo.
  const randomDelayMs = 5000 + Math.floor(Math.random() * 5000);
  await new Promise((resolve) => setTimeout(resolve, randomDelayMs));

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      phone: phone ? phone : null,
    },
  });

  await setSessionCookie(user.id, user.email);

  return NextResponse.json(
    {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
    { status: 201 }
  );
}
