import { useLocation } from "react-router-dom";

const steps = [
  "Project",
  "Criteria",
  "Geometry",
  "Section",
  "Loads",
  "Analysis",
  "Design",
  "Verification",
  "Report",
];
const routeStep: Record<string, number> = {
  criteria: 1,
  geometry: 2,
  sections: 3,
  loads: 4,
  analysis: 5,
  design: 6,
  verification: 7,
  report: 8,
};

export function WorkflowStepper() {
  const location = useLocation();
  const matched = Object.entries(routeStep).find(([segment]) =>
    location.pathname.includes(`/${segment}`),
  );
  const current = location.pathname === "/dashboard" ? 0 : (matched?.[1] ?? 0);
  return (
    <div className="workflow-scroll">
      <ol className="workflow" aria-label="Project workflow">
        {steps.map((step, index) => (
          <li
            className={index === current ? "current" : index < current ? "complete" : ""}
            key={step}
          >
            <span>{index < current ? "✓" : index + 1}</span>
            <small>{step}</small>
          </li>
        ))}
      </ol>
    </div>
  );
}
