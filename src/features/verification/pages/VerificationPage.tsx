import { CheckCircle2, FlaskConical, ShieldCheck } from "lucide-react";
import { convert, quantity } from "@/core/quantities";
import { calculateISectionProperties } from "@/core/sections";

type Benchmark = {
  name: string;
  expected: number;
  actual: number;
  unit: string;
  tolerance: number;
  source: string;
};
const section = calculateISectionProperties({
  depth: quantity(300, "mm", "length"),
  flangeWidth: quantity(150, "mm", "length"),
  webThickness: quantity(6.5, "mm", "length"),
  flangeThickness: quantity(9, "mm", "length"),
});
const benchmarks: Benchmark[] = [
  {
    name: "1 kgf → N",
    expected: 9.80665,
    actual: quantity(1, "kgf", "force").canonicalValue,
    unit: "N",
    tolerance: 1e-12,
    source: "Standard gravity definition",
  },
  {
    name: "1 tf → kN",
    expected: 9.80665,
    actual: convert(quantity(1, "tf", "force"), "kN"),
    unit: "kN",
    tolerance: 1e-12,
    source: "1,000 kgf",
  },
  {
    name: "1 kgf/cm² → MPa",
    expected: 0.0980665,
    actual: convert(quantity(1, "kgf/cm²", "stress"), "MPa"),
    unit: "MPa",
    tolerance: 1e-12,
    source: "Force/area dimensional conversion",
  },
  {
    name: "I-section area",
    expected: 45.33,
    actual: convert(section.area, "cm²"),
    unit: "cm²",
    tolerance: 1e-10,
    source: "Rectangle decomposition benchmark CBP-I-001",
  },
  {
    name: "I-section centroid",
    expected: 150,
    actual: convert(section.centroidFromBottom, "mm"),
    unit: "mm",
    tolerance: 1e-10,
    source: "Symmetry benchmark CBP-I-001",
  },
  {
    name: "I-section Ix",
    expected: 6932.5191,
    actual: convert(section.ix, "cm⁴"),
    unit: "cm⁴",
    tolerance: 1e-7,
    source: "Parallel-axis benchmark CBP-I-001",
  },
  {
    name: "I-section Iy",
    expected: 506.89536875,
    actual: convert(section.iy, "cm⁴"),
    unit: "cm⁴",
    tolerance: 1e-7,
    source: "Rectangle decomposition benchmark CBP-I-001",
  },
  {
    name: "Mass per metre",
    expected: 35.58405,
    actual: section.massPerMetre.canonicalValue,
    unit: "kg/m",
    tolerance: 1e-9,
    source: "Area × 7,850 kg/m³",
  },
];

export default function VerificationPage() {
  const passing = benchmarks.filter(
    (item) => Math.abs(item.actual - item.expected) <= item.tolerance,
  ).length;
  return (
    <div className="page wide-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">ENGINEERING VERIFICATION</span>
          <h1>Verification Suite</h1>
          <p>Traceable unit-conversion tests and section-property analytical benchmarks.</p>
        </div>
        <div className="verification-summary">
          <ShieldCheck size={18} />
          <strong>
            {passing}/{benchmarks.length}
          </strong>
          <span>runtime benchmarks passing</span>
        </div>
      </header>
      <div className="verification-notice">
        <FlaskConical size={18} />
        <p>
          These are engineering-foundation benchmarks only. Structural analysis and design
          verification have not started.
        </p>
      </div>
      <section className="benchmark-card">
        <div className="benchmark-heading">
          <div>
            <span className="eyebrow">RUNTIME EVIDENCE</span>
            <h2>Units & section properties</h2>
          </div>
          <span>Revision: Phase 2.0</span>
        </div>
        <div className="benchmark-table-wrap">
          <table className="benchmark-table">
            <thead>
              <tr>
                <th>Benchmark</th>
                <th>Expected</th>
                <th>Actual</th>
                <th>Tolerance</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((item) => {
                const pass = Math.abs(item.actual - item.expected) <= item.tolerance;
                return (
                  <tr key={item.name}>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td className="mono">
                      {item.expected.toPrecision(9)} {item.unit}
                    </td>
                    <td className="mono">
                      {item.actual.toPrecision(9)} {item.unit}
                    </td>
                    <td className="mono">≤ {item.tolerance}</td>
                    <td>{item.source}</td>
                    <td>
                      <span className={pass ? "benchmark-pass" : "benchmark-fail"}>
                        {pass ? <CheckCircle2 size={13} /> : "!"}
                        {pass ? "PASS" : "FAIL"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <section className="test-inventory">
        <h2>Automated test inventory</h2>
        <div>
          <span>Unit conversion</span>
          <strong>9 tests</strong>
        </div>
        <div>
          <span>I-section properties</span>
          <strong>11 tests</strong>
        </div>
        <div>
          <span>UI foundation</span>
          <strong>1 test</strong>
        </div>
      </section>
    </div>
  );
}
