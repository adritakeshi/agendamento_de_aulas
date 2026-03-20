// src/App.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import axios from 'axios';
import Calendar from './components/Calendar';
import AulaModal from './components/AulaModal';
import NewAulaForm from './components/NewAulaForm';
import AulasList from './components/AulasList';
import './App.css';

function App() {
  const [aulas, setAulas] = useState([]);
  const [selectedAula, setSelectedAula] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calendario'); // calendario ou lista
  const [professors, setProfessors] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [filtroEspecialidade, setFiltroEspecialidade] = useState('');

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [aulasRes, professoresRes, alunosRes] = await Promise.all([
        axios.get('/api/aulas'),
        axios.get('/api/professores'),
        axios.get('/api/alunos')
      ]);
      
      setAulas(aulasRes.data);
      setProfessors(professoresRes.data);
      setAlunos(alunosRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados da API. Certifique-se que o servidor está rodando!');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (aula) => {
    setSelectedAula(aula);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAula(null);
  };

  const handleSaveAula = async (novaAula) => {
    try {
      if (novaAula.id) {
        // Atualizar
        await axios.put(`/api/aulas/${novaAula.id}`, novaAula);
      } else {
        // Criar
        await axios.post('/api/aulas', novaAula);
      }
      
      await carregarDados();
      setShowNewForm(false);
      alert('Aula salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar aula:', error);
      alert('Erro ao salvar aula');
    }
  };

  const handleDeleteAula = async (aulaId) => {
    if (window.confirm('Tem certeza que deseja deletar esta aula?')) {
      try {
        await axios.delete(`/api/aulas/${aulaId}`);
        await carregarDados();
        handleCloseModal();
        alert('Aula deletada com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar aula:', error);
        alert('Erro ao deletar aula');
      }
    }
  };

  const handleConfirmAluno = async (aulaId, alunoId) => {
    try {
      const aula = aulas.find(a => a.id === aulaId);
      await axios.put(`/api/aulas/${aulaId}`, {
        ...aula,
        aluno_id: alunoId
      });
      await carregarDados();
      alert('Aluno confirmado na aula!');
    } catch (error) {
      console.error('Erro ao confirmar aluno:', error);
      alert('Erro ao confirmar aluno');
    }
  };

  const especialidades = [...new Set(professors.map(p => p.especialidade))];
  const aulasFiltradas = filtroEspecialidade 
    ? aulas.filter(a => a.especialidade === filtroEspecialidade)
    : aulas;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando sistema...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>📚 Sistema de Agendamento de Aulas</h1>
            <p>Gerencie e agende aulas particulares de forma moderna</p>
          </div>
          <button 
            className="btn-nova-aula"
            onClick={() => setShowNewForm(true)}
          >
            + Nova Aula
          </button>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'calendario' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendario')}
        >
          📅 Calendário
        </button>
        <button
          className={`nav-btn ${activeTab === 'lista' ? 'active' : ''}`}
          onClick={() => setActiveTab('lista')}
        >
          📋 Lista de Aulas
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'calendario' && (
          <div className="calendar-section">
            <Calendar 
              aulas={aulasFiltradas}
              onSelectEvent={handleSelectEvent}
            />
          </div>
        )}

        {activeTab === 'lista' && (
          <div className="list-section">
            <div className="list-filters">
              <div className="filter-group">
                <label>Filtrar por especialidade:</label>
                <select 
                  value={filtroEspecialidade}
                  onChange={(e) => setFiltroEspecialidade(e.target.value)}
                >
                  <option value="">Todas</option>
                  {especialidades.map(esp => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>
              <p className="total-aulas">{aulasFiltradas.length} aulas encontradas</p>
            </div>
            <AulasList 
              aulas={aulasFiltradas}
              onSelectAula={handleSelectEvent}
            />
          </div>
        )}
      </main>

      {showModal && selectedAula && (
        <AulaModal
          aula={selectedAula}
          onClose={handleCloseModal}
          onDelete={() => handleDeleteAula(selectedAula.id)}
          onConfirmAluno={handleConfirmAluno}
          alunos={alunos}
        />
      )}

      {showNewForm && (
        <NewAulaForm
          professors={professors}
          alunos={alunos}
          onSave={handleSaveAula}
          onClose={() => setShowNewForm(false)}
        />
      )}
    </div>
  );
}

export default App;
