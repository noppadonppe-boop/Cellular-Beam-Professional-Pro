import { ArrowRight, CircleAlert, Info, MoreHorizontal, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const metrics = [
  {
    tone: "blue",
    label: "Maximum moment",
    value: "412.6",
    unit: "kN·m",
    note: "ULS-01 · x = 6.00 m",
  },
  {
    tone: "orange",
    label: "Maximum shear",
    value: "168.2",
    unit: "kN",
    note: "ULS-01 · left support",
  },
  {
    tone: "green",
    label: "Max. deflection",
    value: "24.8",
    unit: "mm",
    note: "SLS-02 · limit 33.3 mm",
  },
  {
    tone: "orange",
    label: "Governing utilization",
    value: "0.823",
    unit: "",
    note: "Opening O-02 · shear",
  },
];

function BeamDiagram() {
  return (
    <div className="beam-canvas">
      <div className="dimension">12 000 mm</div>
      <div className="beam-body">
        {Array.from({ length: 17 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <span className="support left" />
      <span className="support right" />
      <span className="beam-note">Ø 450 · PITCH 600</span>
    </div>
  );
}

function SummaryPanel() {
  return (
    <aside className="summary-panel">
      <header>
        <span>ACTIVE MODEL</span>
        <button aria-label="Close summary">×</button>
        <h2>Design summary</h2>
      </header>
      <section className="utilization">
        <div className="donut">
          <strong>78%</strong>
          <small>UTILIZED</small>
        </div>
        <div>
          <strong>Demonstration status only</strong>
          <p>Not a design conclusion. Engineering review remains required.</p>
        </div>
      </section>
      <section className="summary-section">
        <h3>GEOMETRY</h3>
        <dl>
          <div>
            <dt>Span</dt>
            <dd>12.000 m</dd>
          </div>
          <div>
            <dt>Finished depth</dt>
            <dd>900 mm</dd>
          </div>
          <div>
            <dt>Opening diameter</dt>
            <dd>450 mm</dd>
          </div>
          <div>
            <dt>Opening pitch</dt>
            <dd>600 mm</dd>
          </div>
          <div>
            <dt>Solid end zones</dt>
            <dd>900 mm</dd>
          </div>
        </dl>
        <Link to="/projects/demo/geometry">Edit geometry →</Link>
      </section>
      <section className="summary-section">
        <h3>DESIGN CRITERIA</h3>
        <dl>
          <div>
            <dt>Standard</dt>
            <dd>No verified standard selected</dd>
          </div>
          <div>
            <dt>Method</dt>
            <dd>Screening only</dd>
          </div>
          <div>
            <dt>Steel grade</dt>
            <dd>Demo - pending verification</dd>
          </div>
          <div>
            <dt>Deflection limit</dt>
            <dd>L / 360</dd>
          </div>
          <div>
            <dt>Unit profile</dt>
            <dd>Thai Metric</dd>
          </div>
        </dl>
      </section>
      <div className="review-warning">
        <CircleAlert size={18} />
        <div>
          <strong>Professional review required</strong>
          <p>Opening checks are framework-only until equations and clauses are verified.</p>
        </div>
      </div>
      <Button asChild className="summary-primary">
        <Link to="/projects/demo/analysis">
          Run analysis &amp; design <ArrowRight size={15} />
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to="/projects/demo/report">Generate draft report</Link>
      </Button>
    </aside>
  );
}

export function DashboardPage() {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        <div className="breadcrumbs">
          Projects <span>›</span> CB-24018 <span>›</span> Dashboard
        </div>
        <header className="dashboard-header">
          <div>
            <h1>Design dashboard</h1>
            <p>Review model status, governing actions, and cellular beam design checks.</p>
          </div>
          <div>
            <Button variant="outline">
              <Share2 size={14} />
              Share
            </Button>
            <Button asChild>
              <Link to="/projects/demo/analysis">
                Run analysis <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </header>
        <div className="demo-banner">
          <Info size={18} />
          <div>
            <strong>Demonstration workspace</strong>
            <p>
              Values shown below are illustrative and are not verified engineering results. Do not
              use for construction.
            </p>
          </div>
          <button>Dismiss</button>
        </div>
        <section className="metric-grid">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <div className="metric-label">
                <i className={metric.tone} />
                {metric.label}
                <MoreHorizontal size={14} />
              </div>
              <div>
                <strong>{metric.value}</strong> <span>{metric.unit}</span>
              </div>
              <small>{metric.note}</small>
            </article>
          ))}
        </section>
        <section className="model-card">
          <header>
            <div>
              <span>MODEL OVERVIEW</span>
              <h2>Cellular beam geometry</h2>
            </div>
            <div className="view-tabs">
              <button className="active">Elevation</button>
              <button>Section</button>
            </div>
          </header>
          <div className="model-meta">
            <b>DEMO DATA</b>
            <span>H 600 × 200 × 11 × 17</span>
            <span>24 openings</span>
            <span>Grade SM490</span>
            <div>
              <button>−</button>
              <button>⌂</button>
              <button>+</button>
            </div>
          </div>
          <BeamDiagram />
          <footer>
            <div>
              <span className="legend opening" />
              Opening <span className="legend solid" />
              Solid end zone <span className="legend triangle" />
              Support
            </div>
            <Link to="/projects/demo/geometry">Open geometry editor →</Link>
          </footer>
        </section>
      </div>
      <SummaryPanel />
    </div>
  );
}
