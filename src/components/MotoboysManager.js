import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, set, onValue, remove, update } from 'firebase/database';

// Função para gerar código aleatório de 5 caracteres
function gerarCodigo() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < 5; i++) {
    codigo += letras[Math.floor(Math.random() * letras.length)];
  }
  return codigo;
}

export default function MotoboysManager({ onBack }) {
  const [motoboys, setMotoboys] = useState({});
  const [name, setName] = useState('');
  const [editCodigo, setEditCodigo] = useState(null);
  const [editName, setEditName] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    onValue(ref(db, 'motoboys'), (snapshot) => setMotoboys(snapshot.val() || {}));
  }, []);

  // Adicionar novo motoboy
  const addMotoboy = () => {
    if (name.trim() === '') return setErro('Preencha o nome!');
    // Gera um código único (confere se já existe)
    let novoCodigo = '';
    let tentativas = 0;
    do {
      novoCodigo = gerarCodigo();
      tentativas++;
    } while (motoboys[novoCodigo] && tentativas < 20);
    set(ref(db, `motoboys/${novoCodigo}`), { nome: name, codigo: novoCodigo });
    setName('');
    setErro('');
  };

  // Remover motoboy
  const removerMotoboy = (codigo) => {
    if (window.confirm('Tem certeza que deseja remover este motoboy?')) {
      remove(ref(db, `motoboys/${codigo}`));
    }
  };

  // Iniciar edição
  const editarMotoboy = (codigo, nomeAtual) => {
    setEditCodigo(codigo);
    setEditName(nomeAtual);
    setErro('');
  };

  // Salvar edição
  const salvarEdicao = () => {
    if (editName.trim() === '') return setErro('O nome não pode ficar em branco!');
    update(ref(db, `motoboys/${editCodigo}`), { nome: editName });
    setEditCodigo(null);
    setEditName('');
    setErro('');
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "start", paddingTop: 48
    }}>
      <div style={{
        background: "#1a1a1a", borderRadius: 20, padding: "38px 32px", boxShadow: "0 6px 36px #0005",
        maxWidth: 500, width: "97%", margin: "0 auto", fontFamily: "Nunito, Arial, sans-serif"
      }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 20, justifyContent: "space-between" }}>
          <h2 style={{ color: "#ffc300", fontWeight: 900, fontSize: 23 }}>Gerenciar Motoboys</h2>
          <button
            style={{
              background: "#fff", color: "#000", border: "2px solid #fff", borderRadius: 8,
              fontWeight: 700, padding: "8px 18px", fontSize: 16, cursor: "pointer"
            }}
            onClick={onBack}
          >Voltar</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            placeholder="Nome do motoboy"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              flex: 1, padding: "12px 10px", borderRadius: 7, border: "1.5px solid #fff", fontSize: 16,
              background: "#222", color: "#fff"
            }}
          />
          <button
            onClick={addMotoboy}
            style={{
              background: "#fff", color: "#000", border: "none", borderRadius: 7,
              fontWeight: 700, padding: "12px 18px", fontSize: 16, cursor: "pointer"
            }}
          >Cadastrar</button>
        </div>
        {erro && <div style={{ color: "#ff4747", marginBottom: 7 }}>{erro}</div>}

        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {Object.values(motoboys).length === 0 && <li style={{ color: "#ffc300" }}>Nenhum motoboy cadastrado.</li>}
          {Object.values(motoboys).map((m, i) => (
            <li key={i} style={{ marginBottom: 10, color: "#fff" }}>
              {editCodigo === m.codigo ? (
                <>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    style={{
                      padding: "8px 8px", fontSize: 15, borderRadius: 5, border: "1px solid #ffc300",
                      background: "#222", color: "#fff"
                    }}
                  />
                  <button
                    onClick={salvarEdicao}
                    style={{
                      background: "#ffc300", color: "#000", border: "none", borderRadius: 6,
                      fontWeight: 700, padding: "6px 12px", fontSize: 14, marginLeft: 5, cursor: "pointer"
                    }}
                  >Salvar</button>
                  <button
                    onClick={() => setEditCodigo(null)}
                    style={{
                      background: "#fff", color: "#000", border: "1.5px solid #fff", borderRadius: 6,
                      fontWeight: 700, padding: "6px 12px", fontSize: 14, marginLeft: 5, cursor: "pointer"
                    }}
                  >Cancelar</button>
                </>
              ) : (
                <>
                  <b style={{ color: "#ffc300" }}>{m.codigo}</b> – {m.nome}
                  <button
                    onClick={() => editarMotoboy(m.codigo, m.nome)}
                    style={{
                      background: "#ffc300", color: "#000", border: "none", borderRadius: 6,
                      fontWeight: 700, padding: "6px 12px", fontSize: 14, marginLeft: 12, cursor: "pointer"
                    }}
                  >Editar</button>
                  <button
                    onClick={() => removerMotoboy(m.codigo)}
                    style={{
                      background: "#fff", color: "#be1e1e", border: "1.5px solid #be1e1e", borderRadius: 6,
                      fontWeight: 700, padding: "6px 12px", fontSize: 14, marginLeft: 5, cursor: "pointer"
                    }}
                  >Remover</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
