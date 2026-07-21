import { BarChart3 } from "lucide-react";
import { ModulePlaceholder } from "@/components/pages/ModulePlaceholder";
export default function AnalysisPage() {
  return (
    <ModulePlaceholder
      eyebrow="STRUCTURAL ANALYSIS"
      title="Analysis"
      description="Linear static analysis workspace"
      emptyTitle="Analysis engine not implemented"
      emptyDescription="No reactions, diagrams, or deflections will be shown until the verified solver and benchmarks are complete."
      icon={BarChart3}
    />
  );
}
