import { AlertTriangle, CheckCircle2, CircleDashed, ClipboardCheck } from "lucide-react";
import { checkGlobalSteelMember } from "@/core/design";
import { analyzeStraightBeamLoadCase, createPhase6BenchmarkLoadCase } from "@/core/loads";
import { quantity } from "@/core/quantities";
import { calculateISectionProperties } from "@/core/sections";

const geometry = {
  depth: quantity(600, "mm", "length"),
  flangeWidth: quantity(220, "mm", "length"),
  webThickness: quantity(12, "mm", "length"),
  flangeThickness: quantity(20, "mm", "length"),
};
const properties = calculateISectionProperties(geometry);
const loadAnalysis = analyzeStraightBeamLoadCase({
  beamLengthM: 10,
  areaM2: properties.area.canonicalValue,
  inertiaM4: properties.ix.canonicalValue,
  elasticModulusPa: 200_000_000_000,
  steelDensityKgM3: 7850,
  loadCase: createPhase6BenchmarkLoadCase(),
});
const result = checkGlobalSteelMember({
  sectionProperties: properties,
  sectionGeometry: geometry,
  steelGrade: {
    id: "S355-DEMO",
    name: "S355 benchmark steel",
    kind: "steel",
    gradeDesignation: "S355",
    elasticModulus: quantity(200000, "MPa", "stress"),
    poissonRatio: 0.3,
    density: { value: 7850, unit: "kg/m³" },
    yieldStrength: quantity(355, "MPa", "stress"),
    ultimateStrength: quantity(510, "MPa", "stress"),
    provenance: {
      sourceName: "Phase 7 benchmark",
      sourceReference: "CBP-D-001",
      revision: "Phase 7.0",
      retrievedAtIso: "2026-07-21T00:00:00.000Z",
      verificationStatus: "pendingVerification",
    },
  },
  spanM: 10,
  unbracedLengthM: 10,
  maximumMomentNm: Math.max(
    Math.abs(loadAnalysis.extrema.maxMomentNm.momentNm),
    Math.abs(loadAnalysis.extrema.minMomentNm.momentNm),
  ),
  maximumShearN: Math.max(
    Math.abs(loadAnalysis.extrema.maxShearN.shearN),
    Math.abs(loadAnalysis.extrema.minShearN.shearN),
  ),
  maximumDeflectionM: Math.max(
    Math.abs(loadAnalysis.extrema.maxDeflectionM.deflectionM),
    Math.abs(loadAnalysis.extrema.minDeflectionM.deflectionM),
  ),
  deflectionLimitRatio: 360,
  basis: {
    reference: "Gross-section yield screening — no design code selected",
    revision: "Phase 7.0",
    resistanceFactor: 1,
  },
});

export default function DesignPage() {
  return (
    <div className="page design-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">GLOBAL STEEL MEMBER</span>
          <h1>Member Checks</h1>
          <p>
            Gross-section yield and serviceability screening from the active straight-beam
            benchmark.
          </p>
        </div>
        <div className="verification-summary">
          <CheckCircle2 size={18} />
          <strong>Phase 7</strong>
          <span>traceable screening</span>
        </div>
      </header>
      <section className="design-notice">
        <AlertTriangle size={18} />
        <p>
          <strong>DEMO BENCHMARK — not a code design.</strong> PASS/FAIL applies only to the stated
          gross-section yield or L/360 screening equation. LTB and local buckling remain unevaluated
          until a governing standard, edition, clause, and restraint model are selected.
        </p>
      </section>
      <section className="design-layout">
        <main className="design-main-panel">
          <header>
            <div>
              <span className="eyebrow">CHECK SCHEDULE</span>
              <h2>Global member screening</h2>
            </div>
            <span className="unit-chip">SI canonical · Thai metric display</span>
          </header>
          <div className="design-input-strip">
            <span>
              Section: <strong>Built-up I 600 × 220 × 12 × 20</strong>
            </span>
            <span>
              Steel: <strong>S355 benchmark</strong>
            </span>
            <span>
              Unbraced length: <strong>10.000 m</strong>
            </span>
          </div>
          <div className="check-list">
            {result.checks.map((check) => (
              <article key={check.id} className={`member-check ${check.status}`}>
                <div className="check-status">
                  {check.status === "notEvaluated" ? (
                    <CircleDashed size={17} />
                  ) : (
                    <ClipboardCheck size={17} />
                  )}
                </div>
                <div className="check-title">
                  <strong>{check.title}</strong>
                  <span>{check.method}</span>
                  {check.limitation && <small>{check.limitation}</small>}
                </div>
                <div className="check-value">
                  <span>Demand</span>
                  <strong>{formatValue(check.demand, check.unit)}</strong>
                </div>
                <div className="check-value">
                  <span>Capacity / limit</span>
                  <strong>{formatValue(check.capacity, check.unit)}</strong>
                </div>
                <div className="check-result">
                  <strong>{check.utilization === null ? "—" : check.utilization.toFixed(3)}</strong>
                  <span className={`check-badge ${check.status}`}>
                    {check.status === "notEvaluated" ? "NOT EVALUATED" : check.status.toUpperCase()}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </main>
        <aside className="design-side-panel">
          <header>
            <ClipboardCheck size={18} />
            <h2>Traceability</h2>
          </header>
          <dl>
            <div>
              <dt>Analysis source</dt>
              <dd>Phase 6 straight beam FEM</dd>
            </div>
            <div>
              <dt>Basis</dt>
              <dd>{result.basis.reference}</dd>
            </div>
            <div>
              <dt>Basis revision</dt>
              <dd>{result.basis.revision}</dd>
            </div>
            <div>
              <dt>Engine</dt>
              <dd>{result.analysisVersion}</dd>
            </div>
            <div>
              <dt>Governing screen</dt>
              <dd>
                {result.governing
                  ? `${result.governing.title} · ${(result.governing.utilization ?? 0).toFixed(3)}`
                  : "None"}
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </div>
  );
}

function formatValue(value: number | null, unit: string): string {
  if (value === null) return "—";
  if (unit === "N·m") return `${(value / 1000).toFixed(2)} kN·m`;
  if (unit === "N") return `${(value / 1000).toFixed(2)} kN`;
  if (unit === "m") return `${(value * 1000).toFixed(2)} mm`;
  return value.toFixed(3);
}
