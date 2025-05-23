import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

export default function Relatorios({ onBack }) {
  const [motoboys, setMotoboys] = useState({});
  const [entradas, setEntradas] = useState({});
  const [saidas, setSaidas] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onValue(ref(db, 'motoboys'), snap => setMotoboys(snap.val() || {}));
    onValue(ref(db, 'entradas'), snap => setEntradas(snap.val() || {}));
    onValue(ref(db, 'saidas'), snap => setSaidas(snap.val() || {}));
    setLoading(false);
  }, []);

  // Conta entradas/saídas por motoboy
  function contar(obj) {
    if (!obj) return 0;
    return Object.values(obj).length;
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "start", paddingTop: 48
    }}>
      <div style={{
        background: "#1a1a1a", borderRadius: 20, padding: "38px 32px", boxShadow: "0 6px 36px #0005",
        maxWidth: 560, width: "98%", margin: "0 auto", fontFamily: "Nunito, Arial, sans-serif"
      }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16, justifyContent: "space-between" }}>
          <h2 style={{ color: "#ffc300", fontWeight: 900, fontSize: 23, marginBottom: 0 }}>Relatórios</h2>
          <button
            style={{
              background: "#fff", color: "#000", border: "2px solid #fff", borderRadius: 8,
              fontWeight: 700, padding: "8px 18px", fontSize: 16, cursor: "pointer"
            }}
            onClick={onBack}
          >Voltar</button>
        </div>
        <p style={{ color: "#fff" }}>Entradas (chegadas na base) e saídas (início de entrega), por motoboy:</p>
        {loading && <div style={{ color: "#fff" }}>Carregando...</div>}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
          <thead>
            <tr>
              <th style={{ color: "#ffc300", borderBottom: "1.5px solid #ffc300", fontWeight: 900, padding: "8px 3px" }}>Motoboy</th>
              <th style={{ color: "#ffc300", borderBottom: "1.5px solid #ffc300", fontWeight: 900, padding: "8px 3px" }}>Código</th>
              <th style={{ color: "#ffc300", borderBottom: "1.5px solid #ffc300", fontWeight: 900, padding: "8px 3px" }}>Entradas</th>
              <th style={{ color: "#ffc300", borderBottom: "1.5px solid #ffc300", fontWeight: 900, padding: "8px 3px" }}>Saídas</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(motoboys).map(m => (
              <tr key={m.codigo}>
                <td style={{ color: "#fff", textAlign: "center", padding: "5px 2px" }}>{m.nome}</td>
                <td style={{ color: "#ffc300", textAlign: "center", padding: "5px 2px" }}>{m.codigo}</td>
                <td style={{ color: "#fff", textAlign: "center", padding: "5px 2px" }}>{contar(entradas[m.codigo])}</td>
                <td style={{ color: "#fff", textAlign: "center", padding: "5px 2px" }}>{contar(saidas[m.codigo])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
