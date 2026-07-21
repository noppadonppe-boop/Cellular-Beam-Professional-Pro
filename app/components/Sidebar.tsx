import { navGroups } from "./data";

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand-row">
        <div className="brand-mark">CB</div>
        <div><strong>Cellular Beam</strong><span>PROFESSIONAL</span></div>
        <button className="icon-button mobile-only" onClick={onClose} aria-label="Close navigation">×</button>
      </div>
      <nav aria-label="Main navigation">
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            <p>{group.label}</p>
            {group.items.map(([icon, label]) => (
              <button key={label} className={`nav-item ${label === "Dashboard" ? "active" : ""}`}>
                <span aria-hidden="true">{icon}</span>{label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className="nav-item"><span>↻</span>Revisions</button>
        <button className="nav-item"><span>⚙</span>Settings</button>
        <div className="verification"><span>✓</span><div><strong>Engine verified</strong><small>v0.8.2 · Demo mode</small></div></div>
      </div>
    </aside>
  );
}
