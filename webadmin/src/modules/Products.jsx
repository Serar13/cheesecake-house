import CrudModule from "../components/CrudModule";
import { COLLECTIONS, AVAILABILITY } from "../services/collections";
import { useCollection } from "../hooks/useCollection";
import { Loading } from "../components/ui";
import { Badge, formatMoney } from "../components/ui";

export default function Products() {
  const { rows: categories, loading } = useCollection(COLLECTIONS.CATEGORIES, { orderByField: "sortOrder" });
  if (loading) return <Loading />;

  const catOptions = categories.map((c) => ({ value: c.id, label: c.name }));
  const catName = (id) => categories.find((c) => c.id === id)?.name || id || "—";

  return (
    <CrudModule
      collectionName={COLLECTIONS.PRODUCTS}
      title="Produse"
      orderByField="sortOrder"
      searchKeys={["name", "description"]}
      defaults={{
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        imageUrl: "",
        unit: "felie",
        weight: "",
        active: true,
        featured: false,
        availability: "available",
        sortOrder: 1
      }}
      fields={[
        { name: "name", label: "Nume", type: "text", required: true },
        { name: "description", label: "Descriere", type: "textarea" },
        { name: "price", label: "Preț (RON)", type: "number", required: true },
        { name: "categoryId", label: "Categorie", type: "select", options: catOptions, required: true },
        { name: "imageUrl", label: "Imagine", type: "image", folder: "products" },
        { name: "unit", label: "Unitate", type: "text", help: "ex: felie, pahar, buc" },
        { name: "weight", label: "Gramaj", type: "text", help: "ex: 125 g" },
        { name: "sortOrder", label: "Ordine", type: "number", step: "1" },
        { name: "availability", label: "Disponibilitate", type: "select", options: AVAILABILITY.map((a) => ({ value: a, label: a })) },
        { name: "active", label: "Activ (vizibil)", type: "checkbox" },
        { name: "featured", label: "Recomandat", type: "checkbox" }
      ]}
      fromForm={(v) => ({
        name: v.name,
        description: v.description || "",
        price: Number(v.price) || 0,
        categoryId: v.categoryId || "",
        imageUrl: v.imageUrl || "",
        unit: v.unit || "",
        weight: v.weight || "",
        sortOrder: Number(v.sortOrder) || 0,
        availability: v.availability || "available",
        active: !!v.active,
        featured: !!v.featured
      })}
      inlineToggles={[
        { field: "active", kind: "bool", onLabel: "Activ", offLabel: "Inactiv" },
        { field: "availability", kind: "availability" }
      ]}
      columns={[
        {
          key: "imageUrl",
          label: "",
          render: (r) =>
            r.imageUrl ? <img className="thumb" src={r.imageUrl} alt="" /> : <span className="thumb thumb-empty">🍰</span>
        },
        { key: "name", label: "Nume", sortable: true },
        { key: "categoryId", label: "Categorie", render: (r) => catName(r.categoryId), sortable: true },
        { key: "price", label: "Preț", sortable: true, render: (r) => formatMoney(r.price) },
        {
          key: "featured",
          label: "Recomandat",
          render: (r) => (r.featured ? <Badge tone="info">★</Badge> : "—")
        }
      ]}
    />
  );
}
