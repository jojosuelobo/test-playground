import type { ReactNode } from "react";

export type BadgeColor = "indigo" | "green" | "amber" | "gray" | "orange" | "purple";

const colorClasses: Record<BadgeColor, string> = {
  indigo: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200",
  green: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  gray: "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200",
  orange: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",
  purple: "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-200",
};

type BadgeProps = {
  children: ReactNode;
  color?: BadgeColor;
  testId?: string;
  className?: string;
};

export default function Badge({ children, color = "gray", testId, className = "" }: BadgeProps) {
  return (
    <span
      data-testid={testId}
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
}
