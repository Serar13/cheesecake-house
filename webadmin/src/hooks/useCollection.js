import { useEffect, useState } from "react";
import { subscribeCollection } from "../services/firestore";

// Live-subscribe to a Firestore collection. Returns { rows, loading, error }.
// Real-time via onSnapshot so the admin UI reflects changes instantly.
export function useCollection(name, { orderByField } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsub = subscribeCollection(
      name,
      { orderByField },
      (data) => {
        setRows(data);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || "Eroare la încărcarea datelor.");
        setLoading(false);
      }
    );
    return unsub;
  }, [name, orderByField]);

  return { rows, loading, error };
}
