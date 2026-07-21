import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopProjectBar } from "@/components/layout/TopProjectBar";
import { WorkflowStepper } from "@/components/layout/WorkflowStepper";

export function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-column">
        <TopProjectBar />
        <WorkflowStepper />
        <main className="main-content">
          <Outlet />
        </main>
        <footer className="status-bar">
          <span>
            <i /> Model valid
          </span>
          <span>Last analysis: 21 Jul 2026 · 10:42</span>
          <span className="mono">ENGINE v0.8.2 · INPUT HASH 7A4C...19D2</span>
        </footer>
      </div>
    </div>
  );
}
