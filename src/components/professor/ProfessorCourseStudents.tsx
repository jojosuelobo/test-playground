"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

type Enrollment = {
  id: string;
  status: "ENROLLED" | "COMPLETED";
  enrolledAt: string;
  completedAt: string | null;
  user: { id: string; name: string; email: string };
};

type CourseStudentsData = {
  course: { id: string; title: string; language: string };
  enrollments: Enrollment[];
};

export default function ProfessorCourseStudents({ courseId }: { courseId: string }) {
  const [data, setData] = useState<CourseStudentsData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/professor/courses/${courseId}/enrollments`).then(async (res) => {
      if (cancelled) return;
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      const json = await res.json();
      setData(json);
    });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  if (notFound) {
    return (
      <p data-testid="professor-course-not-found" className="text-gray-500">
        Curso não encontrado.
      </p>
    );
  }

  if (!data) {
    return (
      <p data-testid="professor-course-students-loading" className="text-gray-500">
        Carregando...
      </p>
    );
  }

  return (
    <div data-testid="professor-course-students-page">
      <Link
        href="/professor"
        data-testid="professor-back-link"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-indigo-600"
      >
        ← Voltar ao Painel do Professor
      </Link>

      <h1
        data-testid="professor-course-students-title"
        className="mb-1 text-2xl font-bold text-gray-900"
      >
        {data.course.title}
      </h1>
      <p className="mb-8 text-gray-600">
        {data.enrollments.length}{" "}
        {data.enrollments.length === 1 ? "aluno matriculado" : "alunos matriculados"}
      </p>

      {data.enrollments.length === 0 ? (
        <p
          data-testid="professor-course-students-empty-state"
          className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500"
        >
          Nenhum aluno matriculado neste curso ainda.
        </p>
      ) : (
        <ul data-testid="professor-students-list" className="space-y-2">
          {data.enrollments.map((enrollment) => (
            <li
              key={enrollment.id}
              data-testid={`professor-student-item-${enrollment.id}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              <div>
                <p
                  data-testid={`professor-student-name-${enrollment.id}`}
                  className="font-medium text-gray-900"
                >
                  {enrollment.user.name}
                </p>
                <p
                  data-testid={`professor-student-email-${enrollment.id}`}
                  className="text-sm text-gray-500"
                >
                  {enrollment.user.email}
                </p>
              </div>
              <Badge
                color={enrollment.status === "COMPLETED" ? "green" : "amber"}
                testId={`professor-student-status-${enrollment.id}`}
              >
                {enrollment.status === "COMPLETED" ? "Concluído" : "Em andamento"}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
