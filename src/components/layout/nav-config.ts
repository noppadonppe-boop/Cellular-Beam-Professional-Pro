import { BarChart3, Boxes, ClipboardCheck, FileText, FolderKanban, Gauge, Settings, ShieldCheck, SlidersHorizontal, Weight } from "lucide-react";

export const navItems = [
  { labelKey: "dashboard", to: "/dashboard", icon: Gauge },
  { labelKey: "projects", to: "/projects", icon: FolderKanban },
  { labelKey: "criteria", to: "/projects/demo/criteria", icon: SlidersHorizontal },
  { labelKey: "geometry", to: "/projects/demo/geometry", icon: Boxes },
  { labelKey: "loads", to: "/projects/demo/loads", icon: Weight },
  { labelKey: "analysis", to: "/projects/demo/analysis", icon: BarChart3 },
  { labelKey: "design", to: "/projects/demo/design", icon: ClipboardCheck },
  { labelKey: "report", to: "/projects/demo/report", icon: FileText },
  { labelKey: "verification", to: "/verification", icon: ShieldCheck },
  { labelKey: "settings", to: "/settings", icon: Settings },
] as const;
