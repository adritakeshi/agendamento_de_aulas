// src/components/AulaModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import './AulaModal.css';

function AulaModal({ aula, onClose, onDelete, onConfirmAluno, alunos }) {
  const [conteudo, setConteudo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlunoForm, setShowAlunoForm] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);

  useEffect(() => {
    carregarConteudo();
  }, [aula.id]);

  const carregarConteudo = async () => {
    try {
      const res = await axios.get(`/api/conteudo/${aula.id}`);
      setConteudo(res.data);
    } catch (error) {
      // Conteúdo não encontrado é OK
      setConteudo(null);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    return format(new Date(dataString), 'PPP HH:mm', { locale: ptBR });
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

  const getTipoText = (tipo) => {
    const texts = {
      presencial: '🏫 Presencial',
      online: '💻 Online',
      hibrido: '🔀 Híbrido'
    };
    return texts[tipo] || tipo;
  };

  const handleConfirmAluno = (alunoId) => {
    onConfirmAluno(aula.id, alunoId);
    setShowAlunoForm(false);
  };

  const topicos = conteudo?.topicos_abordados?.split(',').filter(t => t.trim()) || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderLeftColor: getStatusColor(aula.status) }}>
          <div className="modal-header-info">
            <h2>{aula.titulo}</h2>
            <p className="modal-professor">{aula.professor} • {aula.especialidade}</p>
            <span className="status-badge" style={{ backgroundColor: getStatusColor(aula.status) }}>
              {getStatusText(aula.status)}
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <>
              {/* Informações Gerais */}
              <section className="modal-section">
                <h3>📅 Informações da Aula</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Data e Hora</label>
                    <p>{formatarData(aula.data_aula)}</p>
                  </div>
                  <div className="info-item">
                    <label>⏱️ Duração</label>
                    <p>{aula.duracao_minutos} minutos</p>
                  </div>
                  <div className="info-item">
                    <label>📍 Local</label>
                    <p>{getTipoText(aula.tipo)} - {aula.local}</p>
                  </div>
                  <div className="info-item">
                    <label>💰 Preço</label>
                    <p className="preco">R$ {aula.preco?.toFixed(2) || '0,00'}</p>
                  </div>
                </div>
              </section>

              {/* Aluno */}
              <section className="modal-section">
                <h3>👤 Aluno</h3>
                {aula.aluno ? (
                  <div className="aluno-info">
                    <p><strong>{aula.aluno}</strong></p>
                    <p>{aula.aluno_email}</p>
                  </div>
                ) : (
                  <div className="sem-aluno">
                    <p>Nenhum aluno confirmado</p>
                    {alunos.length > 0 && (
                      <button 
                        className="btn-secondary"
                        onClick={() => setShowAlunoForm(!showAlunoForm)}
                      >
                        + Confirmar Aluno
                      </button>
                    )}
                    {showAlunoForm && (
                      <div className="aluno-select">
                        <select 
                          onChange={(e) => setSelectedAluno(parseInt(e.target.value))}
                          defaultValue=""
                        >
                          <option value="">Selecione um aluno</option>
                          {alunos.map(aluno => (
                            <option key={aluno.id} value={aluno.id}>
                              {aluno.nome}
                            </option>
                          ))}
                        </select>
                        {selectedAluno && (
                          <button 
                            className="btn-primary"
                            onClick={() => handleConfirmAluno(selectedAluno)}
                          >
                            Confirmar
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Conteúdo da Aula */}
              {conteudo && (
                <>
                  <section className="modal-section">
                    <h3>📖 Conteúdo da Aula</h3>
                    <div className="content-box">
                      {conteudo.descricao}
                    </div>
                  </section>

                  {topicos.length > 0 && (
                    <section className="modal-section">
                      <h3>✨ Tópicos Abordados</h3>
                      <ul className="topicos-list">
                        {topicos.map((topico, idx) => (
                          <li key={idx}>{topico.trim()}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {conteudo.materiais && (
                    <section className="modal-section">
                      <h3>📌 Materiais de Apoio</h3>
                      <div className="content-box">
                        {conteudo.materiais}
                      </div>
                    </section>
                  )}

                  {conteudo.notas_professor && (
                    <section className="modal-section">
                      <h3>📝 Notas do Professor</h3>
                      <div className="content-box notas">
                        {conteudo.notas_professor}
                      </div>
                    </section>
                  )}
                </>
              )}

              {!conteudo && (
                <section className="modal-section">
                  <p style={{ color: '#64748b', textAlign: 'center' }}>
                    Nenhum conteúdo registrado para esta aula ainda.
                  </p>
                </section>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Fechar
          </button>
          {aula.status === 'agendada' && (
            <button 
              className="btn-danger"
              onClick={onDelete}
            >
              🗑️ Deletar Aula
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AulaModal;
