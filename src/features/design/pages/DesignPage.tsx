import { AlertTriangle, CheckCircle2, CircleDashed, ClipboardCheck } from "lucide-react";
import { checkGlobalSteelMember } from "@/core/design";
import { extractCellularCheckActions, generateCellularGeometry } from "@/core/cellular";
import { extractConnectionActions } from "@/core/connections";
import {
  analyzeStraightBeamLoadCase,
  createPhase6BenchmarkLoadCase,
  type PointLoad,
} from "@/core/loads";
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
const cellularGeometry = generateCellularGeometry({
  beamLengthMm: 10000, parentDepthMm: 400, flangeWidthMm: 220, flangeThicknessMm: 20,
  webThicknessMm: 12, finishedDepthMm: 600, openingDiameterMm: 400, pitchMm: 600,
  firstOpeningCenterMm: 700, openingCount: 14, openingEccentricityMm: 0,
  minimumSolidEndZoneMm: 400, steelDensityKgM3: 7850, weldSizeMm: 6,
  cuttingPattern: "circular-interlock", weldType: "continuous-fillet",
});
const cellularActions = extractCellularCheckActions(cellularGeometry, loadAnalysis.samples);
const connectionActions = extractConnectionActions(
  cellularGeometry,
  cellularActions.openings,
  loadAnalysis.loadCase.loads.filter((load): load is PointLoad => load.type === "point"),
);

export default function DesignPage() {
  return (
    <div className="page design-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">GLOBAL & CELLULAR MEMBER</span>
          <h1>Member Checks</h1>
          <p>
            Gross-section yield and serviceability screening from the active straight-beam
            benchmark, including opening and web-post action extraction.
          </p>
        </div>
        <div className="verification-summary">
          <CheckCircle2 size={18} />
          <strong>Phase 8</strong>
          <span>traceable actions</span>
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
      <section className="cellular-actions-panel">
        <header>
          <div><span className="eyebrow">OPENING · VIERENDEEL · WEB-POST</span><h2>Cellular action schedule</h2></div>
          <span className="unit-chip">ACTION EXTRACTION ONLY</span>
        </header>
        <p className="cellular-actions-note">Opening and web-post demands are extracted from the straight-beam elastic analysis. They are not resistance or utilization checks.</p>
        <div className="cellular-action-grid">
          <div><h3>Opening actions</h3><div className="action-table-wrap"><table className="benchmark-table"><thead><tr><th>Opening</th><th>x</th><th>V</th><th>M</th><th>Tee axial</th><th>Vierendeel demand</th><th>Status</th></tr></thead><tbody>{cellularActions.openings.map((item) => <tr key={item.openingNumber}><td><strong>O{item.openingNumber}</strong></td><td>{item.xM.toFixed(3)} m</td><td>{(item.shearN / 1000).toFixed(2)} kN</td><td>{(item.momentNm / 1000).toFixed(2)} kN·m</td><td>{(item.topTeeAxialN / 1000).toFixed(2)} kN</td><td>{(item.vierendeelMomentDemandNm / 1000).toFixed(2)} kN·m</td><td><span className="check-badge notEvaluated">ACTION ONLY</span></td></tr>)}</tbody></table></div></div>
          <div><h3>Web-post actions</h3><div className="action-table-wrap"><table className="benchmark-table"><thead><tr><th>Post</th><th>Clear width</th><th>V</th><th>q = |V|/b</th><th>M</th><th>Status</th></tr></thead><tbody>{cellularActions.webPosts.map((item) => <tr key={item.webPostNumber}><td><strong>WP{item.webPostNumber}</strong></td><td>{(item.clearWidthM * 1000).toFixed(0)} mm</td><td>{(item.shearN / 1000).toFixed(2)} kN</td><td>{(item.horizontalShearFlowNPerM / 1000).toFixed(2)} kN/m</td><td>{(item.bendingMomentNm / 1000).toFixed(2)} kN·m</td><td><span className="check-badge notEvaluated">ACTION ONLY</span></td></tr>)}</tbody></table></div></div>
        </div>
      </section>
      <section className="cellular-actions-panel connection-panel">
        <header><div><span className="eyebrow">WELD · STIFFENER · CONCENTRATED LOAD</span><h2>Connection action schedule</h2></div><span className="unit-chip">REVIEW REQUIRED</span></header>
        <p className="cellular-actions-note">Weld actions are based on tee force extraction. Point-load proximity is a review trigger for local web/stiffener detailing, not a capacity assessment.</p>
        <div className="cellular-action-grid">
          <div><h3>Longitudinal weld actions</h3><div className="action-table-wrap"><table className="benchmark-table"><thead><tr><th>Location</th><th>x</th><th>Longitudinal force</th><th>Tee shear</th><th>Status</th></tr></thead><tbody>{connectionActions.welds.map((item) => <tr key={item.location}><td><strong>{item.location}</strong></td><td>{item.xM.toFixed(3)} m</td><td>{(item.longitudinalForceN / 1000).toFixed(2)} kN</td><td>{(item.shearDemandN / 1000).toFixed(2)} kN</td><td><span className="check-badge notEvaluated">ACTION ONLY</span></td></tr>)}</tbody></table></div></div>
          <div><h3>Concentrated-load review</h3><div className="action-table-wrap"><table className="benchmark-table"><thead><tr><th>Load</th><th>Force</th><th>Nearest opening</th><th>Edge distance</th><th>Stiffener review</th></tr></thead><tbody>{connectionActions.concentratedLoads.map((item) => <tr key={item.loadId}><td><strong>{item.label}</strong></td><td>{(item.forceN / 1000).toFixed(2)} kN</td><td>O{item.nearestOpeningNumber}</td><td>{(item.nearestOpeningEdgeDistanceM * 1000).toFixed(1)} mm</td><td><span className={`check-badge ${item.requiresStiffenerReview ? "fail" : "notEvaluated"}`}>{item.requiresStiffenerReview ? "REVIEW REQUIRED" : "REVIEW"}</span></td></tr>)}</tbody></table></div></div>
        </div>
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
