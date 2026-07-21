import { EmptyState } from "@/components/states/EmptyState";
import { useNotificationStore } from "@/stores/notification-store";

export function ProjectsPage() {
  const notify = useNotificationStore((state) => state.notify);
  return <div className="page"><header className="page-header"><div><span className="eyebrow">PROJECT MANAGEMENT</span><h1>Projects</h1><p>สร้างและจัดการโครงการคาน Cellular Beam</p></div></header><div className="content-card"><EmptyState title="ยังไม่มีโครงการ" description="Project records will be stored in Firestore after authentication and access-control rules are configured." actionLabel="Create project" onAction={() => notify({ tone: "info", title: "Project creation", message: "Project persistence is scheduled for Phase 2." })} /></div></div>;
}
