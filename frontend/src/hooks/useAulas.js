// frontend/src/hooks/useAulas.js
import { useState, useCallback, useEffect } from 'react';
import { aulaService } from '../services/api';

export const useAulas = () => {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar todas as aulas
  const carregarAulas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await aulaService.getAll();
      setAulas(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar aulas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar aulas ao montar o componente
  useEffect(() => {
    carregarAulas();
  }, [carregarAulas]);

  // Criar aula
  const criarAula = useCallback(async (dados) => {
    setLoading(true);
    setError(null);
    try {
      await aulaService.create(dados);
      await carregarAulas();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar aula');
      return false;
    } finally {
      setLoading(false);
    }
  }, [carregarAulas]);

  // Atualizar aula
  const atualizarAula = useCallback(async (id, dados) => {
    setLoading(true);
    setError(null);
    try {
      await aulaService.update(id, dados);
      await carregarAulas();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao atualizar aula');
      return false;
    } finally {
      setLoading(false);
    }
  }, [carregarAulas]);

  // Deletar aula
  const deletarAula = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await aulaService.delete(id);
      await carregarAulas();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao deletar aula');
      return false;
    } finally {
      setLoading(false);
    }
  }, [carregarAulas]);

  // Obter aula por ID
  const obterAula = useCallback(async (id) => {
    try {
      const response = await aulaService.getById(id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao obter aula');
      return null;
    }
  }, []);

  // Filtrar aulas por status
  const filtrarPorStatus = useCallback((status) => {
    return aulas.filter(aula => aula.status === status);
  }, [aulas]);

  // Filtrar aulas por professor
  const filtrarPorProfessor = useCallback((professorId) => {
    return aulas.filter(aula => aula.professor_id === professorId);
  }, [aulas]);

  // Obter próximas aulas
  const obterProximasAulas = useCallback((limite = 5) => {
    const agora = new Date();
    return aulas
      .filter(aula => new Date(aula.data_aula) >= agora)
      .sort((a, b) => new Date(a.data_aula) - new Date(b.data_aula))
      .slice(0, limite);
  }, [aulas]);

  return {
    aulas,
    loading,
    error,
    carregarAulas,
    criarAula,
    atualizarAula,
    deletarAula,
    obterAula,
    filtrarPorStatus,
    filtrarPorProfessor,
    obterProximasAulas
  };
};

export default useAulas;
