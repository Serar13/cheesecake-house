import CrudModule from "../components/CrudModule";
import { COLLECTIONS, DISCOUNT_TYPES } from "../services/collections";
import { useCollection } from "../hooks/useCollection";
import { Loading, Badge } from "../components/ui";

// Firestore Timestamp -> value for <input type=datetime-local>
const tsToLocal = (ts) => {
  if (!ts) return "";
  const d = typeof ts?.toDate === "function" ? ts.toDate() : new Date(ts);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function Promotions() {
  const { rows: products, loading: lp } = useCollection(COLLECTIONS.PRODUCTS, { orderByField: "sortOrder" });
  const { rows: categories, loading: lc } = useCollection(COLLECTIONS.CATEGORIES, { orderByField: "sortOrder" });
  if (lp || lc) return <Loading />;

  return (
    <CrudModule
      collectionName={COLLECTIONS.PROMOTIONS}
      title="Promoții"
      searchKeys={["title", "code"]}
      defaults={{
        title: "",
        description: "",
        code: "",
        discountType: "percent",
        discountValue: 0,
        active: true,
        startsAt: "",
        endsAt: "",
        targetProductId: "",
        targetCategoryId: "",
        exclusive: false
      }}
      fields={[
        { name: "title", label: "Titlu", type: "text", required: true },
        { name: "description", label: "Descriere", type: "textarea" },
        { name: "code", label: "Cod", type: "text" },
        { name: "discountType", label: "Tip reducere", type: "select", options: DISCOUNT_TYPES.map((d) => ({ value: d, label: d })) },
        { name: "discountValue", label: "Valoare reducere", type: "number" },
        { name: "startsAt", label: "Începe la", type: "datetime" },
        { name: "endsAt", label: "Se termină la", type: "datetime" },
        { name: "targetProductId", label: "Produs țintă", type: "select", options: products.map((p) => ({ value: p.id, label: p.name })) },
        { name: "targetCategoryId", label: "Categorie țintă", type: "select", options: categories.map((c) => ({ value: c.id, label: c.name })) },
        { name: "active", label: "Activă", type: "checkbox" },
        { name: "exclusive", label: "Ofertă exclusivă (VIP)", type: "checkbox" }
      ]}
      toForm={(row) => ({
        ...row,
        startsAt: tsToLocal(row.startsAt),
        endsAt: tsToLocal(row.endsAt)
      })}
      fromForm={(v) => ({
        title: v.title,
        description: v.description || "",
        code: v.code || "",
        discountType: v.discountType || "percent",
        discountValue: Number(v.discountValue) || 0,
        startsAt: v.startsAt ? new Date(v.startsAt) : null,
        endsAt: v.endsAt ? new Date(v.endsAt) : null,
        targetProductId: v.targetProductId || null,
        targetCategoryId: v.targetCategoryId || null,
        active: !!v.active,
        exclusive: !!v.exclusive
      })}
      inlineToggles={[
        { field: "active", kind: "bool", onLabel: "Activă", offLabel: "Inactivă" },
        { field: "exclusive", kind: "bool", onLabel: "Exclusivă", offLabel: "Publică" }
      ]}
      columns={[
        { key: "title", label: "Titlu", sortable: true },
        { key: "code", label: "Cod" },
        {
          key: "discountValue",
          label: "Reducere",
          render: (r) => (r.discountType === "percent" ? `${r.discountValue}%` : `${r.discountValue} RON`)
        },
        {
          key: "exclusive",
          label: "Tip",
          render: (r) => (r.exclusive ? <Badge tone="info">Exclusivă</Badge> : "Publică")
        },
        {
          key: "active",
          label: "Stare",
          render: (r) => <Badge tone={r.active ? "ok" : "default"}>{r.active ? "Activă" : "Inactivă"}</Badge>
        }
      ]}
    />
  );
}
