import PublicProfile from "@/components/profile/PublicProfile";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PublicProfile userId={userId} />
    </div>
  );
}
