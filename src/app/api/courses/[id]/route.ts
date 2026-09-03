import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: { orderBy: { order: "asc" } },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const user = await getCurrentUser();
  let enrollment = null;
  if (user) {
    enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
      select: { id: true, status: true, completedAt: true },
    });
  }

  return NextResponse.json({ course, enrollment });
}
