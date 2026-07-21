import { useLocation } from "react-router-dom";

const steps = ["Project", "Criteria", "Geometry", "Section", "Supports", "Loads", "Analysis", "Design", "Review", "Report"];
const routeStep: Record<string, number> = { criteria: 1, geometry: 2, loads: 5, analysis: 6, design: 7, report: 9 };

export function WorkflowStepper() {
  const location = useLocation();
  const matched = Object.entries(routeStep).find(([segment]) => location.pathname.includes(`/${segment}`));
  const current = matched?.[1] ?? 0;
  return <div className="workflow-scroll"><ol className="workflow" aria-label="Project workflow">{steps.map((step, index) => <li className={index === current ? "current" : index < current ? "complete" : ""} key={step}><span>{index < current ? "✓" : index + 1}</span><small>{step}</small></li>)}</ol></div>;
}
