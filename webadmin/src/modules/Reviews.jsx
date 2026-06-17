import CrudModule from "../components/CrudModule";
import { COLLECTIONS } from "../services/collections";
import { Badge, formatDate } from "../components/ui";

export default function Reviews() {
  return (
    <CrudModule
      collectionName={COLLECTIONS.REVIEWS}
      title="Recenzii"
      searchKeys={["name", "text"]}
      defaults={{ name: "", rating: 5, text: "", approved: true }}
      fields={[
        { name: "name", label: "Nume", type: "text", required: true },
        { name: "rating", label: "Rating (1-5)", type: "number", step: "1", required: true },
        { name: "text", label: "Text", type: "textarea", required: true },
        { name: "approved", label: "Aprobată (vizibilă pe site)", type: "checkbox" }
      ]}
      fromForm={(v) => ({
        name: v.name,
        rating: Math.max(1, Math.min(5, Number(v.rating) || 5)),
        text: v.text || "",
        approved: !!v.approved
      })}
      inlineToggles={[{ field: "approved", kind: "bool", onLabel: "Aprobată", offLabel: "Ascunsă" }]}
      columns={[
        { key: "name", label: "Nume", sortable: true },
        { key: "rating", label: "Rating", sortable: true, render: (r) => "⭐".repeat(r.rating || 0) },
        { key: "text", label: "Text", render: (r) => <span className="cell-clip">{r.text}</span> },
        { key: "createdAt", label: "Dată", render: (r) => formatDate(r.createdAt, false) },
        {
          key: "approved",
          label: "Stare",
          render: (r) => <Badge tone={r.approved ? "ok" : "warn"}>{r.approved ? "Aprobată" : "În așteptare"}</Badge>
        }
      ]}
    />
  );
}
