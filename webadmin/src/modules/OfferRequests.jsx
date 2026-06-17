import { useState } from "react";
import { useCollection } from "../hooks/useCollection";
import { updateDocById } from "../services/firestore";
import { COLLECTIONS, OFFER_REQUEST_STATUSES } from "../services/collections";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { Loading, ErrorState, Badge, formatDate, statusTone } from "../components/ui";

export default function OfferRequests() {
  const { rows, loading, error } = useCollection(COLLECTIONS.OFFER_REQUESTS);
  const [details, setDetails] = useState(null);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  const setStatus = (row, status) => updateDocById(COLLECTIONS.OFFER_REQUESTS, row.id, { status });

  const sorted = [...rows].sort((a, b) => {
    const at = a.createdAt?.toMillis?.() ?? 0;
    const bt = b.createdAt?.toMillis?.() ?? 0;
    return bt - at;
  });

  const columns = [
    { key: "customerName", label: "Client", sortable: true },
    { key: "eventType", label: "Eveniment" },
    { key: "eventDate", label: "Dată eveniment" },
    { key: "guestCount", label: "Invitați", sortable: true },
    { key: "phone", label: "Telefon" },
    { key: "createdAt", label: "Primită", render: (r) => formatDate(r.createdAt) },
    { key: "status", label: "Status", render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
    {
      key: "_view",
      label: "",
      render: (r) => (
        <button className="btn btn-xs" onClick={() => setDetails(r)}>
          Detalii
        </button>
      )
    },
    {
      key: "_set",
      label: "Schimbă status",
      render: (r) => (
        <select value={r.status} onChange={(e) => setStatus(r, e.target.value)} className="status-selector">
          {OFFER_REQUEST_STATUSES.map((s) => (
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
      <DataTable columns={columns} rows={sorted} searchKeys={["customerName", "eventType", "phone"]} emptyMessage="Nicio cerere de eveniment încă." />
      {details && (
        <Modal title={`Cerere · ${details.customerName}`} onClose={() => setDetails(null)}>
          <p><strong>Email:</strong> {details.email || "—"}</p>
          <p><strong>Telefon:</strong> {details.phone || "—"}</p>
          <p><strong>Tip eveniment:</strong> {details.eventType || "—"}</p>
          <p><strong>Dată:</strong> {details.eventDate || "—"} · <strong>Invitați:</strong> {details.guestCount || "—"}</p>
          <p><strong>Mesaj:</strong></p>
          <p className="msg-block">{details.message || "—"}</p>
        </Modal>
      )}
    </div>
  );
}
