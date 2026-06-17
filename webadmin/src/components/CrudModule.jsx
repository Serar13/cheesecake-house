import { useState } from "react";
import { useCollection } from "../hooks/useCollection";
import { createDoc, updateDocById, deleteDocById } from "../services/firestore";
import DataTable from "./DataTable";
import Modal from "./Modal";
import ImageInput from "./ImageInput";
import { Loading, ErrorState, Badge } from "./ui";

// Renders one input based on a field definition.
function Field({ def, value, onChange }) {
  const common = { id: def.name, value: value ?? "", required: def.required };
  switch (def.type) {
    case "textarea":
      return <textarea {...common} rows={3} onChange={(e) => onChange(e.target.value)} />;
    case "number":
      return (
        <input
          type="number"
          step={def.step ?? "any"}
          {...common}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        />
      );
    case "checkbox":
      return (
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
        />
      );
    case "select":
      return (
        <select {...common} onChange={(e) => onChange(e.target.value)}>
          <option value="">— alege —</option>
          {def.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "image":
      return (
        <ImageInput folder={def.folder} value={value} onChange={onChange} />
      );
    case "datetime":
      return (
        <input type="datetime-local" {...common} onChange={(e) => onChange(e.target.value)} />
      );
    default:
      return <input type="text" {...common} onChange={(e) => onChange(e.target.value)} />;
  }
}

function FormModal({ title, fields, initial, onClose, onSave }) {
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const set = (name, v) => setValues((p) => ({ ...p, [name]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onSave(values);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Salvarea a eșuat.");
      setBusy(false);
    }
  };

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} type="button">
            Anulează
          </button>
          <button className="btn btn-primary" form="crud-form" type="submit" disabled={busy}>
            {busy ? "Se salvează…" : "Salvează"}
          </button>
        </>
      }
    >
      <form id="crud-form" className="crud-form" onSubmit={submit}>
        {fields.map((def) => (
          <div
            key={def.name}
            className={`form-row ${def.type === "checkbox" ? "form-row-inline" : ""}`}
          >
            <label htmlFor={def.name}>{def.label}</label>
            <Field def={def} value={values[def.name]} onChange={(v) => set(def.name, v)} />
            {def.help && <small className="field-help">{def.help}</small>}
          </div>
        ))}
        {error && <div className="login-error">{error}</div>}
      </form>
    </Modal>
  );
}

// Generic collection manager.
// props:
//  collectionName, title, orderByField, fields, columns, searchKeys,
//  defaults (object), toForm(row)->values, fromForm(values)->payload,
//  idField (optional, e.g. 'slug' to use as doc id on create),
//  inlineToggles: [{ field, kind:'bool'|'availability' }]
export default function CrudModule({
  collectionName,
  title,
  orderByField,
  fields,
  columns,
  searchKeys = [],
  defaults = {},
  toForm,
  fromForm,
  idField,
  inlineToggles = []
}) {
  const { rows, loading, error } = useCollection(collectionName, { orderByField });
  const [editing, setEditing] = useState(null); // row or "new" or null

  const openNew = () => setEditing("new");
  const openEdit = (row) => setEditing(row);
  const close = () => setEditing(null);

  const save = async (values) => {
    const payload = fromForm ? fromForm(values) : values;
    if (editing === "new") {
      const id = idField ? values[idField] : undefined;
      await createDoc(collectionName, payload, id);
    } else {
      await updateDocById(collectionName, editing.id, payload);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Ștergi „${row.name || row.title || row.id}”?`)) return;
    await deleteDocById(collectionName, row.id);
  };

  const toggleField = async (row, field, kind) => {
    if (kind === "availability") {
      const next = row.availability === "available" ? "unavailable" : "available";
      await updateDocById(collectionName, row.id, { availability: next });
    } else {
      await updateDocById(collectionName, row.id, { [field]: !row[field] });
    }
  };

  const actionsColumn = {
    key: "_actions",
    label: "Acțiuni",
    render: (row) => (
      <div className="row-actions">
        {inlineToggles.map((t) =>
          t.kind === "availability" ? (
            <button
              key={t.field}
              className={`btn btn-xs ${row.availability === "available" ? "btn-ok" : "btn-warn"}`}
              onClick={() => toggleField(row, t.field, t.kind)}
              title="Disponibilitate"
            >
              {row.availability === "available" ? "Disponibil" : "Indisponibil"}
            </button>
          ) : (
            <button
              key={t.field}
              className={`btn btn-xs ${row[t.field] ? "btn-ok" : "btn-ghost"}`}
              onClick={() => toggleField(row, t.field, t.kind)}
              title={t.field}
            >
              {row[t.field] ? t.onLabel || t.field : t.offLabel || t.field}
            </button>
          )
        )}
        <button className="btn btn-xs" onClick={() => openEdit(row)}>
          Editează
        </button>
        <button className="btn btn-xs btn-danger" onClick={() => remove(row)}>
          Șterge
        </button>
      </div>
    )
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  const initialValues =
    editing && editing !== "new"
      ? toForm
        ? toForm(editing)
        : { ...defaults, ...editing }
      : { ...defaults };

  return (
    <div className="module">
      <div className="module-toolbar">
        <button className="btn btn-primary" onClick={openNew}>
          + Adaugă
        </button>
      </div>

      <DataTable
        columns={[...columns, actionsColumn]}
        rows={rows}
        searchKeys={searchKeys}
        emptyMessage={`Niciun element în „${title}”. Apasă „Adaugă”.`}
      />

      {editing && (
        <FormModal
          title={editing === "new" ? `Adaugă în ${title}` : `Editează`}
          fields={fields}
          initial={initialValues}
          onClose={close}
          onSave={save}
        />
      )}
    </div>
  );
}

// Re-export so modules can render status chips consistently.
export { Badge };
