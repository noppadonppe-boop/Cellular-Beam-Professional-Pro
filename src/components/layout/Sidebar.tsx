import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navGroups, utilityItems } from "@/components/layout/nav-config";
import { translate } from "@/lib/i18n";
import { useAppStore } from "@/stores/app-store";

export function Sidebar() {
  const { locale, sidebarOpen, setSidebarOpen } = useAppStore();
  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span>CB</span>
          <div>
            <strong>Cellular Beam</strong>
            <small>PROFESSIONAL</small>
          </div>
          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navGroups.map((group) => (
            <section className="nav-group" key={group.label}>
              <h2>{group.label}</h2>
              {group.items.map((item) => {
                const Icon = item.icon;
                const label = "labelKey" in item ? translate(locale, item.labelKey) : item.label;
                return (
                  <NavLink
                    key={`${item.to}-${label}`}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  >
                    <Icon size={14} strokeWidth={1.5} />
                    <span>{label}</span>
                  </NavLink>
                );
              })}
            </section>
          ))}
        </nav>
        <nav className="utility-nav">
          {utilityItems.map((item) => {
            const Icon = item.icon;
            const label = "labelKey" in item ? translate(locale, item.labelKey) : item.label;
            return (
              <NavLink key={item.to} to={item.to} className="nav-link">
                <Icon size={14} strokeWidth={1.5} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="sidebar-status">
          <span>✓</span>
          <div>
            <strong>Foundation verified</strong>
            <small>Phase 2 · Units & sections</small>
          </div>
        </div>
      </aside>
      {sidebarOpen && (
        <button
          className="sidebar-scrim"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}
    </>
  );
}
