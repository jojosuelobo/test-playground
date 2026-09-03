"use client";

import { useEffect, useState } from "react";
import CourseCard, { type CourseSummary } from "@/components/marketplace/CourseCard";

export default function CourseGrid() {
  const [courses, setCourses] = useState<CourseSummary[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/courses")
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
      <div
        data-testid="marketplace-loading"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-xl border border-gray-200 bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <p
        data-testid="marketplace-empty-state"
        className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500"
      >
        Nenhum curso disponível no momento.
      </p>
    );
  }

  return (
    <div
      data-testid="marketplace-grid"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
