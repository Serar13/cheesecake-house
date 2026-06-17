import { useState } from "react";
import { useCollection } from "../hooks/useCollection";
import { updateDocById } from "../services/firestore";
import { COLLECTIONS, ORDER_STATUSES } from "../services/collections";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { Loading, ErrorState, Badge, formatMoney, formatDate, statusTone } from "../components/ui";

export default function Orders() {
  const { rows, loading, error } = useCollection(COLLECTIONS.ORDERS);
  const { rows: locations } = useCollection(COLLECTIONS.LOCATIONS);
  const [details, setDetails] = useState(null);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  const locName = (id) => locations.find((l) => l.id === id)?.name || id || "—";
  const setStatus = (row, status) => updateDocById(COLLECTIONS.ORDERS, row.id, { status });

  // Newest first.
  const sorted = [...rows].sort((a, b) => {
    const at = a.createdAt?.toMillis?.() ?? 0;
    const bt = b.createdAt?.toMillis?.() ?? 0;
    return bt - at;
  });

  const columns = [
    { key: "id", label: "ID", render: (r) => <code>{r.id.slice(0, 8)}</code> },
    { key: "customerName", label: "Client", sortable: true },
    {
      key: "items",
      label: "Produse",
      render: (r) => (
        <button className="btn btn-xs" onClick={() => setDetails(r)}>
          {(r.items?.length || 0)} produse
        </button>
      )
    },
    { key: "total", label: "Total", sortable: true, sortValue: (r) => Number(r.total) || 0, render: (r) => formatMoney(r.total) },
    {
      key: "source",
      label: "Sursă",
      render: (r) => <Badge tone={r.source === "mobile" ? "info" : "default"}>{r.source || "—"}</Badge>
    },
    { key: "locationId", label: "Locație", render: (r) => locName(r.locationId) },
    { key: "createdAt", label: "Creată", sortable: true, sortValue: (r) => r.createdAt?.toMillis?.() ?? 0, render: (r) => formatDate(r.createdAt) },
    {
      key: "status",
      label: "Status",
      render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge>
    },
    {
      key: "_set",
      label: "Schimbă status",
      render: (r) => (
        <select value={r.status} onChange={(e) => setStatus(r, e.target.value)} className="status-selector">
          {ORDER_STATUSES.map((s) => (
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
      <DataTable columns={columns} rows={sorted} searchKeys={["customerName", "id"]} emptyMessage="Nicio comandă încă." />
      {details && (
        <Modal title={`Comandă ${details.id.slice(0, 8)}`} onClose={() => setDetails(null)}>
          <p>
            <strong>Client:</strong> {details.customerName || "—"} · <strong>Sursă:</strong> {details.source}
          </p>
          <p>
            <strong>Locație:</strong> {locName(details.locationId)} · <strong>Status:</strong> {details.status}
          </p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produs</th>
                <th>Cant.</th>
                <th>Preț</th>
              </tr>
            </thead>
            <tbody>
              {(details.items || []).map((it, i) => (
                <tr key={i}>
                  <td>{it.name}</td>
                  <td>{it.quantity}</td>
                  <td>{formatMoney(it.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="modal-total">Total: {formatMoney(details.total)}</p>
        </Modal>
      )}
    </div>
  );
}
