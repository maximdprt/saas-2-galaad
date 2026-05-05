import { ReportPage } from "@/components/analyzer/Report/ReportPage";

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReportPage id={id} />;
}
