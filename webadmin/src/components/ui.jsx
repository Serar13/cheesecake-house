// Small shared presentational helpers: loading / error / empty states, badges,
// and formatting utilities reused across every module.

export function Loading({ label = "Se încarcă…" }) {
  return (
    <div className="state state-loading">
      <span className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message = "A apărut o eroare.", onRetry }) {
  return (
    <div className="state state-error">
      <span className="state-icon">⚠️</span>
      <p>{message}</p>
      {onRetry && (
        <button className="btn" onClick={onRetry}>
          Reîncearcă
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = "Nu există date încă.", action }) {
  return (
    <div className="state state-empty">
      <span className="state-icon">📭</span>
      <p>{message}</p>
      {action}
    </div>
  );
}

export function Badge({ children, tone = "default" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function formatMoney(value) {
  const n = Number(value || 0);
  return `${n.toFixed(2)} RON`;
}

// Accepts Firestore Timestamp, JS Date, ISO string, or millis.
export function formatDate(value, withTime = true) {
  if (!value) return "—";
  let date;
  if (typeof value?.toDate === "function") date = value.toDate();
  else if (value instanceof Date) date = value;
  else date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  const opts = withTime
    ? { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }
    : { day: "2-digit", month: "2-digit", year: "numeric" };
  return date.toLocaleDateString("ro-RO", opts);
}

const STATUS_TONES = {
  pending: "warn",
  preparing: "info",
  ready: "info",
  delivered: "ok",
  cancelled: "danger",
  confirmed: "ok",
  new: "warn",
  contacted: "info",
  quoted: "info",
  accepted: "ok",
  rejected: "danger"
};

export function statusTone(status) {
  return STATUS_TONES[status] || "default";
}
