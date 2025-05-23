import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, set, onValue } from 'firebase/database';

// Função para gerar código aleatório de 5 caracteres
function gerarCodigo() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < 5; i++) {
    codigo += letras[Math.floor(Math.random() * letras.length)];
  }
  return codigo;
}

export default function AdminPanel({ onLogout }) {
  const [queue, setQueue] = useState([]);
  const [motoboys, setMotoboys] = useState({});
  const [name, setName] = useState('');
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

  // Adicionar novo motoboy com código gerado
  const addMotoboy = () => {
    if (name.trim() === '') return;
    // Gera um código único (confere se não existe já no Firebase)
    let novoCodigo = '';
    let tentativas = 0;
    do {
      novoCodigo = gerarCodigo();
      tentativas++;
      // Checa se já existe alguém com o código gerado
    } while (motoboys[novoCodigo] && tentativas < 20);
    set(ref(db, `motoboys/${novoCodigo}`), { nome: name, codigo: novoCodigo });
    setName('');
  };

  // Adiciona motoboy na fila pelo código
  const addMotoboyToQueue = (codigo) => {
    if (!queue.find(q => q.codigo === codigo)) {
      set(ref(db, 'queue'), [...queue, { codigo }]);
    }
  };

  // Remove da fila
  const removeMotoboyFromQueue = (idx) => {
    const updated = queue.filter((_, i) => i !== idx);
    set(ref(db, 'queue'), updated);
  };

  // Mover para final
  const moveToEnd = (idx) => {
    const updated = [...queue];
    const [motoboy] = updated.splice(idx, 1);
    updated.push(motoboy);
    set(ref(db, 'queue'), updated);
  };

  // Resetar fila
  const resetQueue = () => set(ref(db, 'queue'), []);

  return (
    <div style={{
      minHeight: "100vh", background: "#faf6f4", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "start", paddingTop: 48
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "38px 32px", boxShadow: "0 6px 36px #0002",
        maxWidth: 530, width: "97%", margin: "0 auto", fontFamily: "Nunito, Arial, sans-serif"
      }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16, justifyContent: "space-between" }}>
          <span style={{ fontSize: 29, color: "#d86718", fontWeight: 900 }}>Painel do Admin</span>
          <button
            style={{
              background: "#fff", color: "#d86718", border: "2px solid #d86718", borderRadius: 8,
              fontWeight: 700, padding: "10px 20px", fontSize: 17, cursor: "pointer"
            }}
            onClick={onLogout}
          >Sair</button>
        </div>
        <div style={{ color: "#999", fontSize: 16, marginBottom: 16 }}>Data: {hoje}</div>

        <div style={{ marginBottom: 24, display: "flex", gap: 10 }}>
          <input
            placeholder="Nome do motoboy"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              flex: 1, padding: "12px 10px", borderRadius: 7, border: "1.5px solid #d86718", fontSize: 16
            }}
          />
          <button
            onClick={addMotoboy}
            style={{
              background: "#d86718", color: "#fff", border: "none", borderRadius: 7,
              fontWeight: 700, padding: "12px 18px", fontSize: 17, cursor: "pointer"
            }}
          >Cadastrar</button>
        </div>

        <h3 style={{ color: "#222", margin: "18px 0 4px", fontSize: 20, fontWeight: 900 }}>Motoboys Cadastrados:</h3>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {Object.values(motoboys).length === 0 && <li style={{ color: "#d86718" }}>Nenhum motoboy cadastrado.</li>}
          {Object.values(motoboys).map((m, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              {m.nome} | <b>{m.codigo}</b>
              <button
                onClick={() => addMotoboyToQueue(m.codigo)}
                style={{
                  marginLeft: 12, background: "#fff", color: "#d86718", border: "1.5px solid #d86718",
                  borderRadius: 7, fontWeight: 700, padding: "6px 13px", fontSize: 15, cursor: "pointer"
                }}
              >Adicionar à Fila</button>
            </li>
          ))}
        </ul>
        <hr style={{ margin: "28px 0 18px" }} />
        <h2 style={{ color: "#d86718", margin: "0 0 12px", fontWeight: 900 }}>Fila Atual</h2>
        <ol style={{ fontSize: 19, marginLeft: 8, marginBottom: 16 }}>
          {queue.length === 0 && <li style={{ color: "#d86718" }}>Fila vazia.</li>}
          {queue.map((q, idx) => {
            const m = motoboys[q.codigo];
            return (
              <li key={idx} style={{ marginBottom: 7 }}>
                {m ? m.nome : q.codigo}
                <span style={{ color: "#888", marginLeft: 7 }}>({q.codigo})</span>
                <button
                  onClick={() => moveToEnd(idx)}
                  style={{
                    marginLeft: 12, background: "#ffe1cd", color: "#d86718", border: "none",
                    borderRadius: 7, fontWeight: 700, padding: "5px 13px", fontSize: 15, cursor: "pointer"
                  }}
                >Mover para final</button>
                <button
                  onClick={() => removeMotoboyFromQueue(idx)}
                  style={{
                    marginLeft: 6, background: "#fff", color: "#be1e1e", border: "1.5px solid #be1e1e",
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
            background: "#fff", color: "#d86718", border: "2px solid #d86718", borderRadius: 8,
            fontWeight: 700, padding: "11px 0", fontSize: 17, width: "100%", marginTop: 18, cursor: "pointer"
          }}
        >Resetar Fila</button>
      </div>
    </div>
  );
}
