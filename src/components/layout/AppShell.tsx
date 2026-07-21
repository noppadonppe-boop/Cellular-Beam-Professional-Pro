import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopProjectBar } from "@/components/layout/TopProjectBar";
import { WorkflowStepper } from "@/components/layout/WorkflowStepper";

export function AppShell() { return <div className="app-shell"><Sidebar /><div className="main-column"><TopProjectBar /><WorkflowStepper /><main className="main-content"><Outlet /></main><footer className="status-bar"><span><i /> Foundation ready</span><span>No verified calculation modules loaded</span><span className="mono">PHASE 1 · v0.1.0</span></footer></div></div>; }
