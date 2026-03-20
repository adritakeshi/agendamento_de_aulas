// frontend/src/hooks/useProfessores.js
import { useState, useCallback, useEffect } from 'react';
import { professorService } from '../services/api';

export const useProfessores = () => {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar todos os professores
  const carregarProfessores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await professorService.getAll();
      setProfessores(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar professores');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar ao montar
  useEffect(() => {
    carregarProfessores();
  }, [carregarProfessores]);

  // Obter professor por ID
  const obterProfessor = useCallback(async (id) => {
    try {
      const response = await professorService.getById(id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao obter professor');
      return null;
    }
  }, []);

  // Filtrar por especialidade
  const filtrarPorEspecialidade = useCallback((especialidade) => {
    return professores.filter(prof => prof.especialidade === especialidade);
  }, [professores]);

  // Obter especialidades únicas
  const obterEspecialidades = useCallback(() => {
    return [...new Set(professores.map(prof => prof.especialidade))];
  }, [professores]);

  return {
    professores,
    loading,
    error,
    carregarProfessores,
    obterProfessor,
    filtrarPorEspecialidade,
    obterEspecialidades
  };
};

export default useProfessores;
