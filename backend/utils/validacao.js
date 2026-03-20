// backend/utils/validacao.js

// Validar email
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar nome
const validarNome = (nome) => {
  return nome && nome.trim().length >= 3 && nome.length <= 150;
};

// Validar data no formato ISO
const validarDataISO = (data) => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if (!regex.test(data)) return false;
  
  const dateObj = new Date(data);
  return dateObj instanceof Date && !isNaN(dateObj);
};

// Validar duração (minutos)
const validarDuracao = (duracao) => {
  const min = 15;
  const max = 480; // 8 horas
  return duracao >= min && duracao <= max;
};

// Validar preço
const validarPreco = (preco) => {
  return preco >= 0 && preco <= 10000;
};

// Validar status
const statusValidos = ['agendada', 'em_progresso', 'concluida', 'cancelada'];
const validarStatus = (status) => {
  return statusValidos.includes(status);
};

// Validar tipo
const tiposValidos = ['presencial', 'online', 'hibrido'];
const validarTipo = (tipo) => {
  return tiposValidos.includes(tipo);
};

// Validar formulário de nova aula
const validarNovaAula = (dados) => {
  const erros = {};

  if (!dados.professor_id) {
    erros.professor_id = 'Professor é obrigatório';
  }

  if (!dados.titulo || !validarNome(dados.titulo)) {
    erros.titulo = 'Título deve ter entre 3 e 150 caracteres';
  }

  if (!dados.data_aula || !validarDataISO(dados.data_aula)) {
    erros.data_aula = 'Data e hora inválidas (use formato: YYYY-MM-DDTHH:MM:SS)';
  } else {
    const dataAula = new Date(dados.data_aula);
    const agora = new Date();
    if (dataAula < agora) {
      erros.data_aula = 'A data não pode ser no passado';
    }
  }

  if (!dados.duracao_minutos || !validarDuracao(dados.duracao_minutos)) {
    erros.duracao_minutos = 'Duração deve estar entre 15 e 480 minutos';
  }

  if (dados.preco !== undefined && !validarPreco(dados.preco)) {
    erros.preco = 'Preço deve estar entre 0 e 10000';
  }

  if (dados.status && !validarStatus(dados.status)) {
    erros.status = 'Status inválido';
  }

  if (dados.tipo && !validarTipo(dados.tipo)) {
    erros.tipo = 'Tipo de aula inválido';
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros
  };
};

// Validar formulário de novo aluno
const validarNovoAluno = (dados) => {
  const erros = {};

  if (!dados.nome || !validarNome(dados.nome)) {
    erros.nome = 'Nome deve ter entre 3 e 150 caracteres';
  }

  if (!dados.email || !validarEmail(dados.email)) {
    erros.email = 'Email inválido';
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros
  };
};

// Sanitizar string (remover caracteres perigosos)
const sanitizar = (string) => {
  if (typeof string !== 'string') return string;
  
  return string
    .replace(/[<>]/g, '')
    .trim();
};

module.exports = {
  validarEmail,
  validarNome,
  validarDataISO,
  validarDuracao,
  validarPreco,
  validarStatus,
  validarTipo,
  validarNovaAula,
  validarNovoAluno,
  sanitizar,
  statusValidos,
  tiposValidos
};
