import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

export default function MotoboyPanel() {
  const [codigo, setCodigo] = useState('');
  const [acesso, setAcesso] = useState(false);
  const [queue, setQueue] = useState([]);
  const [motoboys, setMotoboys] = useState({});
  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  useEffect(() => {
    onValue(ref(db, 'queue'), (snapshot) => setQueue(snapshot.val() || []));
    onValue(ref(db, 'motoboys'), (snapshot) => setMotoboys(snapshot.val() || {}));
  }, []);

  if (!acesso) {
    return (
      <div style={{
        minHeight: "100vh", background: "#faf6f4", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}>
        <div style={{
          background: "#fff", borderRadius: 16, padding: 40, boxShadow: "0 6px 36px #0001",
          maxWidth: 370, width: "90%", textAlign: "center"
        }}>
          <img src="https://i.imgur.com/lh2QhRs.png" alt="Logo" style={{ width: 80, marginBottom: 18 }} />
          <h2 style={{ color: "#d86718", fontWeight: 900 }}>Acesso Motoboy</h2>
          <p style={{ color: "#888", fontSize: 16 }}>Informe seu código de acesso para visualizar sua posição na fila.</p>
          <input
            placeholder="Digite seu código"
            value={codigo}
            onChange={e => setCodigo(e.target.value.toUpperCase())}
            style={{
              padding: "12px 20px", fontSize: 18, borderRadius: 8, border: "1.5px solid #d86718",
              outline: "none", marginTop: 16, width: "100%", textAlign: "center"
            }}
          />
          <button
            onClick={() => setAcesso(true)}
            style={{
              marginTop: 20, width: "100%", background: "#d86718", color: "#fff",
              border: "none", borderRadius: 8, fontWeight: 700, padding: "14px 0",
              fontSize: 18, boxShadow: "0 2px 12px #d8671822", cursor: "pointer"
            }}
          >Entrar</button>
        </div>
      </div>
    );
  }

  // Descobre nome do motoboy pelo código
  const meuNome = motoboys[codigo]?.nome;
  const estaNaFila = queue.some(q => q.codigo === codigo);

  return (
    <div style={{
      minHeight: "100vh", background: "#faf6f4", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "start", paddingTop: 54
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "40px 26px", boxShadow: "0 6px 36px #0002",
        maxWidth: 420, width: "95%", margin: "0 auto", textAlign: "center"
      }}>
        <img src="https://i.imgur.com/lh2QhRs.png" alt="Logo" style={{ width: 72, marginBottom: 10 }} />
        <h2 style={{ color: "#d86718", fontWeight: 900, marginBottom: 6 }}>Fila do Rodízio</h2>
        <div style={{ color: "#999", marginBottom: 8, fontSize: 16 }}>Data: {hoje}</div>
        <div style={{
          color: "#222", fontSize: 18, fontWeight: "bold", marginBottom: 18,
          background: "#ffe1cd", borderRadius: 7, padding: "8px 0"
        }}>
          Olá, {meuNome || "motoboy"}!
          {estaNaFila
            ? <span style={{ color: "#18b119", fontWeight: 700 }}> — você está na fila ✅</span>
            : <span style={{ color: "#be1e1e", fontWeight: 700 }}> — você não está na fila ❌</span>
          }
        </div>
        <ol style={{
          fontSize: 20, textAlign: "left", margin: "0 auto", maxWidth: 290,
          paddingLeft: 18
        }}>
          {queue.map((q, idx) => {
            const m = motoboys[q.codigo];
            return (
              <li
                key={idx}
                style={{
                  color: q.codigo === codigo ? "#d86718" : "#222",
                  fontWeight: q.codigo === codigo ? "bold" : "normal",
                  background: q.codigo === codigo ? "#fff3e8" : "none",
                  borderRadius: 6,
                  padding: q.codigo === codigo ? "6px 2px" : "2px 0"
                }}
              >
                {m ? m.nome : q.codigo}
                {q.codigo === codigo && " (você)"}
              </li>
            );
          })}
        </ol>
        <button
          style={{
            marginTop: 22, background: "#fff", color: "#d86718", border: "2px solid #d86718",
            borderRadius: 7, fontWeight: 700, padding: "13px 0", fontSize: 17, width: "100%",
            boxShadow: "0 1px 8px #d8671806", cursor: "pointer"
          }}
          onClick={() => setAcesso(false)}
        >Sair</button>
      </div>
    </div>
  );
}
