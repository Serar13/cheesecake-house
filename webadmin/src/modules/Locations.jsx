import CrudModule from "../components/CrudModule";
import { COLLECTIONS } from "../services/collections";
import { Badge } from "../components/ui";

export default function Locations() {
  return (
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
  );
}
