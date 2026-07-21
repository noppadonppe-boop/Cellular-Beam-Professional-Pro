import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";

type Props = { eyebrow: string; title: string; description: string; emptyTitle: string; emptyDescription: string; icon: LucideIcon };
export function ModulePlaceholder({ eyebrow, title, description, emptyTitle, emptyDescription, icon }: Props) {
  return <div className="page"><header className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div><span className="not-implemented">NOT IMPLEMENTED</span></header><div className="content-card"><EmptyState title={emptyTitle} description={emptyDescription} icon={icon} /></div></div>;
}
