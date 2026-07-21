import { AlertTriangle, CheckCircle2, FileStack, Gauge, Weight } from "lucide-react";
import type { ReactNode } from "react";
import { LoadCaseSummary } from "@/features/loads/components/LoadCaseSummary";
import { LoadDiagramChart } from "@/features/loads/components/LoadDiagramChart";
import { analyzeStraightBeamLoadCase, createPhase6BenchmarkLoadCase } from "@/core/loads";

const analysis = analyzeStraightBeamLoadCase({
  beamLengthM: 10,
  areaM2: 0.012,
  inertiaM4: 8.5e-5,
  elasticModulusPa: 200_000_000_000,
  steelDensityKgM3: 7850,
  loadCase: createPhase6BenchmarkLoadCase(),
  minimumElementCount: 20,
});

export default function LoadsPage() {
  return (
    <div className="page wide-page loads-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">STRAIGHT BEAM LOADS</span>
          <h1>Load Cases & Diagrams</h1>
          <p>
            กำหนด Load Case สำหรับคานตรงและแสดง Reaction, Shear, Moment และ Deflection จาก 2D FEM
            engine ที่ผ่าน benchmark แล้ว
          </p>
        </div>
        <div className="verification-summary">
          <CheckCircle2 size={18} />
          <strong>Phase 6</strong>
          <span>runtime diagrams</span>
        </div>
      </header>

      <section className="loads-notice">
        <AlertTriangle size={18} />
        <p>
          ตัวอย่างนี้เป็น DEMO BENCHMARK สำหรับ straight simply supported beam. Load combinations,
          envelopes, support settlement, trapezoidal loads และ standard-based factors
          ยังไม่ถูกเปิดใช้ใน Phase นี้
        </p>
      </section>

      <section className="loads-layout">
        <div className="loads-main-panel">
          <header>
            <div>
              <span className="eyebrow">LOAD WORKSPACE</span>
              <h2>Service gravity benchmark</h2>
            </div>
            <span className="unit-chip">Thai metric display</span>
          </header>
          <div className="load-metrics">
            <Metric label="Span" value="10.000" unit="m" icon={<FileStack size={15} />} />
            <Metric label="Load case" value="1" unit="active" icon={<Weight size={15} />} />
            <Metric
              label="Max shear"
              value={formatAbs(analysis.extrema.maxShearN.shearN / 1000)}
              unit="kN"
              icon={<Gauge size={15} />}
            />
            <Metric
              label="Max moment"
              value={formatAbs(analysis.extrema.maxMomentNm.momentNm / 1000)}
              unit="kN·m"
              icon={<Gauge size={15} />}
            />
            <Metric
              label="Max deflection"
              value={formatAbs(analysis.extrema.minDeflectionM.deflectionM * 1000)}
              unit="mm"
              icon={<Gauge size={15} />}
            />
          </div>

          <div className="load-diagram-stack">
            <LoadDiagramChart
              title="Shear force"
              unit="kN"
              kind="shear"
              samples={analysis.samples}
            />
            <LoadDiagramChart
              title="Bending moment"
              unit="kN·m"
              kind="moment"
              samples={analysis.samples}
            />
            <LoadDiagramChart
              title="Vertical deflection"
              unit="mm"
              kind="deflection"
              samples={analysis.samples}
            />
          </div>

          <div className="load-table-wrap">
            <table className="benchmark-table">
              <thead>
                <tr>
                  <th>Load</th>
                  <th>Type</th>
                  <th>Position / Range</th>
                  <th>Magnitude</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {analysis.loadCase.loads.map((load) => (
                  <tr key={load.id}>
                    <td>
                      <strong>{load.label}</strong>
                    </td>
                    <td>{load.type === "uniform" ? "UDL" : "Point load"}</td>
                    <td className="mono">
                      {load.type === "uniform"
                        ? `${load.startXM.toFixed(2)}-${load.endXM.toFixed(2)} m`
                        : `${load.positionXM.toFixed(2)} m`}
                    </td>
                    <td className="mono">
                      {load.type === "uniform"
                        ? `${(load.magnitudeNPerM / 1000).toFixed(3)} kN/m`
                        : `${(load.fyN / 1000).toFixed(3)} kN`}
                    </td>
                    <td>
                      {analysis.loadCase.source === "benchmark"
                        ? "DEMO BENCHMARK"
                        : analysis.loadCase.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <LoadCaseSummary analysis={analysis} />
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
  icon,
}: Readonly<{ label: string; value: string; unit: string; icon: ReactNode }>) {
  return (
    <article>
      <div>
        <span>{label}</span>
        {icon}
      </div>
      <strong>{value}</strong>
      <small>{unit}</small>
    </article>
  );
}

function formatAbs(value: number): string {
  const magnitude = Math.abs(value);
  return magnitude >= 100 ? magnitude.toFixed(1) : magnitude.toFixed(3);
}
