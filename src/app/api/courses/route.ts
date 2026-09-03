import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      language: true,
      imageUrl: true,
    },
  });

  return NextResponse.json({ courses });
}
