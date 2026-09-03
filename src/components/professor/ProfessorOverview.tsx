"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { getCourseVisual } from "@/lib/courseVisuals";

type ProfessorCourse = {
  id: string;
  slug: string;
  title: string;
  language: string;
  enrolledCount: number;
  completedCount: number;
};

export default function ProfessorOverview() {
  const [courses, setCourses] = useState<ProfessorCourse[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/professor/courses")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setCourses(data.courses);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (courses === null) {
    return (
      <p data-testid="professor-loading" className="text-gray-500">
        Carregando...
      </p>
    );
  }

  return (
    <div data-testid="professor-page">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Painel do Professor</h1>
      <p className="mb-8 text-gray-600">
        Visão geral dos cursos e alunos matriculados na plataforma.
      </p>

      <div data-testid="professor-course-list" className="space-y-2">
        {courses.map((course) => {
          const visual = getCourseVisual(course.language);
          return (
            <Link
              key={course.id}
              href={`/professor/${course.id}`}
              data-testid={`professor-course-item-${course.id}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 transition hover:border-indigo-300 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 flex-none items-center justify-center rounded-md ${visual.tileBg} text-base`}
                >
                  {visual.emoji}
                </span>
                <span
                  data-testid={`professor-course-title-${course.id}`}
                  className="font-medium text-gray-900"
                >
                  {course.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge color="indigo" testId={`professor-course-enrolled-count-${course.id}`}>
                  {course.enrolledCount}{" "}
                  {course.enrolledCount === 1 ? "aluno" : "alunos"}
                </Badge>
                <Badge color="green" testId={`professor-course-completed-count-${course.id}`}>
                  {course.completedCount} concluído
                  {course.completedCount === 1 ? "" : "s"}
                </Badge>
                <span className="text-gray-400">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
