// frontend/src/hooks/useAlunos.js
import { useState, useCallback, useEffect } from 'react';
import { alunoService } from '../services/api';

export const useAlunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar todos os alunos
  const carregarAlunos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await alunoService.getAll();
      setAlunos(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar ao montar
  useEffect(() => {
    carregarAlunos();
  }, [carregarAlunos]);

  // Criar novo aluno
  const criarAluno = useCallback(async (dados) => {
    setLoading(true);
    setError(null);
    try {
      const response = await alunoService.create(dados);
      await carregarAlunos();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar aluno');
      return null;
    } finally {
      setLoading(false);
    }
  }, [carregarAlunos]);

  // Buscar aluno por nome
  const buscarPorNome = useCallback((nome) => {
    return alunos.filter(aluno =>
      aluno.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }, [alunos]);

  // Obter aluno por ID
  const obterAlunoPorId = useCallback((id) => {
    return alunos.find(aluno => aluno.id === id);
  }, [alunos]);

  return {
    alunos,
    loading,
    error,
    carregarAlunos,
    criarAluno,
    buscarPorNome,
    obterAlunoPorId
  };
};

export default useAlunos;
