import type { BadgeColor } from "@/components/ui/Badge";

type CourseVisual = {
  emoji: string;
  badgeColor: BadgeColor;
  tileBg: string;
};

const visuals: Record<string, CourseVisual> = {
  Java: { emoji: "☕", badgeColor: "orange", tileBg: "bg-orange-50" },
  "C++": { emoji: "⚙️", badgeColor: "indigo", tileBg: "bg-indigo-50" },
  Python: { emoji: "🐍", badgeColor: "green", tileBg: "bg-emerald-50" },
  JavaScript: { emoji: "✨", badgeColor: "amber", tileBg: "bg-amber-50" },
  SQL: { emoji: "🗄️", badgeColor: "purple", tileBg: "bg-purple-50" },
};

const fallback: CourseVisual = {
  emoji: "📘",
  badgeColor: "gray",
  tileBg: "bg-gray-50",
};

export function getCourseVisual(language: string): CourseVisual {
  return visuals[language] ?? fallback;
}
