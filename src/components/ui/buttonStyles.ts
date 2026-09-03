export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus-visible:ring-indigo-500",
  secondary:
    "bg-white text-gray-800 border border-gray-300 shadow-sm hover:bg-gray-50 focus-visible:ring-gray-400",
  outline:
    "border border-indigo-300 text-indigo-700 hover:bg-indigo-50 focus-visible:ring-indigo-400",
  success:
    "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:ring-emerald-500",
  warning:
    "bg-amber-500 text-white shadow-sm hover:bg-amber-600 focus-visible:ring-amber-400",
  ghost:
    "text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return [base, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");
}
