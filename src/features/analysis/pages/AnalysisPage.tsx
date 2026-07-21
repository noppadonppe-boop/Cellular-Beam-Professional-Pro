import { Activity, AlertTriangle, CheckCircle2, Sigma } from "lucide-react";
import { analyzeLinearFrame2D, createSimplySupportedBeamModel, runFemBenchmarks } from "@/core/fem";

const model = createSimplySupportedBeamModel({
  lengthM: 10,
  elementCount: 10,
  areaM2: 0.012,
  inertiaM4: 8.5e-5,
  elasticModulusPa: 200_000_000_000,
});

const loadNPerM = 18_000;
const result = analyzeLinearFrame2D({
  ...model,
  uniformElementLoads: model.elements.map((element) => ({
    elementId: element.id,
    localYNPerM: -loadNPerM,
  })),
});

const benchmarks = runFemBenchmarks();
const passing = benchmarks.filter(
  (item) => Math.abs(item.actual - item.expected) <= item.tolerance,
).length;
const maximumMomentNm = Math.max(
  ...result.elementEndForces.flatMap((item) => [
    Math.abs(item.start.momentNm),
    Math.abs(item.end.momentNm),
  ]),
);

export default function AnalysisPage() {
  return (
    <div className="page wide-page analysis-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">2D FEM ANALYSIS</span>
          <h1>Linear Static Solver</h1>
          <p>
            Deterministic 2D frame analysis for straight beam benchmark models. Design checks and
            cellular opening stress checks are intentionally not shown yet.
          </p>
        </div>
        <div className="verification-summary">
          <CheckCircle2 size={18} />
          <strong>
            {passing}/{benchmarks.length}
          </strong>
          <span>FEM benchmarks passing</span>
        </div>
      </header>

      <section className="analysis-notice">
        <AlertTriangle size={18} />
        <p>
          Phase 5 validates the analysis engine only. Results below come from a classic simply
          supported UDL benchmark and must not be used as final cellular beam capacity checks.
        </p>
      </section>

      <section className="analysis-layout">
        <div className="analysis-main-panel">
          <header>
            <div>
              <span className="eyebrow">BENCHMARK MODEL</span>
              <h2>Simply supported beam under uniform load</h2>
            </div>
            <span className="unit-chip">SI canonical</span>
          </header>
          <div className="analysis-metrics">
            <Metric label="Span" value="10.000" unit="m" />
            <Metric label="Elements" value={model.elements.length.toString()} unit="frame" />
            <Metric label="UDL" value={(loadNPerM / 1000).toFixed(2)} unit="kN/m" />
            <Metric
              label="Max deflection"
              value={(Math.abs(result.maximumVerticalDisplacementM) * 1000).toPrecision(4)}
              unit="mm"
            />
            <Metric
              label="Max end moment"
              value={(maximumMomentNm / 1000).toPrecision(4)}
              unit="kN·m"
            />
          </div>
          <BeamAnalysisDiagram />
          <div className="analysis-table-wrap">
            <table className="benchmark-table">
              <thead>
                <tr>
                  <th>Node</th>
                  <th>ux</th>
                  <th>uy</th>
                  <th>rz</th>
                  <th>Reaction Y</th>
                </tr>
              </thead>
              <tbody>
                {result.displacements.map((node) => {
                  const reaction = result.reactions.find((item) => item.nodeId === node.nodeId);
                  return (
                    <tr key={node.nodeId}>
                      <td>
                        <strong>{node.nodeId}</strong>
                      </td>
                      <td className="mono">{(node.uxM * 1000).toExponential(3)} mm</td>
                      <td className="mono">{(node.uyM * 1000).toExponential(3)} mm</td>
                      <td className="mono">{node.rzRad.toExponential(3)} rad</td>
                      <td className="mono">
                        {reaction ? (reaction.fyN / 1000).toFixed(3) : "0.000"} kN
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="analysis-side-panel">
          <header>
            <Sigma size={17} />
            <div>
              <span className="eyebrow">SOLVER SCOPE</span>
              <h2>Phase 5 Engine</h2>
            </div>
          </header>
          <dl>
            <div>
              <dt>Element</dt>
              <dd>2D Euler-Bernoulli frame</dd>
            </div>
            <div>
              <dt>DOF per node</dt>
              <dd>ux, uy, rz</dd>
            </div>
            <div>
              <dt>Loads</dt>
              <dd>Nodal + local uniform element</dd>
            </div>
            <div>
              <dt>Recovery</dt>
              <dd>Reactions + local end forces</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>No material nonlinearity, buckling, weld checks, or code design yet</dd>
            </div>
          </dl>
        </aside>
      </section>
    </div>
  );
}

function Metric({ label, value, unit }: Readonly<{ label: string; value: string; unit: string }>) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{unit}</small>
    </article>
  );
}

function BeamAnalysisDiagram() {
  return (
    <div className="analysis-diagram" aria-label="Simply supported beam analysis diagram">
      <div className="analysis-grid" />
      <div className="analysis-loads">
        {Array.from({ length: 11 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="analysis-beam">
        {model.nodes.map((node) => (
          <span key={node.id} style={{ left: `${String((node.xM / 10) * 100)}%` }} />
        ))}
      </div>
      <div className="analysis-deflected" />
      <div className="analysis-support left" />
      <div className="analysis-support right" />
      <div className="analysis-caption">
        <Activity size={14} />
        <span>Linear elastic response, small displacement assumption</span>
      </div>
    </div>
  );
}
