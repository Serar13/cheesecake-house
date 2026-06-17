import { useState } from "react";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Login from "./components/Login";
import Layout from "./components/Layout";
import { Loading } from "./components/ui";

import Dashboard from "./modules/Dashboard";
import Orders from "./modules/Orders";
import Reservations from "./modules/Reservations";
import Products from "./modules/Products";
import Categories from "./modules/Categories";
import Promotions from "./modules/Promotions";
import Tables from "./modules/Tables";
import Locations from "./modules/Locations";
import OfferRequests from "./modules/OfferRequests";
import Reviews from "./modules/Reviews";
import Users from "./modules/Users";

import "./App.css";

const MODULES = {
  dashboard: Dashboard,
  orders: Orders,
  reservations: Reservations,
  products: Products,
  categories: Categories,
  promotions: Promotions,
  tables: Tables,
  locations: Locations,
  offerRequests: OfferRequests,
  reviews: Reviews,
  users: Users
};

function AccessDenied() {
  const { profile, logout } = useAuth();
  return (
    <div className="login-screen">
      <div className="login-card denied">
        <div className="login-brand">🚫</div>
        <h1>Acces restricționat</h1>
        <p className="login-sub">
          Contul <strong>{profile?.email}</strong> nu are rol de administrator.
        </p>
        <p className="muted">
          Cere unui administrator să îți seteze <code>role: "admin"</code> în documentul tău din colecția <code>users</code>.
        </p>
        <button className="btn btn-primary btn-block" onClick={logout}>
          Deconectare
        </button>
      </div>
    </div>
  );
}

function AdminShell() {
  const [active, setActive] = useState("dashboard");
  const Active = MODULES[active] || Dashboard;
  return (
    <Layout active={active} onNavigate={setActive}>
      <Active />
    </Layout>
  );
}

function Gate() {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Loading label="Se verifică sesiunea…" />;
  if (!user) return <Login />;
  if (!isAdmin) return <AccessDenied />;
  return <AdminShell />;
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
