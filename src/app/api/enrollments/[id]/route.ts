import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { id } = await params;

  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: {
      course: {
        include: { modules: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!enrollment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (enrollment.userId !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  return NextResponse.json({ enrollment });
}
