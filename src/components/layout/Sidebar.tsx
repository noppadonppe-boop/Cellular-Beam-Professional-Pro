import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navItems } from "@/components/layout/nav-config";
import { translate } from "@/lib/i18n";
import { useAppStore } from "@/stores/app-store";

export function Sidebar() {
  const { locale, sidebarOpen, setSidebarOpen } = useAppStore();
  return <><aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}><div className="brand"><span>CB</span><div><strong>Cellular Beam</strong><small>PROFESSIONAL</small></div><button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={18} /></button></div><nav>{navItems.map(({ labelKey, to, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}><Icon size={17} /><span>{translate(locale, labelKey)}</span></NavLink>)}</nav><div className="sidebar-status"><span /><div><strong>Phase 1 Foundation</strong><small>No calculation engine</small></div></div></aside>{sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation overlay" />}</>;
}
