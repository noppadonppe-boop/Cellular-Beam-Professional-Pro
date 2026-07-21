import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { CellularGeometryResult } from "@/core/cellular";

type Props = Readonly<{ geometry: CellularGeometryResult; selectedOpening: number | null }>;
const mm = (metres: number) =>
  `${(metres * 1000).toLocaleString(undefined, { maximumFractionDigits: 3 })} mm`;

export function GeometrySummary({ geometry, selectedOpening }: Props) {
  const opening = geometry.openings.find((item) => item.number === selectedOpening);
  return (
    <aside className="geometry-summary-card">
      <header>
        <span className="eyebrow">GENERATED RESULT</span>
        <h2>{geometry.isValid ? "Geometry valid" : "Action required"}</h2>
      </header>
      <div className={geometry.isValid ? "geometry-status valid" : "geometry-status invalid"}>
        {geometry.isValid ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
        <div>
          <strong>
            {geometry.isValid
              ? "No geometric conflicts"
              : `${String(geometry.issues.filter((issue) => issue.severity === "error").length)} geometric error(s)`}
          </strong>
          <small>Generator {geometry.generatorVersion}</small>
        </div>
      </div>
      <dl className="geometry-properties">
        <div>
          <dt>Top / bottom tee</dt>
          <dd>
            {mm(geometry.topTee.depthM)} / {mm(geometry.bottomTee.depthM)}
          </dd>
        </div>
        <div>
          <dt>Opening ratio d₀ / d</dt>
          <dd>{geometry.openingRatio.toFixed(4)}</dd>
        </div>
        <div>
          <dt>Web-post clear width</dt>
          <dd>{mm(geometry.webPosts[0]?.clearWidthM ?? 0)}</dd>
        </div>
        <div>
          <dt>Net area at opening</dt>
          <dd>
            {(geometry.netAreaAtOpeningM2 * 1e6).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}{" "}
            mm²
          </dd>
        </div>
        <div>
          <dt>Gross Ix at web post</dt>
          <dd>
            {(geometry.grossIxAtWebPostM4 * 1e12).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            mm⁴
          </dd>
        </div>
        <div>
          <dt>Approx. finished mass</dt>
          <dd>{geometry.approximateFinishedMassPerMetreKgM.toFixed(2)} kg/m</dd>
        </div>
        <div>
          <dt>Approx. weld length</dt>
          <dd>{geometry.approximateWeldLengthM.toFixed(3)} m</dd>
        </div>
      </dl>
      {opening && (
        <section className="selected-opening">
          <span>SELECTED OPENING</span>
          <strong>O{opening.number}</strong>
          <p>
            Centre {mm(opening.centerXM)} · edges {mm(opening.leftEdgeM)}—{mm(opening.rightEdgeM)}
          </p>
        </section>
      )}
      <section className="geometry-issues">
        <h3>Validation messages</h3>
        {geometry.issues.length === 0 ? (
          <p>
            <Info size={14} /> Geometry constraints satisfied. Standard-specific applicability is
            not assessed.
          </p>
        ) : (
          geometry.issues.map((issue, index) => (
            <p key={`${issue.code}-${String(index)}`} className={issue.severity}>
              <AlertTriangle size={14} /> {issue.message}
            </p>
          ))
        )}
      </section>
    </aside>
  );
}
