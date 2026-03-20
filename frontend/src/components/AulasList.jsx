// src/components/AulasList.jsx
import React from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import './AulasList.css';

function AulasList({ aulas, onSelectAula }) {
  const formatarData = (dataString) => {
    return format(new Date(dataString), 'dd MMM yyyy HH:mm', { locale: ptBR });
  };

  const getStatusColor = (status) => {
    const colors = {
      agendada: '#4f46e5',
      em_progresso: '#f59e0b',
      concluida: '#10b981',
      cancelada: '#ef4444'
    };
    return colors[status] || '#64748b';
  };

  const getStatusText = (status) => {
    const texts = {
      agendada: 'Agendada',
      em_progresso: 'Em Progresso',
      concluida: 'Concluída',
      cancelada: 'Cancelada'
    };
    return texts[status] || status;
  };

  const getTipoIcon = (tipo) => {
    const icons = {
      presencial: '🏫',
      online: '💻',
      hibrido: '🔀'
    };
    return icons[tipo] || '📍';
  };

  if (aulas.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 Nenhuma aula encontrada</p>
      </div>
    );
  }

  return (
    <div className="aulas-list">
      {aulas.map(aula => (
        <div
          key={aula.id}
          className="aula-list-item"
          onClick={() => onSelectAula(aula)}
        >
          <div className="item-header">
            <h3>{aula.titulo}</h3>
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(aula.status) }}
            >
              {getStatusText(aula.status)}
            </span>
          </div>

          <div className="item-info">
            <p className="professor">👨‍🏫 {aula.professor} • {aula.especialidade}</p>
            <p className="aluno">👤 {aula.aluno || 'Aluno não confirmado'}</p>
          </div>

          <div className="item-details">
            <div className="detail">
              <span className="label">📅 Data</span>
              <span className="value">{formatarData(aula.data_aula)}</span>
            </div>
            <div className="detail">
              <span className="label">⏱️ Duração</span>
              <span className="value">{aula.duracao_minutos} min</span>
            </div>
            <div className="detail">
              <span className="label">📍 Local</span>
              <span className="value">{getTipoIcon(aula.tipo)} {aula.local}</span>
            </div>
            <div className="detail">
              <span className="label">💰 Preço</span>
              <span className="value preco">R$ {aula.preco?.toFixed(2) || '0,00'}</span>
            </div>
          </div>

          <div className="item-action">
            <span className="ver-detalhes">Ver Detalhes →</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AulasList;
