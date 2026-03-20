// backend/tests/api.test.js
// Exemplos de testes usando Jest ou similar

/**
 * TESTES DA API DE AGENDAMENTO DE AULAS
 * 
 * Para rodar os testes, instale Jest:
 * npm install --save-dev jest
 * 
 * Adicione em package.json:
 * "test": "jest"
 * 
 * Execute:
 * npm test
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Testes de Aulas
describe('API de Aulas', () => {
  let aulaId;

  test('GET /aulas deve retornar lista de aulas', async () => {
    const response = await axios.get(`${API_URL}/aulas`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('POST /aulas deve criar nova aula', async () => {
    const novaAula = {
      professor_id: 1,
      titulo: 'Teste de Aula',
      data_aula: '2024-04-15T14:00:00',
      duracao_minutos: 60,
      local: 'Online',
      preco: 100
    };

    const response = await axios.post(`${API_URL}/aulas`, novaAula);
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
    aulaId = response.data.id;
  });

  test('GET /aulas/:id deve retornar aula específica', async () => {
    const response = await axios.get(`${API_URL}/aulas/1`);
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(1);
  });

  test('PUT /aulas/:id deve atualizar aula', async () => {
    const dadosAtualizados = {
      titulo: 'Aula Atualizada',
      status: 'concluida'
    };

    const response = await axios.put(`${API_URL}/aulas/1`, dadosAtualizados);
    expect(response.status).toBe(200);
  });

  test('DELETE /aulas/:id deve deletar aula', async () => {
    if (aulaId) {
      const response = await axios.delete(`${API_URL}/aulas/${aulaId}`);
      expect(response.status).toBe(200);
    }
  });
});

// Testes de Professores
describe('API de Professores', () => {
  test('GET /professores deve retornar lista de professores', async () => {
    const response = await axios.get(`${API_URL}/professores`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('GET /professores/:id deve retornar professor específico', async () => {
    const response = await axios.get(`${API_URL}/professores/1`);
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(1);
  });
});

// Testes de Alunos
describe('API de Alunos', () => {
  let alunoId;

  test('GET /alunos deve retornar lista de alunos', async () => {
    const response = await axios.get(`${API_URL}/alunos`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('POST /alunos deve criar novo aluno', async () => {
    const novoAluno = {
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '11999999999'
    };

    const response = await axios.post(`${API_URL}/alunos`, novoAluno);
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
    alunoId = response.data.id;
  });
});

// Testes de Conteúdo
describe('API de Conteúdo', () => {
  test('POST /conteudo deve salvar conteúdo da aula', async () => {
    const conteudo = {
      aula_id: 1,
      descricao: 'Conteúdo de teste',
      materiais: 'Materiais de teste',
      topicos_abordados: 'Tópico 1, Tópico 2'
    };

    const response = await axios.post(`${API_URL}/conteudo`, conteudo);
    expect(response.status).toBe(200);
  });

  test('GET /conteudo/:aula_id deve retornar conteúdo', async () => {
    const response = await axios.get(`${API_URL}/conteudo/1`);
    expect(response.status).toBe(200);
    expect(response.data.aula_id).toBe(1);
  });
});

// Testes de Validação de Erro
describe('Validação de Erros', () => {
  test('Deve retornar 400 para campos obrigatórios faltando', async () => {
    try {
      await axios.post(`${API_URL}/aulas`, {
        professor_id: 1
        // Faltando título, data, etc
      });
    } catch (error) {
      expect(error.response.status).toBe(400);
    }
  });

  test('Deve retornar 404 para recurso não encontrado', async () => {
    try {
      await axios.get(`${API_URL}/aulas/99999`);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});

// Scripts de teste manual (cURL)

/**
 * TESTES COM cURL
 * 
 * 1. Obter todas as aulas:
 * curl http://localhost:5000/api/aulas
 * 
 * 2. Obter aula específica:
 * curl http://localhost:5000/api/aulas/1
 * 
 * 3. Criar nova aula:
 * curl -X POST http://localhost:5000/api/aulas \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "professor_id": 1,
 *     "titulo": "Nova Aula",
 *     "data_aula": "2024-04-15T14:00:00",
 *     "duracao_minutos": 60,
 *     "local": "Online",
 *     "preco": 100
 *   }'
 * 
 * 4. Atualizar aula:
 * curl -X PUT http://localhost:5000/api/aulas/1 \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "titulo": "Aula Atualizada",
 *     "status": "concluida"
 *   }'
 * 
 * 5. Deletar aula:
 * curl -X DELETE http://localhost:5000/api/aulas/1
 * 
 * 6. Obter professores:
 * curl http://localhost:5000/api/professores
 * 
 * 7. Obter alunos:
 * curl http://localhost:5000/api/alunos
 * 
 * 8. Salvar conteúdo da aula:
 * curl -X POST http://localhost:5000/api/conteudo \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "aula_id": 1,
 *     "descricao": "Descrição da aula",
 *     "materiais": "Material 1, Material 2",
 *     "topicos_abordados": "Tópico 1, Tópico 2"
 *   }'
 */
