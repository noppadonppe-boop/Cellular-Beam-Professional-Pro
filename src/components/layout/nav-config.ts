import {
  Activity,
  BookOpen,
  Box,
  ClipboardCheck,
  FileText,
  FolderKanban,
  Gauge,
  Library,
  MoveDown,
  PackageCheck,
  RefreshCw,
  Settings,
  SlidersHorizontal,
} from "lucide-react";

export const navGroups = [
  {
    label: "WORKSPACE",
    items: [
      { labelKey: "dashboard", to: "/dashboard", icon: Gauge },
      { labelKey: "projects", to: "/projects", icon: FolderKanban },
      { labelKey: "criteria", to: "/projects/demo/criteria", icon: SlidersHorizontal },
      { label: "Project Settings", to: "/projects/demo/settings", icon: Settings },
    ],
  },
  {
    label: "MODEL",
    items: [
      { labelKey: "geometry", to: "/projects/demo/geometry", icon: Box },
      { label: "Material Verification", to: "/verification", icon: PackageCheck },
      { labelKey: "sections", to: "/sections", icon: Library },
      { labelKey: "loads", to: "/projects/demo/loads", icon: MoveDown },
    ],
  },
  {
    label: "RESULTS",
    items: [
      { labelKey: "analysis", to: "/projects/demo/analysis", icon: Activity },
      { labelKey: "design", to: "/projects/demo/design", icon: ClipboardCheck },
      { labelKey: "report", to: "/projects/demo/report", icon: FileText },
    ],
  },
] as const;

export const utilityItems = [
  { label: "Manual", to: "/manual", icon: BookOpen },
  { label: "Revisions", to: "/verification", icon: RefreshCw },
  { labelKey: "settings", to: "/settings", icon: Settings },
] as const;
