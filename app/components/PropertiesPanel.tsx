export function PropertiesPanel() {
  return (
    <aside className="properties-panel">
      <div className="panel-title"><div><span className="eyebrow">ACTIVE MODEL</span><h2>Design summary</h2></div><button className="icon-button">×</button></div>
      <div className="summary-score"><div className="score-ring"><strong>78%</strong><span>UTILIZED</span></div><div><strong>Design is passing</strong><p>2 items require engineering review.</p></div></div>
      <div className="property-group"><h3>Geometry</h3>{[["Span","12.000 m"],["Finished depth","900 mm"],["Opening diameter","450 mm"],["Opening pitch","600 mm"],["Solid end zones","900 mm"]].map(([a,b])=><div className="property-row" key={a}><span>{a}</span><strong>{b}</strong></div>)}<button className="text-button">Edit geometry →</button></div>
      <div className="property-group"><h3>Design criteria</h3>{[["Standard","AISC 360-22"],["Method","LRFD"],["Steel grade","SM490"],["Deflection limit","L / 360"],["Unit profile","Thai Metric"]].map(([a,b])=><div className="property-row" key={a}><span>{a}</span><strong>{b}</strong></div>)}</div>
      <div className="review-note"><span>!</span><div><strong>Professional review required</strong><p>Opening checks are framework-only until equations and clauses are verified.</p></div></div>
      <button className="primary-button full">Run analysis & design <span>→</span></button>
      <button className="outline-button full">Generate draft report</button>
    </aside>
  );
}
