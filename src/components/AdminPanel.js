import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, set, onValue } from 'firebase/database';
import MotoboysManager from './MotoboysManager';
import Relatorios from './Relatorios';

export default function AdminPanel({ onLogout, painelNome = "Painel Admin – Osasco Express" }) {
  const [queue, setQueue] = useState([]);
  const [motoboys, setMotoboys] = useState({});
  const [showMotoboysManager, setShowMotoboysManager] = useState(false);
  const [showRelatorios, setShowRelatorios] = useState(false);

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

  // Mover para final
  const moveToEnd = (idx) => {
    const updated = [...queue];
    const [motoboy] = updated.splice(idx, 1);
    updated.push(motoboy);
    set(ref(db, 'queue'), updated);
  };

  // Remover da fila
  const removeMotoboyFromQueue = (idx) => {
    const updated = queue.filter((_, i) => i !== idx);
    set(ref(db, 'queue'), updated);
  };

  // Resetar fila
  const resetQueue = () => set(ref(db, 'queue'), []);

  // Mover para o topo da fila
  const moveToTop = (idx) => {
    const updated = [...queue];
    const [motoboy] = updated.splice(idx, 1);
    updated.unshift(motoboy);
    set(ref(db, 'queue'), updated);
  };

  if (showMotoboysManager) {
    return <MotoboysManager onBack={() => setShowMotoboysManager(false)} />;
  }

  if (showRelatorios) {
    return <Relatorios onBack={() => setShowRelatorios(false)} />;
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "start", paddingTop: 48
    }}>
      <div style={{
        background: "#1a1a1a", borderRadius: 20, padding: "38px 32px", boxShadow: "0 6px 36px #0005",
        maxWidth: 530, width: "97%", margin: "0 auto", fontFamily: "Nunito, Arial, sans-serif"
      }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24, justifyContent: "space-between" }}>
          <img src="/logo.png" alt="Logo Osasco Express" style={{ width: 90, marginRight: 22 }} />
          <div>
            <button
              style={{
                background: "#ffc300", color: "#000", border: "none", borderRadius: 8,
                fontWeight: 700, padding: "10px 20px", fontSize: 17, marginLeft: 0, cursor: "pointer"
              }}
              onClick={() => setShowMotoboysManager(true)}
            >Gerenciar Motoboys</button>
            <button
              style={{
                background: "#222", color: "#ffc300", border: "2px solid #ffc300", borderRadius: 8,
                fontWeight: 700, padding: "10px 20px", fontSize: 17, marginLeft: 18, cursor: "pointer"
              }}
              onClick={() => setShowRelatorios(true)}
            >Relatórios</button>
            <button
              style={{
                background: "#fff", color: "#000", border: "2px solid #fff", borderRadius: 8,
                fontWeight: 700, padding: "10px 20px", fontSize: 17, marginLeft: 18, cursor: "pointer"
              }}
              onClick={onLogout}
            >Sair</button>
          </div>
        </div>
        <div style={{ color: "#bbb", fontSize: 17, marginBottom: 18 }}>
          <span style={{ color: "#fff", fontWeight: 700 }}>{painelNome}</span><br />
          <span>Data: {hoje}</span>
        </div>

        <h2 style={{ color: "#ffc300", margin: "0 0 12px", fontWeight: 900 }}>Fila Atual</h2>
        <ol style={{ fontSize: 19, marginLeft: 8, marginBottom: 16 }}>
          {queue.length === 0 && <li style={{ color: "#ffc300" }}>Fila vazia.</li>}
          {queue.map((q, idx) => {
            const m = motoboys[q.codigo];
            return (
              <li key={idx} style={{ marginBottom: 7, color: "#fff" }}>
                {m ? m.nome : q.codigo}
                <span style={{ color: "#888", marginLeft: 7 }}>({q.codigo})</span>
                <button
                  onClick={() => moveToTop(idx)}
                  style={{
                    marginLeft: 8, background: "#ffc300", color: "#000", border: "none",
                    borderRadius: 7, fontWeight: 700, padding: "5px 13px", fontSize: 15, cursor: "pointer"
                  }}
                >Mover para topo</button>
                <button
                  onClick={() => moveToEnd(idx)}
                  style={{
                    marginLeft: 8, background: "#ffc300", color: "#000", border: "none",
                    borderRadius: 7, fontWeight: 700, padding: "5px 13px", fontSize: 15, cursor: "pointer"
                  }}
                >Mover para final</button>
                <button
                  onClick={() => removeMotoboyFromQueue(idx)}
                  style={{
                    marginLeft: 8, background: "#fff", color: "#be1e1e", border: "1.5px solid #be1e1e",
                    borderRadius: 7, fontWeight: 700, padding: "5px 13px", fontSize: 15, cursor: "pointer"
                  }}
                >Remover</button>
              </li>
            );
          })}
        </ol>
        <button
          onClick={resetQueue}
          style={{
            background: "#fff", color: "#000", border: "2px solid #fff", borderRadius: 8,
            fontWeight: 700, padding: "11px 0", fontSize: 17, width: "100%", marginTop: 18, cursor: "pointer"
          }}
        >Resetar Fila</button>
      </div>
    </div>
  );
}
