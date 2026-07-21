import { CheckCircle2, Database, FolderKanban, Languages, MoonStar, Route, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";
import { translate } from "@/lib/i18n";

const foundations = [
  [Route, "Application routing", "10 workflow routes configured"], [ShieldCheck, "Strict TypeScript", "Strict domain boundaries enabled"],
  [Database, "Firebase bootstrap", "Environment-driven configuration"], [MoonStar, "Theme system", "Light and dark modes"],
  [Languages, "Localization", "Thai and English foundations"], [CheckCircle2, "Quality tooling", "Tests, lint, formatting, build"],
] as const;

export function DashboardPage() {
  const locale = useAppStore((state) => state.locale);
  return <div className="page"><header className="page-header"><div><span className="eyebrow">PROJECT FOUNDATION</span><h1>{translate(locale, "dashboard")}</h1><p>{translate(locale, "phaseOne")}</p></div><Button asChild><Link to="/projects"><FolderKanban size={16} />{translate(locale, "projects")}</Link></Button></header><section className="foundation-banner"><span>PHASE 1</span><div><h2>Application infrastructure is operational</h2><p>No engineering calculation results are generated in this phase. Analysis and design routes remain controlled empty states until verified engines are implemented.</p></div></section><section className="foundation-grid">{foundations.map(([Icon, title, description]) => <article key={title}><Icon size={19} /><div><h3>{title}</h3><p>{description}</p></div></article>)}</section><section className="next-action"><div><span className="eyebrow">GET STARTED</span><h2>Create the first project record</h2><p>Project persistence will connect to Firestore after Firebase credentials and security rules are approved.</p></div><Button variant="outline" asChild><Link to="/projects">Open projects →</Link></Button></section></div>;
}
