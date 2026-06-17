import { useMemo } from "react";
import { useCollection } from "../hooks/useCollection";
import { COLLECTIONS } from "../services/collections";
import { Loading, Badge, formatMoney, formatDate, statusTone } from "../components/ui";

const millis = (ts) => ts?.toMillis?.() ?? (ts ? new Date(ts).getTime() : 0);
const isToday = (ts) => {
  const m = millis(ts);
  if (!m) return false;
  const d = new Date(m);
  const now = new Date();
  return d.toDateString() === now.toDateString();
};

export default function Dashboard() {
  const { rows: orders, loading: lo } = useCollection(COLLECTIONS.ORDERS);
  const { rows: reservations, loading: lr } = useCollection(COLLECTIONS.RESERVATIONS);

  const stats = useMemo(() => {
    const active = orders.filter((o) => o.status !== "cancelled");
    const totalSales = active.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const ordersToday = orders.filter((o) => isToday(o.createdAt)).length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const activeReservations = reservations.filter((r) => r.status === "pending" || r.status === "confirmed").length;

    const bySource = active.reduce(
      (acc, o) => {
        const src = o.source === "mobile" ? "mobile" : "site";
        acc[src] += Number(o.total) || 0;
        return acc;
      },
      { site: 0, mobile: 0 }
    );

    const productTally = {};
    for (const o of active) {
      for (const it of o.items || []) {
        const key = it.name || it.productId || "necunoscut";
        productTally[key] = (productTally[key] || 0) + (Number(it.quantity) || 0);
      }
    }
    const topProducts = Object.entries(productTally)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const recentOrders = [...orders].sort((a, b) => millis(b.createdAt) - millis(a.createdAt)).slice(0, 5);
    const recentReservations = [...reservations].sort((a, b) => millis(b.createdAt) - millis(a.createdAt)).slice(0, 5);

    return { totalSales, ordersToday, pending, activeReservations, bySource, topProducts, recentOrders, recentReservations };
  }, [orders, reservations]);

  if (lo || lr) return <Loading />;

  return (
    <div className="module dashboard">
      <div className="stats-row">
        <StatCard label="Vânzări totale" value={formatMoney(stats.totalSales)} />
        <StatCard label="Comenzi azi" value={stats.ordersToday} />
        <StatCard label="Comenzi în așteptare" value={stats.pending} />
        <StatCard label="Rezervări active" value={stats.activeReservations} />
      </div>

      <div className="dash-grid">
        <div className="card">
          <h3>Venituri pe sursă</h3>
          <div className="source-bars">
            <SourceBar label="Site" value={stats.bySource.site} total={stats.bySource.site + stats.bySource.mobile} />
            <SourceBar label="Mobile" value={stats.bySource.mobile} total={stats.bySource.site + stats.bySource.mobile} />
          </div>
        </div>

        <div className="card">
          <h3>Cele mai vândute produse</h3>
          {stats.topProducts.length === 0 ? (
            <p className="muted">Nicio vânzare încă.</p>
          ) : (
            <ol className="top-list">
              {stats.topProducts.map(([name, qty]) => (
                <li key={name}>
                  <span>{name}</span>
                  <Badge tone="info">{qty}</Badge>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div className="dash-grid">
        <div className="card">
          <h3>Comenzi recente</h3>
          {stats.recentOrders.length === 0 ? (
            <p className="muted">Nicio comandă.</p>
          ) : (
            <table className="admin-table compact">
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.customerName || "—"}</td>
                    <td>{formatMoney(o.total)}</td>
                    <td><Badge tone={o.source === "mobile" ? "info" : "default"}>{o.source}</Badge></td>
                    <td><Badge tone={statusTone(o.status)}>{o.status}</Badge></td>
                    <td>{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h3>Rezervări recente</h3>
          {stats.recentReservations.length === 0 ? (
            <p className="muted">Nicio rezervare.</p>
          ) : (
            <table className="admin-table compact">
              <tbody>
                {stats.recentReservations.map((r) => (
                  <tr key={r.id}>
                    <td>{r.customerName || "—"}</td>
                    <td>{r.date} {r.time}</td>
                    <td>{r.guests} pers.</td>
                    <td><Badge tone={statusTone(r.status)}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <h3>{label}</h3>
      <span className="stat-val">{value}</span>
    </div>
  );
}

function SourceBar({ label, value, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="source-bar">
      <div className="source-bar-head">
        <span>{label}</span>
        <strong>{formatMoney(value)}</strong>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
