import React, { useState } from 'react';
import MotoboyPanel from './components/MotoboyPanel';
import AdminPanel from './components/AdminPanel';

const SENHA_ADMIN = "motoboy2024"; // <<< Defina sua senha aqui

function App() {
  const [painel, setPainel] = useState(null); // null, "motoboy", "admin"
  const [senhaDigitada, setSenhaDigitada] = useState('');
  const [erro, setErro] = useState('');

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

  if (painel === "admin" && senhaDigitada !== SENHA_ADMIN) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        height: "100vh", fontFamily: "Nunito, Arial, sans-serif", background: "#faf6f4"
      }}>
        <img src="https://i.imgur.com/lh2QhRs.png" alt="Logo Osasco" style={{ width: 90, marginBottom: 18 }} />
        <h2 style={{ color: "#d86718", marginBottom: 20, fontWeight: 900 }}>Acesso Restrito</h2>
        <input
          type="password"
          placeholder="Digite a senha do admin"
          value={senhaDigitada}
          onChange={e => { setSenhaDigitada(e.target.value); setErro(''); }}
          style={{
            padding: "14px 18px", fontSize: 18, borderRadius: 8, border: "1.5px solid #d86718",
            outline: "none", marginBottom: 16, width: 220, textAlign: "center"
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
            background: "#d86718", color: "#fff", border: "none", borderRadius: 8,
            fontWeight: 700, padding: "12px 28px", fontSize: 17, cursor: "pointer"
          }}
        >Entrar</button>
        {erro && <div style={{ color: "#be1e1e", marginTop: 12 }}>{erro}</div>}
        <button
          onClick={() => { setPainel(null); setSenhaDigitada(''); setErro(''); }}
          style={{
            background: "#fff", color: "#d86718", border: "2px solid #d86718", borderRadius: 8,
            fontWeight: 700, padding: "8px 24px", fontSize: 15, cursor: "pointer", marginTop: 18
          }}
        >Voltar</button>
      </div>
    );
  }

  if (painel === "motoboy") return <MotoboyPanel />;
  if (painel === "admin" && senhaDigitada === SENHA_ADMIN) return <AdminPanel onLogout={() => { setPainel(null); setSenhaDigitada(''); }} />;

  return null;
}

export default App;
