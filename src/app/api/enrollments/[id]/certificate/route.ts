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
    include: { course: true },
  });

  if (!enrollment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (enrollment.userId !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (enrollment.status !== "COMPLETED" || !enrollment.completedAt) {
    return NextResponse.json(
      { error: "not_completed", message: "Curso ainda não foi concluído." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    userName: user.name,
    courseTitle: enrollment.course.title,
    completedAt: enrollment.completedAt,
  });
}
