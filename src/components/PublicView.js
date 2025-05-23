import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

export default function PublicView({ onAdminLogin }) {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const queueRef = ref(db, 'queue');
    onValue(queueRef, (snapshot) => {
      const data = snapshot.val() || [];
      setQueue(data);
    });
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h1>Rodízio de Motoboys</h1>
      <h2>Ordem Atual:</h2>
      <ol>
        {queue.map((motoboy, idx) => (
          <li key={idx}>{motoboy.name}</li>
        ))}
      </ol>
      <button onClick={onAdminLogin}>Área do Operador</button>
      <p style={{ fontStyle: 'italic' }}>Atualizado em tempo real</p>
    </div>
  );
}
