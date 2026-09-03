import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import ProfessorOverview from "@/components/professor/ProfessorOverview";

export default async function ProfessorPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "TEACHER") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <ProfessorOverview />
    </div>
  );
}
