import { useAuth } from "../auth/AuthContext";

export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "orders", label: "Comenzi", icon: "🛍️" },
  { key: "reservations", label: "Rezervări", icon: "📅" },
  { key: "products", label: "Produse", icon: "🍰" },
  { key: "categories", label: "Categorii", icon: "🗂️" },
  { key: "promotions", label: "Promoții", icon: "🏷️" },
  { key: "tables", label: "Mese", icon: "🪑" },
  { key: "locations", label: "Locații", icon: "📍" },
  { key: "offerRequests", label: "Cereri Evenimente", icon: "🎉" },
  { key: "reviews", label: "Recenzii", icon: "⭐" },
  { key: "users", label: "Clienți & Fidelitate", icon: "👥" }
];

export default function Layout({ active, onNavigate, children }) {
  const { profile, logout } = useAuth();
  const current = NAV_ITEMS.find((n) => n.key === active);

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-logo">🍰</span>
          <div>
            <h2>Cheesecake Admin</h2>
            <span>Control Panel</span>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${active === item.key ? "active" : ""}`}
              onClick={() => onNavigate(item.key)}
            >
              <span className="nav-icon">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-footer">
          <p>
            <strong>{profile?.name || profile?.email || "Admin"}</strong>
            <br />
            <small>{profile?.email}</small>
          </p>
          <button className="logout-btn" onClick={logout}>
            Deconectare
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {current ? `${current.icon} ${current.label}` : "Admin"}
          </h1>
          <span className="live-indicator">🟢 Conectat la Firestore</span>
        </header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
