import React, { useState } from 'react';
import './App.css';

// Simple mock data for admin dashboard
const initialOrders = [
  { id: 'CH-872361', name: 'Andrei Popescu', location: 'Tg. Mureș', total: '48.00 RON', type: 'Livrare', status: 'În pregătire', time: '12:30' },
  { id: 'CH-492102', name: 'Maria Szabo', location: 'Cluj-Napoca', total: '26.00 RON', type: 'Ridicare', status: 'Finalizată', time: '11:15' },
  { id: 'CH-194852', name: 'Ioan Mureșan', location: 'Bistrița', total: '112.00 RON', type: 'Livrare', status: 'Finalizată', time: '10:45' },
  { id: 'CH-981240', name: 'Elena Radu', location: 'Cluj-Napoca', total: '74.00 RON', type: 'Livrare', status: 'În livrare', time: '12:44' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState(initialOrders);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="admin-app">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="https://assets.boosteat.com/images/c165/2023-03-21/20230321093311212641979d71009f/logo.png" alt="Logo" className="admin-logo" />
          <div>
            <h2>Cheesecake Admin</h2>
            <span>Control Panel</span>
          </div>
        </div>
        
        <nav className="admin-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard Summary
          </button>
          <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            🛍️ Gestionare Comenzi
          </button>
          <button className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            🍰 Meniu & Produse
          </button>
          <button className={`nav-item ${activeTab === 'locations' ? 'active' : ''}`} onClick={() => setActiveTab('locations')}>
            📍 Administrare Locații
          </button>
        </nav>

        <div className="admin-footer">
          <p>Utilizator: <strong>Admin</strong></p>
          <button className="logout-btn">Deconectare</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab === 'dashboard' && 'Dashboard Overview'}</h1>
          <h1>{activeTab === 'orders' && 'Gestionare Comenzi'}</h1>
          <h1>{activeTab === 'products' && 'Meniu & Produse'}</h1>
          <h1>{activeTab === 'locations' && 'Administrare Locații'}</h1>
          <span className="live-indicator">🟢 Live Server Connected</span>
        </header>

        {activeTab === 'orders' && (
          <div className="admin-content">
            {/* Stats Cards Row */}
            <div className="stats-row">
              <div className="stat-card">
                <h3>Comenzi Astăzi</h3>
                <span className="stat-val">{orders.length}</span>
              </div>
              <div className="stat-card">
                <h3>În curs de preparare</h3>
                <span className="stat-val">{orders.filter(o => o.status === 'În pregătire').length}</span>
              </div>
              <div className="stat-card">
                <h3>Total Încasări Mock</h3>
                <span className="stat-val">260.00 RON</span>
              </div>
            </div>

            {/* Orders Table Container */}
            <div className="table-card">
              <h3>Flux Comenzi Recente</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID Comandă</th>
                      <th>Client</th>
                      <th>Locație</th>
                      <th>Tip</th>
                      <th>Total</th>
                      <th>Ora</th>
                      <th>Status</th>
                      <th>Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td><strong>{order.id}</strong></td>
                        <td>{order.name}</td>
                        <td>{order.location}</td>
                        <td>
                          <span className={`badge-type ${order.type === 'Livrare' ? 'delivery' : 'pickup'}`}>
                            {order.type}
                          </span>
                        </td>
                        <td>{order.total}</td>
                        <td>{order.time}</td>
                        <td>
                          <span className={`status-pill ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <select 
                            value={order.status} 
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="status-selector"
                          >
                            <option value="În pregătire">În pregătire</option>
                            <option value="În livrare">În livrare</option>
                            <option value="Finalizată">Finalizată</option>
                            <option value="Anulată">Anulată</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'orders' && (
          <div className="admin-content-placeholder">
            <span className="placeholder-icon">🛠️</span>
            <h3>Modulul "{activeTab}" este în curs de dezvoltare</h3>
            <p>Structura proiectului este pregătită pentru integrarea bazei de date și a serviciilor API.</p>
          </div>
        )}
      </main>
    </div>
  );
}
