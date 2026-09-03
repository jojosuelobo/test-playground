import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { createCommentSchema } from "@/lib/validation/course";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;

  const comments = await prisma.comment.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ comments });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { id: courseId } = await params;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return NextResponse.json({ error: "course_not_found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.create({
    data: {
      courseId,
      userId: user.id,
      body: parsed.data.body,
    },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
