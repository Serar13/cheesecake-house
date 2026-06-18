import { useCollection } from "../hooks/useCollection";
import { updateDocById } from "../services/firestore";
import { COLLECTIONS } from "../services/collections";
import DataTable from "../components/DataTable";
import { Loading, ErrorState, Badge } from "../components/ui";

// Loyalty model: the apps store points in `vipPoints` and stamps in `stamps`
// (with `loyaltyPoints`/`loyaltyStamps`/`loyaltyTier` accepted as aliases).
const points = (u) => Number(u.vipPoints ?? u.loyaltyPoints ?? 0);
const stamps = (u) => Number(u.stamps ?? u.loyaltyStamps ?? 0);

function tier(u) {
  if (u.loyaltyTier) return u.loyaltyTier;
  const p = points(u);
  if (p >= 500) return "Gold";
  if (p >= 200) return "Silver";
  return "Bronze";
}

export default function Users() {
  const { rows, loading, error } = useCollection(COLLECTIONS.USERS);
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  const toggleAdmin = (u) => {
    const next = u.role === "admin" ? "customer" : "admin";
    if (!window.confirm(`Schimbi rolul lui ${u.name || u.email} în „${next}”?`)) return;
    updateDocById(COLLECTIONS.USERS, u.id, { role: next });
  };

  const columns = [
    { key: "name", label: "Nume", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Telefon" },
    {
      key: "stamps",
      label: "Card fidelitate",
      render: (u) => {
        const s = stamps(u);
        const max = 9;
        return (
          <span title={`${s}/${max} ștampile`}>
            {"●".repeat(Math.min(s, max))}
            {"○".repeat(Math.max(0, max - s))} ({s}/{max})
          </span>
        );
      }
    },
    { key: "points", label: "Puncte", sortable: true, sortValue: (u) => points(u), render: (u) => points(u) },
    { key: "tier", label: "Rang", render: (u) => <Badge tone="info">{tier(u)}</Badge> },
    {
      key: "role",
      label: "Rol",
      render: (u) => <Badge tone={u.role === "admin" ? "ok" : "default"}>{u.role || "customer"}</Badge>
    },
    {
      key: "_role",
      label: "Acțiuni",
      render: (u) => (
        <button className="btn btn-xs" onClick={() => toggleAdmin(u)}>
          {u.role === "admin" ? "Revocă admin" : "Fă admin"}
        </button>
      )
    }
  ];

  return (
    <div className="module">
      <DataTable columns={columns} rows={rows} searchKeys={["name", "email", "phone"]} emptyMessage="Niciun utilizator." />
    </div>
  );
}
