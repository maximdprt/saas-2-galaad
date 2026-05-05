import { MentorChat } from "@/components/analyzer/Mentor/MentorChat";

export default async function MentorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MentorChat id={id} />;
}
