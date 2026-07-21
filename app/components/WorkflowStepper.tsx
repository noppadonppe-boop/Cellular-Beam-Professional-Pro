import { steps } from "./data";

export function WorkflowStepper() {
  return (
    <div className="stepper-wrap">
      <div className="stepper" aria-label="Project workflow">
        {steps.map((step, index) => (
          <div className={`step ${index < 7 ? "done" : index === 7 ? "current" : ""}`} key={step}>
            <span>{index < 7 ? "✓" : index + 1}</span><small>{step}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
