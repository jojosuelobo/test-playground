import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  if (user.role !== "TEACHER") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      language: true,
      _count: {
        select: {
          enrollments: true,
        },
      },
      enrollments: {
        where: { status: "COMPLETED" },
        select: { id: true },
      },
    },
  });

  const result = courses.map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    language: course.language,
    enrolledCount: course._count.enrollments,
    completedCount: course.enrollments.length,
  }));

  return NextResponse.json({ courses: result });
}
