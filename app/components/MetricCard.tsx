export function MetricCard({ label, value, unit, meta, tone = "blue" }: { label: string; value: string; unit?: string; meta: string; tone?: string }) {
  return (
    <article className="metric-card">
      <div className="metric-label"><span className={`metric-dot ${tone}`} />{label}<button aria-label={`More about ${label}`}>···</button></div>
      <div className="metric-value">{value} {unit && <small>{unit}</small>}</div>
      <p>{meta}</p>
    </article>
  );
}
