import CrudModule from "../components/CrudModule";
import { COLLECTIONS } from "../services/collections";
import { Badge } from "../components/ui";

const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function Categories() {
  return (
    <CrudModule
      collectionName={COLLECTIONS.CATEGORIES}
      title="Categorii"
      orderByField="sortOrder"
      idField="slug"
      searchKeys={["name", "slug"]}
      defaults={{ name: "", slug: "", icon: "🍰", sortOrder: 1, active: true }}
      fields={[
        { name: "name", label: "Nume", type: "text", required: true },
        { name: "slug", label: "Slug (id)", type: "text", required: true, help: "Folosit ca id și în URL. ex: cheesecake-jar" },
        { name: "icon", label: "Icon (emoji)", type: "text" },
        { name: "sortOrder", label: "Ordine", type: "number", step: "1" },
        { name: "active", label: "Activă", type: "checkbox" }
      ]}
      fromForm={(v) => ({
        name: v.name,
        slug: v.slug || slugify(v.name),
        icon: v.icon || "",
        sortOrder: Number(v.sortOrder) || 0,
        active: !!v.active
      })}
      inlineToggles={[{ field: "active", kind: "bool", onLabel: "Activă", offLabel: "Inactivă" }]}
      columns={[
        { key: "sortOrder", label: "#", sortable: true },
        { key: "icon", label: "" },
        { key: "name", label: "Nume", sortable: true },
        { key: "slug", label: "Slug" },
        {
          key: "active",
          label: "Stare",
          render: (r) => <Badge tone={r.active ? "ok" : "default"}>{r.active ? "Activă" : "Inactivă"}</Badge>
        }
      ]}
    />
  );
}
