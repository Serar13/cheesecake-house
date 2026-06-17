import { useCollection } from "../hooks/useCollection";
import { updateDocById } from "../services/firestore";
import { COLLECTIONS, RESERVATION_STATUSES } from "../services/collections";
import DataTable from "../components/DataTable";
import { Loading, ErrorState, Badge, formatDate, statusTone } from "../components/ui";

export default function Reservations() {
  const { rows, loading, error } = useCollection(COLLECTIONS.RESERVATIONS);
  const { rows: locations } = useCollection(COLLECTIONS.LOCATIONS);
  const { rows: tables } = useCollection(COLLECTIONS.TABLES);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  const locName = (id) => locations.find((l) => l.id === id)?.name || id || "—";
  const tableName = (id) => tables.find((t) => t.id === id)?.name || id || "—";
  const setStatus = (row, status) => updateDocById(COLLECTIONS.RESERVATIONS, row.id, { status });

  const sorted = [...rows].sort((a, b) => {
    const at = a.createdAt?.toMillis?.() ?? 0;
    const bt = b.createdAt?.toMillis?.() ?? 0;
    return bt - at;
  });

  const columns = [
    { key: "customerName", label: "Client", sortable: true },
    { key: "locationId", label: "Locație", render: (r) => locName(r.locationId) },
    { key: "tableId", label: "Masă", render: (r) => tableName(r.tableId) },
    { key: "date", label: "Dată", sortable: true },
    { key: "time", label: "Ora" },
    { key: "durationMinutes", label: "Durată", render: (r) => `${r.durationMinutes || 90} min` },
    { key: "guests", label: "Persoane", sortable: true },
    { key: "createdAt", label: "Creată", render: (r) => formatDate(r.createdAt) },
    { key: "status", label: "Status", render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
    {
      key: "_set",
      label: "Schimbă status",
      render: (r) => (
        <select value={r.status} onChange={(e) => setStatus(r, e.target.value)} className="status-selector">
          {RESERVATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )
    }
  ];

  return (
    <div className="module">
      <DataTable columns={columns} rows={sorted} searchKeys={["customerName", "date"]} emptyMessage="Nicio rezervare încă." />
    </div>
  );
}
