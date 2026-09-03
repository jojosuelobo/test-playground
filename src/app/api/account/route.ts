import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { updateAccountSchema } from "@/lib/validation/account";

const ACCOUNT_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  headline: true,
  bio: true,
  websiteUrl: true,
  facebookUsername: true,
  instagramUsername: true,
  linkedinUrl: true,
  tiktokUsername: true,
  xUsername: true,
  youtubeUsername: true,
} as const;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const account = await prisma.user.findUnique({
    where: { id: user.id },
    select: ACCOUNT_SELECT,
  });

  return NextResponse.json({ account });
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateAccountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const toNullable = (value: string | undefined) => (value ? value : null);

  const account = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      phone: toNullable(data.phone),
      headline: toNullable(data.headline),
      bio: toNullable(data.bio),
      websiteUrl: toNullable(data.websiteUrl),
      facebookUsername: toNullable(data.facebookUsername),
      instagramUsername: toNullable(data.instagramUsername),
      linkedinUrl: toNullable(data.linkedinUrl),
      tiktokUsername: toNullable(data.tiktokUsername),
      xUsername: toNullable(data.xUsername),
      youtubeUsername: toNullable(data.youtubeUsername),
    },
    select: ACCOUNT_SELECT,
  });

  return NextResponse.json({ account });
}
