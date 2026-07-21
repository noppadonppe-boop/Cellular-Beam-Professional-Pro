export function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-label="Loading">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line" />
      <div className="skeleton-grid">
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
