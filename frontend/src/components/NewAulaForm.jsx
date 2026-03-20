// src/components/NewAulaForm.jsx
import React, { useState } from 'react';
import './NewAulaForm.css';

function NewAulaForm({ professors, alunos, onSave, onClose }) {
  const [formData, setFormData] = useState({
    professor_id: '',
    aluno_id: '',
    titulo: '',
    data_aula: '',
    duracao_minutos: 60,
    local: 'Online',
    tipo: 'online',
    preco: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validar = () => {
    const newErrors = {};

    if (!formData.professor_id) newErrors.professor_id = 'Selecione um professor';
    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!formData.data_aula) newErrors.data_aula = 'Data e hora são obrigatórias';
    if (formData.duracao_minutos < 15) newErrors.duracao_minutos = 'Mínimo 15 minutos';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validar()) {
      onSave({
        ...formData,
        professor_id: parseInt(formData.professor_id),
        aluno_id: formData.aluno_id ? parseInt(formData.aluno_id) : null,
        duracao_minutos: parseInt(formData.duracao_minutos),
        preco: formData.preco ? parseFloat(formData.preco) : 0
      });
    }
  };

  const professorSelecionado = professors.find(p => p.id === parseInt(formData.professor_id));

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>➕ Agendar Nova Aula</h2>
          <button className="form-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="aula-form">
          <div className="form-group">
            <label>👨‍🏫 Professor *</label>
            <select
              name="professor_id"
              value={formData.professor_id}
              onChange={handleChange}
              className={errors.professor_id ? 'error' : ''}
            >
              <option value="">Selecione um professor</option>
              {professors.map(prof => (
                <option key={prof.id} value={prof.id}>
                  {prof.nome} - {prof.especialidade}
                </option>
              ))}
            </select>
            {errors.professor_id && <span className="error-message">{errors.professor_id}</span>}
          </div>

          <div className="form-group">
            <label>👤 Aluno (Opcional)</label>
            <select
              name="aluno_id"
              value={formData.aluno_id}
              onChange={handleChange}
            >
              <option value="">Não confirmado</option>
              {alunos.map(aluno => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>📚 Título da Aula *</label>
            <input
              type="text"
              name="titulo"
              placeholder="Ex: Geometria Analítica - Sistemas de Coordenadas"
              value={formData.titulo}
              onChange={handleChange}
              className={errors.titulo ? 'error' : ''}
            />
            {errors.titulo && <span className="error-message">{errors.titulo}</span>}
          </div>

          <div className="form-group">
            <label>📅 Data e Hora *</label>
            <input
              type="datetime-local"
              name="data_aula"
              value={formData.data_aula}
              onChange={handleChange}
              className={errors.data_aula ? 'error' : ''}
            />
            {errors.data_aula && <span className="error-message">{errors.data_aula}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>⏱️ Duração (minutos) *</label>
              <input
                type="number"
                name="duracao_minutos"
                min="15"
                step="15"
                value={formData.duracao_minutos}
                onChange={handleChange}
                className={errors.duracao_minutos ? 'error' : ''}
              />
              {errors.duracao_minutos && <span className="error-message">{errors.duracao_minutos}</span>}
            </div>

            <div className="form-group">
              <label>💰 Preço (R$)</label>
              <input
                type="number"
                name="preco"
                min="0"
                step="10"
                placeholder="0.00"
                value={formData.preco}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>📍 Local</label>
              <input
                type="text"
                name="local"
                placeholder="Ex: Sala 101, Online"
                value={formData.local}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>🔄 Tipo</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
              >
                <option value="online">💻 Online</option>
                <option value="presencial">🏫 Presencial</option>
                <option value="hibrido">🔀 Híbrido</option>
              </select>
            </div>
          </div>

          {professorSelecionado && (
            <div className="professor-info">
              <p>
                <strong>Especialidade:</strong> {professorSelecionado.especialidade}
              </p>
              <p>
                <strong>Email:</strong> {professorSelecionado.email}
              </p>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              ✅ Criar Aula
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewAulaForm;
