"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { WorkflowStepper } from "./WorkflowStepper";
import { MetricCard } from "./MetricCard";
import { BeamWorkspace } from "./BeamWorkspace";
import { ChecksTable } from "./ChecksTable";
import { PropertiesPanel } from "./PropertiesPanel";

export function EngineeringApp() {
  const [navOpen,setNavOpen]=useState(false);
  return (
    <div className="app-shell">
      <Sidebar open={navOpen} onClose={()=>setNavOpen(false)} />
      {navOpen && <button className="scrim" onClick={()=>setNavOpen(false)} aria-label="Close navigation overlay" />}
      <div className="main-column">
        <TopBar onMenu={()=>setNavOpen(true)} />
        <WorkflowStepper />
        <main className="workspace">
          <div className="content-column">
            <div className="page-heading"><div><div className="breadcrumbs">Projects <span>›</span> CB-24018 <span>›</span> Dashboard</div><h1>Design dashboard</h1><p>Review model status, governing actions, and cellular beam design checks.</p></div><div className="heading-actions"><button className="outline-button">Share</button><button className="primary-button">Run analysis <span>→</span></button></div></div>
            <div className="notice"><span>i</span><div><strong>Demonstration workspace</strong><p>Values shown below are illustrative and are not verified engineering results. Do not use for construction.</p></div><button>Dismiss</button></div>
            <div className="metrics-grid">
              <MetricCard label="Maximum moment" value="412.6" unit="kN·m" meta="ULS-01 · x = 6.00 m" />
              <MetricCard label="Maximum shear" value="168.2" unit="kN" meta="ULS-01 · left support" tone="amber" />
              <MetricCard label="Max. deflection" value="24.8" unit="mm" meta="SLS-02 · limit 33.3 mm" tone="green" />
              <MetricCard label="Governing utilization" value="0.823" meta="Opening O-02 · shear" tone="amber" />
            </div>
            <BeamWorkspace />
            <div className="status-strip"><div><span className="status pass">✓ PASS</span><strong>14</strong><small>verified checks</small></div><div><span className="status warning">! WARNING</span><strong>2</strong><small>review required</small></div><div><span className="status fail">× FAIL</span><strong>0</strong><small>failed checks</small></div><div><span className="status not-implemented">○ N/A</span><strong>2</strong><small>not implemented</small></div></div>
            <ChecksTable />
            <footer className="legal-note">Cellular Beam Professional is a calculation assistance tool. Results must be checked and certified by a licensed professional engineer before construction use. <button>View limitations</button></footer>
          </div>
          <PropertiesPanel />
        </main>
        <div className="bottom-bar"><div><span className="pulse" /> Model valid</div><div>Last analysis: 21 Jul 2026 · 10:42</div><div className="mono">ENGINE v0.8.2 · INPUT HASH 7A4C…19D2</div></div>
      </div>
    </div>
  );
}
