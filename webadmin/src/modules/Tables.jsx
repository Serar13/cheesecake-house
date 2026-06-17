import CrudModule from "../components/CrudModule";
import { COLLECTIONS } from "../services/collections";
import { useCollection } from "../hooks/useCollection";
import { Loading, Badge } from "../components/ui";

export default function Tables() {
  const { rows: locations, loading } = useCollection(COLLECTIONS.LOCATIONS);
  if (loading) return <Loading />;

  const locOptions = locations.map((l) => ({ value: l.id, label: l.name }));
  const locName = (id) => locations.find((l) => l.id === id)?.name || id || "—";

  return (
    <CrudModule
      collectionName={COLLECTIONS.TABLES}
      title="Mese"
      searchKeys={["name", "notes"]}
      defaults={{ locationId: "", name: "", seats: 2, x: 50, y: 50, active: true, notes: "" }}
      fields={[
        { name: "locationId", label: "Locație", type: "select", options: locOptions, required: true },
        { name: "name", label: "Nume masă", type: "text", required: true },
        { name: "seats", label: "Locuri", type: "number", step: "1", required: true },
        { name: "x", label: "Poziție X pe hartă (%)", type: "number", step: "1" },
        { name: "y", label: "Poziție Y pe hartă (%)", type: "number", step: "1" },
        { name: "notes", label: "Note", type: "text" },
        { name: "active", label: "Activă", type: "checkbox" }
      ]}
      fromForm={(v) => ({
        locationId: v.locationId || "",
        name: v.name,
        seats: Number(v.seats) || 0,
        x: Math.max(5, Math.min(95, Number(v.x) || 50)),
        y: Math.max(8, Math.min(92, Number(v.y) || 50)),
        notes: v.notes || "",
        active: !!v.active
      })}
      inlineToggles={[{ field: "active", kind: "bool", onLabel: "Activă", offLabel: "Inactivă" }]}
      columns={[
        { key: "name", label: "Masă", sortable: true },
        { key: "locationId", label: "Locație", render: (r) => locName(r.locationId), sortable: true },
        { key: "seats", label: "Locuri", sortable: true },
        { key: "x", label: "X", sortable: true },
        { key: "y", label: "Y", sortable: true },
        { key: "notes", label: "Note" },
        {
          key: "active",
          label: "Stare",
          render: (r) => <Badge tone={r.active ? "ok" : "default"}>{r.active ? "Activă" : "Inactivă"}</Badge>
        }
      ]}
    />
  );
}
