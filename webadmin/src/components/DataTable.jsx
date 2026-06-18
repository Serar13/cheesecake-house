import { useMemo, useState } from "react";
import { EmptyState } from "./ui";

// Reusable table with client-side search + column sort.
// columns: [{ key, label, render?(row), sortable?, sortValue?(row) }]
// searchKeys: array of row keys to match the search box against.
export default function DataTable({ columns, rows, searchKeys = [], emptyMessage }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    let out = rows;
    if (search.trim() && searchKeys.length) {
      const q = search.toLowerCase();
      out = out.filter((r) =>
        searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      const val = (r) => (col?.sortValue ? col.sortValue(r) : r[sortKey]);
      out = [...out].sort((a, b) => {
        const av = val(a);
        const bv = val(b);
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === "number" && typeof bv === "number") {
          return sortDir === "asc" ? av - bv : bv - av;
        }
        return sortDir === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }
    return out;
  }, [rows, search, searchKeys, sortKey, sortDir, columns]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="datatable">
      {searchKeys.length > 0 && (
        <div className="datatable-toolbar">
          <input
            className="search-input"
            placeholder="Caută…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="row-count">{filtered.length} rezultate</span>
        </div>
      )}
      {filtered.length === 0 ? (
        <EmptyState message={emptyMessage || "Niciun rezultat."} />
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={c.sortable ? "sortable" : ""}
                    onClick={c.sortable ? () => toggleSort(c.key) : undefined}
                  >
                    {c.label}
                    {sortKey === c.key && (sortDir === "asc" ? " ▲" : " ▼")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  {columns.map((c) => (
                    <td key={c.key}>{c.render ? c.render(row) : row[c.key] ?? "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
