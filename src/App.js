import React, { useState } from 'react';
import AdminPanel from './components/AdminPanel';
import MotoboyPanel from './components/MotoboyPanel';

const SENHA_ADMIN = "motoboy2024"; // Altere aqui a senha de admin, se desejar

function App() {
  const [painel, setPainel] = useState(null); // null, "motoboy", "admin"
  const [senhaDigitada, setSenhaDigitada] = useState('');
  const [erro, setErro] = useState('');

  // Tela inicial
  if (!painel) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        height: "100vh", fontFamily: "Nunito, Arial, sans-serif", background: "#000"
      }}>
        <img src="/logo.png" alt="Logo Osasco Express" style={{ width: 100, marginBottom: 30 }} />
        <h1 style={{ color: "#ffc300", marginBottom: 50, fontWeight: 900, fontSize: 30, textAlign: "center" }}>
          Sistema de Rodízio<br />Osasco Express
        </h1>
        <button
          onClick={() => setPainel("motoboy")}
          style={{
            background: "#fff", color: "#000", border: "2px solid #fff", borderRadius: 10,
            fontWeight: 800, padding: "18px 38px", fontSize: 20, marginBottom: 28, cursor: "pointer", width: 260
          }}>
          Acesso Motoboy
        </button>
        <button
          onClick={() => setPainel("admin")}
          style={{
            background: "#ffc300", color: "#000", border: "none", borderRadius: 10,
            fontWeight: 800, padding: "18px 38px", fontSize: 20, width: 260, cursor: "pointer"
          }}>
          Acesso Admin
        </button>
      </div>
    );
  }

  // Tela de senha do admin
  if (painel === "admin" && senhaDigitada !== SENHA_ADMIN) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        height: "100vh", fontFamily: "Nunito, Arial, sans-serif", background: "#000"
      }}>
        <img src="/logo_osasco_express.png" alt="Logo Osasco Express" style={{ width: 90, marginBottom: 24 }} />
        <h2 style={{ color: "#ffc300", marginBottom: 22, fontWeight: 900 }}>Acesso Restrito – Admin</h2>
        <input
          type="password"
          placeholder="Digite a senha do admin"
          value={senhaDigitada}
          onChange={e => { setSenhaDigitada(e.target.value); setErro(''); }}
          style={{
            padding: "16px 20px", fontSize: 19, borderRadius: 8, border: "1.5px solid #ffc300",
            outline: "none", marginBottom: 18, width: 240, textAlign: "center", background: "#222", color: "#fff"
          }}
        />
        <button
          onClick={() => {
            if (senhaDigitada === SENHA_ADMIN) {
              setSenhaDigitada(SENHA_ADMIN);
            } else {
              setErro("Senha incorreta! Tente novamente.");
            }
          }}
          style={{
            background: "#ffc300", color: "#000", border: "none", borderRadius: 8,
            fontWeight: 700, padding: "14px 32px", fontSize: 18, cursor: "pointer"
          }}
        >Entrar</button>
        {erro && <div style={{ color: "#be1e1e", marginTop: 15 }}>{erro}</div>}
        <button
          onClick={() => { setPainel(null); setSenhaDigitada(''); setErro(''); }}
          style={{
            background: "#fff", color: "#000", border: "2px solid #ffc300", borderRadius: 8,
            fontWeight: 700, padding: "10px 28px", fontSize: 16, cursor: "pointer", marginTop: 24
          }}
        >Voltar</button>
      </div>
    );
  }

  // Painel Motoboy (apenas código)
  if (painel === "motoboy") return <MotoboyPanel />;

  // Painel Admin (proteção por senha)
  if (painel === "admin" && senhaDigitada === SENHA_ADMIN)
    return <AdminPanel onLogout={() => { setPainel(null); setSenhaDigitada(''); setErro(''); }} />;

  return null;
}

export default App;
