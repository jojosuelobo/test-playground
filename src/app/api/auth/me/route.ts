import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie, getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

export async function DELETE() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  await prisma.user.delete({ where: { id: user.id } });
  await clearSessionCookie();

  return NextResponse.json({ ok: true });
}
