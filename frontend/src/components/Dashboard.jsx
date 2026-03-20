// src/components/Dashboard.jsx
import React, { useMemo } from 'react';
import './Dashboard.css';

function Dashboard({ aulas, professors }) {
  const stats = useMemo(() => {
    const agendadas = aulas.filter(a => a.status === 'agendada').length;
    const concluidas = aulas.filter(a => a.status === 'concluida').length;
    const totalAulas = aulas.length;
    const receita = aulas.reduce((sum, a) => sum + (a.preco || 0), 0);

    // Próximas 3 aulas
    const agora = new Date();
    const proximasAulas = aulas
      .filter(a => new Date(a.data_aula) >= agora && a.status === 'agendada')
      .sort((a, b) => new Date(a.data_aula) - new Date(b.data_aula))
      .slice(0, 3);

    // Professor com mais aulas
    const professorComMaisAulas = professors
      .map(p => ({
        ...p,
        totalAulas: aulas.filter(a => a.professor_id === p.id).length
      }))
      .sort((a, b) => b.totalAulas - a.totalAulas)[0];

    return {
      agendadas,
      concluidas,
      totalAulas,
      receita,
      proximasAulas,
      professorComMaisAulas
    };
  }, [aulas, professors]);

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">📊 Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <p className="stat-label">Aulas Agendadas</p>
            <p className="stat-value">{stats.agendadas}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-label">Aulas Concluídas</p>
            <p className="stat-value">{stats.concluidas}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <p className="stat-label">Total de Aulas</p>
            <p className="stat-value">{stats.totalAulas}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Receita Total</p>
            <p className="stat-value">R$ {stats.receita.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {stats.proximasAulas.length > 0 && (
        <div className="upcoming-section">
          <h3>🕐 Próximas Aulas</h3>
          <div className="upcoming-list">
            {stats.proximasAulas.map(aula => (
              <div key={aula.id} className="upcoming-item">
                <div className="upcoming-time">
                  {formatarData(aula.data_aula)}
                </div>
                <div className="upcoming-info">
                  <p className="upcoming-title">{aula.titulo}</p>
                  <p className="upcoming-professor">{aula.professor}</p>
                </div>
                <div className="upcoming-duracao">
                  {aula.duracao_minutos}min
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.professorComMaisAulas && (
        <div className="professor-section">
          <h3>⭐ Professor Destaque</h3>
          <div className="professor-card">
            <p className="professor-name">{stats.professorComMaisAulas.nome}</p>
            <p className="professor-specialty">
              {stats.professorComMaisAulas.especialidade}
            </p>
            <p className="professor-count">
              {stats.professorComMaisAulas.totalAulas} aulas agendadas
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
