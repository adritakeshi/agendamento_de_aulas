// frontend/src/services/api.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Adicionar token ao header se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== AULAS =====

export const aulaService = {
  // Obter todas as aulas
  getAll: () => api.get('/aulas'),

  // Obter aula por ID
  getById: (id) => api.get(`/aulas/${id}`),

  // Obter aulas de um professor
  getPorProfessor: (professorId) => api.get(`/aulas-professor/${professorId}`),

  // Obter aulas de um período
  getPorPeriodo: (inicio, fim) => api.get(`/aulas/periodo/${inicio}/${fim}`),

  // Criar nova aula
  create: (dados) => api.post('/aulas', dados),

  // Atualizar aula
  update: (id, dados) => api.put(`/aulas/${id}`, dados),

  // Deletar aula
  delete: (id) => api.delete(`/aulas/${id}`)
};

// ===== PROFESSORES =====

export const professorService = {
  // Obter todos os professores
  getAll: () => api.get('/professores'),

  // Obter professor por ID
  getById: (id) => api.get(`/professores/${id}`)
};

// ===== ALUNOS =====

export const alunoService = {
  // Obter todos os alunos
  getAll: () => api.get('/alunos'),

  // Criar novo aluno
  create: (dados) => api.post('/alunos', dados)
};

// ===== CONTEÚDO =====

export const conteudoService = {
  // Obter conteúdo da aula
  get: (aulaId) => api.get(`/conteudo/${aulaId}`),

  // Criar ou atualizar conteúdo
  save: (dados) => api.post('/conteudo', dados)
};

// ===== AUTENTICAÇÃO (quando implementada) =====

export const authService = {
  // Login
  login: (email, senha) => api.post('/auth/login', { email, senha }),

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },

  // Registrar
  register: (dados) => api.post('/auth/register', dados),

  // Verificar token
  verify: () => api.get('/auth/verify')
};

// ===== UTILITY =====

// Função helper para tratamento de erros
export const tratarErroAPI = (error) => {
  if (error.response) {
    // Erro da API
    return error.response.data?.error || 'Erro ao processar requisição';
  } else if (error.request) {
    // Sem resposta da API
    return 'Servidor não respondeu. Verifique sua conexão.';
  } else {
    // Erro na requisição
    return error.message || 'Erro desconhecido';
  }
};

export default api;
