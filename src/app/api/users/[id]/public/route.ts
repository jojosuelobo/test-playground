import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      headline: true,
      bio: true,
      websiteUrl: true,
      facebookUsername: true,
      instagramUsername: true,
      linkedinUrl: true,
      tiktokUsername: true,
      xUsername: true,
      youtubeUsername: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const completedEnrollments = await prisma.enrollment.findMany({
    where: { userId: id, status: "COMPLETED" },
    orderBy: { completedAt: "desc" },
    include: { course: { select: { id: true, title: true, language: true } } },
  });

  return NextResponse.json({
    profile: user,
    completedCourses: completedEnrollments.map((enrollment) => ({
      id: enrollment.course.id,
      title: enrollment.course.title,
      language: enrollment.course.language,
      completedAt: enrollment.completedAt,
    })),
  });
}
