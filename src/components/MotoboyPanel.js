import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set, remove, push } from 'firebase/database';

export default function MotoboyPanel() {
  const [codigo, setCodigo] = useState('');
  const [motoboy, setMotoboy] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Busca lista de motoboys e fila
  useEffect(() => {
    onValue(ref(db, 'motoboys'), snap => setMotoboy(snap.val() && snap.val()[codigo] ? snap.val()[codigo] : null));
    onValue(ref(db, 'queue'), snap => setQueue(snap.val() || []));
  }, [codigo]);

  // Helper: está na fila?
  const estaNaFila = queue.find(m => m.codigo === codigo);

  // "Cheguei"
  const handleCheguei = async () => {
    if (!motoboy) { setMsg("Código não encontrado."); return; }
    if (estaNaFila) { setMsg("Você já está na fila!"); return; }
    setLoading(true);
    set(ref(db, 'queue'), [...queue, { codigo }]);
    // Salva no histórico de entradas
    push(ref(db, `entradas/${codigo}`), { data: new Date().toISOString() });
    setMsg("Você entrou na fila.");
    setLoading(false);
  };

  // "Sair para entrega"
  const handleSaiu = async () => {
    if (!estaNaFila) { setMsg("Você não está na fila."); return; }
    setLoading(true);
    const updated = queue.filter(q => q.codigo !== codigo);
    set(ref(db, 'queue'), updated);
    // Salva no histórico de saídas
    push(ref(db, `saidas/${codigo}`), { data: new Date().toISOString() });
    setMsg("Você saiu da fila. Boa entrega!");
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", fontFamily: "Nunito, Arial, sans-serif"
    }}>
      <img src="/logo_osasco_express.png" alt="Logo" style={{ width: 90, marginBottom: 20 }} />
      <div style={{
        background: "#1a1a1a", borderRadius: 20, padding: "34px 32px", boxShadow: "0 6px 36px #0005",
        width: 360, maxWidth: "96%"
      }}>
        <h2 style={{ color: "#ffc300", textAlign: "center", fontWeight: 900, marginBottom: 22 }}>
          Painel Motoboy
        </h2>
        {!motoboy && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              placeholder="Digite seu código"
              value={codigo}
              onChange={e => setCodigo(e.target.value.toUpperCase())}
              style={{
                padding: "15px 15px", borderRadius: 8, border: "1.5px solid #ffc300",
                fontSize: 17, background: "#222", color: "#fff", textAlign: "center"
              }}
            />
            <div style={{ color: "#fff", fontSize: 15, textAlign: "center" }}>
              Informe seu código de acesso para entrar.
            </div>
          </div>
        )}

        {motoboy && (
          <>
            <div style={{
              color: "#fff", textAlign: "center", fontSize: 18,
              marginBottom: 13
            }}>
              <b style={{ color: "#ffc300" }}>{motoboy.nome}</b>
              <br />
              Código: <span style={{ color: "#ffc300" }}>{motoboy.codigo}</span>
            </div>

            {!estaNaFila ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#fff", fontSize: 16, marginBottom: 10 }}>
                  Você <b>não está</b> na fila de entregas.
                </div>
                <button
                  onClick={handleCheguei}
                  disabled={loading}
                  style={{
                    background: "#ffc300", color: "#000", border: "none",
                    borderRadius: 8, fontWeight: 800, padding: "13px 28px",
                    fontSize: 19, margin: "14px 0", cursor: "pointer"
                  }}
                >Cheguei!</button>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{
                  color: "#fff", fontSize: 16, marginBottom: 7
                }}>
                  Você está na fila.<br />
                  <b style={{ color: "#ffc300", fontSize: 20 }}>
                    Sua posição: {queue.findIndex(q => q.codigo === codigo) + 1}
                  </b>
                </div>
                <button
                  onClick={handleSaiu}
                  disabled={loading}
                  style={{
                    background: "#fff", color: "#000", border: "none",
                    borderRadius: 8, fontWeight: 800, padding: "13px 28px",
                    fontSize: 19, margin: "14px 0", cursor: "pointer"
                  }}
                >Sair para entrega</button>
              </div>
            )}
            {msg && <div style={{ color: "#ffc300", textAlign: "center", marginTop: 13 }}>{msg}</div>}
          </>
        )}
      </div>
    </div>
  );
}

