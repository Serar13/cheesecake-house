import CrudModule from "../components/CrudModule";
import { COLLECTIONS } from "../services/collections";
import { Badge } from "../components/ui";
import { useCollection } from "../hooks/useCollection";

function TableMarker({ table }) {
  const x = Number(table.x ?? 50);
  const y = Number(table.y ?? 50);
  const seats = Number(table.seats || 0);
  return (
    <div
      className={`floor-table ${table.active ? "" : "inactive"}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      title={`${table.name} · ${seats} locuri${table.notes ? ` · ${table.notes}` : ""}`}
    >
      <span>{table.name?.replace(/masa/i, "").trim() || "?"}</span>
      <small>{seats}</small>
    </div>
  );
}

function FloorPlan({ location, tables }) {
  const locationTables = tables
    .filter((table) => table.locationId === location.id)
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "ro"));

  return (
    <section className="floor-card">
      <div className="floor-card-head">
        <div>
          <h3>{location.name}</h3>
          <p>{location.address}</p>
        </div>
        <Badge tone={location.active ? "ok" : "default"}>{location.active ? "Activă" : "Inactivă"}</Badge>
      </div>

      <div className="floor-plan">
        <div className="floor-zone floor-zone-counter">Vitrină & bar</div>
        <div className="floor-zone floor-zone-entry">Intrare</div>
        <div className="floor-zone floor-zone-terrace">Terasă</div>
        {locationTables.map((table) => (
          <TableMarker key={table.id} table={table} />
        ))}
      </div>

      <div className="floor-legend">
        <span><b>{locationTables.length}</b> mese</span>
        <span><b>{locationTables.reduce((sum, table) => sum + Number(table.seats || 0), 0)}</b> locuri</span>
        <span>{location.schedule}</span>
      </div>
    </section>
  );
}

export default function Locations() {
  const { rows: locations } = useCollection(COLLECTIONS.LOCATIONS);
  const { rows: tables } = useCollection(COLLECTIONS.TABLES);

  return (
    <>
      <div className="floor-grid">
        {locations
          .slice()
          .sort((a, b) => String(a.city).localeCompare(String(b.city), "ro"))
          .map((location) => (
            <FloorPlan key={location.id} location={location} tables={tables} />
          ))}
      </div>

      <CrudModule
        collectionName={COLLECTIONS.LOCATIONS}
        title="Locații"
        searchKeys={["name", "city", "address"]}
        defaults={{
          name: "",
          city: "",
          address: "",
          phone: "",
          email: "",
          schedule: "",
          lat: "",
          lng: "",
          active: true
        }}
        fields={[
          { name: "name", label: "Nume", type: "text", required: true },
          { name: "city", label: "Oraș", type: "text", required: true },
          { name: "address", label: "Adresă", type: "text" },
          { name: "phone", label: "Telefon", type: "text" },
          { name: "email", label: "Email", type: "text" },
          { name: "schedule", label: "Program", type: "text" },
          { name: "lat", label: "Latitudine", type: "number" },
          { name: "lng", label: "Longitudine", type: "number" },
          { name: "active", label: "Activă", type: "checkbox" }
        ]}
        toForm={(row) => ({
          ...row,
          lat: row.coordinates?.lat ?? "",
          lng: row.coordinates?.lng ?? ""
        })}
        fromForm={(v) => ({
          name: v.name,
          city: v.city || "",
          address: v.address || "",
          phone: v.phone || "",
          email: v.email || "",
          schedule: v.schedule || "",
          coordinates: {
            lat: v.lat === "" ? null : Number(v.lat),
            lng: v.lng === "" ? null : Number(v.lng)
          },
          active: !!v.active
        })}
        inlineToggles={[{ field: "active", kind: "bool", onLabel: "Activă", offLabel: "Inactivă" }]}
        columns={[
          { key: "name", label: "Nume", sortable: true },
          { key: "city", label: "Oraș", sortable: true },
          { key: "phone", label: "Telefon" },
          { key: "schedule", label: "Program" },
          {
            key: "active",
            label: "Stare",
            render: (r) => <Badge tone={r.active ? "ok" : "default"}>{r.active ? "Activă" : "Inactivă"}</Badge>
          }
        ]}
      />
    </>
  );
}
