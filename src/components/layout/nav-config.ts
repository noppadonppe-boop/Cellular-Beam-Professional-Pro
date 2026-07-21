import {
  Activity,
  Box,
  BarChart3,
  ClipboardCheck,
  Combine,
  DraftingCompass,
  FileText,
  FolderKanban,
  Gauge,
  Library,
  LifeBuoy,
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
      { label: "Materials", to: "/verification", icon: PackageCheck },
      { labelKey: "sections", to: "/sections", icon: Library },
      { label: "Supports", to: "/projects/demo/geometry", icon: LifeBuoy },
      { labelKey: "loads", to: "/projects/demo/loads", icon: MoveDown },
      { label: "Load Combinations", to: "/projects/demo/loads", icon: Combine },
    ],
  },
  {
    label: "RESULTS",
    items: [
      { labelKey: "analysis", to: "/projects/demo/analysis", icon: Activity },
      { labelKey: "design", to: "/projects/demo/design", icon: ClipboardCheck },
      { label: "Optimization", to: "/projects/demo/design", icon: BarChart3 },
      { label: "Drawings", to: "/projects/demo/report", icon: DraftingCompass },
      { labelKey: "report", to: "/projects/demo/report", icon: FileText },
    ],
  },
] as const;

export const utilityItems = [
  { label: "Revisions", to: "/verification", icon: RefreshCw },
  { labelKey: "settings", to: "/settings", icon: Settings },
] as const;
