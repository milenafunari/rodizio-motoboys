import React, { useState } from 'react';
import MotoboyPanel from './components/MotoboyPanel';
import AdminPanel from './components/AdminPanel';

function App() {
  const [painel, setPainel] = useState(null); // null, "motoboy", "admin"

  if (!painel) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        height: "100vh", fontFamily: "Nunito, Arial, sans-serif", background: "#faf6f4"
      }}>
        <img src="https://i.imgur.com/lh2QhRs.png" alt="Logo Osasco" style={{ width: 90, marginBottom: 22 }} />
        <h1 style={{ color: "#d86718", marginBottom: 40, fontWeight: 900, fontSize: 30 }}>Sistema de Rodízio de Motoboys</h1>
        <button onClick={() => setPainel("motoboy")}
          style={{
            background: "#fff", color: "#d86718", border: "2px solid #d86718", borderRadius: 8,
            fontWeight: 700, padding: "16px 30px", fontSize: 18, marginBottom: 18, cursor: "pointer"
          }}>
          Acesso Motoboy
        </button>
        <button onClick={() => setPainel("admin")}
          style={{
            background: "#d86718", color: "#fff", border: "none", borderRadius: 8,
            fontWeight: 700, padding: "16px 30px", fontSize: 18, cursor: "pointer"
          }}>
          Acesso Admin
        </button>
      </div>
    );
  }

  if (painel === "motoboy") return <MotoboyPanel />;
  if (painel === "admin") return <AdminPanel onLogout={() => setPainel(null)} />;

  return null;
}

export default App;
