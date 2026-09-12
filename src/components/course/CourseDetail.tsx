"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import Tabs from "@/components/ui/Tabs";
import EnrollButton from "@/components/course/EnrollButton";
import CourseComments from "@/components/course/CourseComments";
import CourseRatings from "@/components/course/CourseRatings";
import { getCourseVisual } from "@/lib/courseVisuals";

type Module = {
  id: string;
  title: string;
  order: number;
};

type CourseDetailData = {
  course: {
    id: string;
    slug: string;
    title: string;
    description: string;
    language: string;
    modules: Module[];
  };
  enrollment: { id: string; status: "ENROLLED" | "COMPLETED" } | null;
};

type TabId = "modules" | "ratings" | "comments";

const tabs: { id: TabId; label: string; testId: string }[] = [
  { id: "modules", label: "Módulos", testId: "course-tab-modules" },
  { id: "ratings", label: "Avaliações", testId: "course-tab-ratings" },
  { id: "comments", label: "Comentários", testId: "course-tab-comments" },
];

export default function CourseDetail({ courseId }: { courseId: string }) {
  const [data, setData] = useState<CourseDetailData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("modules");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/courses/${courseId}`).then(async (res) => {
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
      <p data-testid="course-not-found" className="text-gray-500">
        Curso não encontrado.
      </p>
    );
  }

  if (!data) {
    return (
      <div data-testid="course-detail-loading" className="animate-pulse">
        <div className="mb-4 h-6 w-24 rounded-full bg-gray-200" />
        <div className="mb-3 h-9 w-2/3 rounded bg-gray-200" />
        <div className="mb-6 h-16 rounded bg-gray-200" />
      </div>
    );
  }

  const { course, enrollment } = data;
  const visual = getCourseVisual(course.language);

  return (
    <div data-testid="course-detail">
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`flex h-12 w-12 flex-none items-center justify-center rounded-lg ${visual.tileBg} text-2xl`}
        >
          {visual.emoji}
        </span>
        <Badge color={visual.badgeColor}>{course.language}</Badge>
      </div>
      <h1
        data-testid="course-detail-title"
        className="mb-3 text-3xl font-bold text-gray-900"
      >
        {course.title}
      </h1>
      <p data-testid="course-detail-description" className="mb-6 text-gray-600">
        {course.description}
      </p>

      <div className="mb-8">
        <EnrollButton
          courseId={course.id}
          courseLanguage={course.language}
          initialStatus={enrollment?.status ?? null}
        />
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />

      {activeTab === "modules" && (
        <ul data-testid="course-module-list" className="space-y-2">
          {course.modules.map((module) => (
            <li
              key={module.id}
              data-testid={`course-module-item-${module.order}`}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
            >
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                {module.order}
              </span>
              {module.title}
            </li>
          ))}
        </ul>
      )}

      {activeTab === "ratings" && <CourseRatings courseId={course.id} />}

      {activeTab === "comments" && <CourseComments courseId={course.id} />}
    </div>
  );
}
