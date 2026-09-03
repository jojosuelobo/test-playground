import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { upsertRatingSchema } from "@/lib/validation/course";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;

  const ratings = await prisma.rating.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true } } },
  });

  const average =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length
      : 0;

  const user = await getCurrentUser();
  let myRating: number | null = null;
  let isEnrolled = false;

  if (user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
    });
    isEnrolled = Boolean(enrollment);

    const existing = ratings.find((rating) => rating.userId === user.id);
    myRating = existing?.score ?? null;
  }

  return NextResponse.json({
    ratings,
    average,
    count: ratings.length,
    myRating,
    isEnrolled,
  });
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

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
  });
  if (!enrollment) {
    return NextResponse.json(
      {
        error: "not_enrolled",
        message: "Você precisa estar matriculado para avaliar este curso.",
      },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = upsertRatingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const rating = await prisma.rating.upsert({
    where: { userId_courseId: { userId: user.id, courseId } },
    update: { score: parsed.data.score },
    create: { userId: user.id, courseId, score: parsed.data.score },
  });

  return NextResponse.json({ rating });
}
