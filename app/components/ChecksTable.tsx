import { checks } from "./data";

export function ChecksTable() {
  return (
    <section className="card checks-card">
      <div className="card-heading"><div><span className="eyebrow">GOVERNING RESULTS</span><h2>Design checks</h2></div><button className="outline-button">View all 18 checks →</button></div>
      <div className="table-scroll"><table><thead><tr><th>Check</th><th>Location</th><th>Reference</th><th>Combination</th><th>Demand / Capacity</th><th>Utilization</th><th>Status</th><th /></tr></thead>
      <tbody>{checks.map((row)=><tr key={row.check}><td><strong>{row.check}</strong><small>{row.clause}</small></td><td>{row.location}</td><td>{row.ref}</td><td className="mono">{row.combo}</td><td className="mono"><strong>{row.demand}</strong><small>{row.capacity}</small></td><td>{row.ratio === null ? <span className="muted">—</span> : <div className="ratio"><div><i style={{width:`${row.ratio*100}%`}} /></div><span>{row.ratio.toFixed(3)}</span></div>}</td><td><span className={`status ${row.status.toLowerCase().replace(" ","-")}`}>{row.status === "PASS" ? "✓" : row.status === "WARNING" ? "!" : "○"} {row.status}</span></td><td><button className="row-action" aria-label={`View ${row.check}`}>›</button></td></tr>)}</tbody></table></div>
    </section>
  );
}
