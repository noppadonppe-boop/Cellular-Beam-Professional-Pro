export function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="topbar">
      <button className="icon-button menu-button" onClick={onMenu} aria-label="Open navigation">☰</button>
      <div className="project-identity">
        <div className="project-icon">CB</div>
        <div><strong>CB-24018 · Warehouse Roof Beam</strong><span>Bang Na Logistics Center</span></div>
      </div>
      <div className="top-actions">
        <span className="save-state"><i /> Saved</span>
        <button className="outline-button compact">EN <span>⌄</span></button>
        <button className="icon-button" aria-label="Notifications">♢<b className="notification-dot" /></button>
        <button className="avatar" aria-label="User profile">SK</button>
      </div>
    </header>
  );
}
