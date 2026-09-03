import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { createEnrollmentSchema } from "@/lib/validation/enrollment";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    orderBy: { enrolledAt: "desc" },
    include: {
      course: { select: { id: true, title: true, language: true } },
    },
  });

  return NextResponse.json({ enrollments });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createEnrollmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { courseId } = parsed.data;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return NextResponse.json({ error: "course_not_found" }, { status: 404 });
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "already_enrolled", enrollment: existing },
      { status: 409 }
    );
  }

  const enrollment = await prisma.enrollment.create({
    data: { userId: user.id, courseId },
  });

  return NextResponse.json({ enrollment }, { status: 201 });
}
