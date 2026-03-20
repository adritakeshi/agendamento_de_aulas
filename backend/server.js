// server.js - Servidor Express para API de agendamento de aulas
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Pool de conexões MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '282612',
  database: process.env.DB_NAME || 'agendamento_aulas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware para adicionar pool nas rotas
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// ===== ROTAS DE PROFESSORES =====

// GET todos os professores
app.get('/api/professores', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT id, nome, email, especialidade, bio FROM professores ORDER BY nome'
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar professores' });
  }
});

// GET professor por ID
app.get('/api/professores/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM professores WHERE id = ?',
      [req.params.id]
    );
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar professor' });
  }
});

// ===== ROTAS DE AULAS =====

// GET todas as aulas
app.get('/api/aulas', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT 
        a.id,
        a.titulo,
        a.data_aula,
        a.duracao_minutos,
        a.status,
        a.local,
        a.preco,
        p.id as professor_id,
        p.nome as professor,
        p.especialidade,
        al.id as aluno_id,
        al.nome as aluno
      FROM aulas a
      JOIN professores p ON a.professor_id = p.id
      LEFT JOIN alunos al ON a.aluno_id = al.id
      ORDER BY a.data_aula ASC
    `);
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar aulas' });
  }
});

// GET aula por ID com detalhes
app.get('/api/aulas/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT 
        a.id,
        a.titulo,
        a.data_aula,
        a.duracao_minutos,
        a.status,
        a.local,
        a.preco,
        p.id as professor_id,
        p.nome as professor,
        p.email as professor_email,
        p.especialidade,
        al.id as aluno_id,
        al.nome as aluno,
        al.email as aluno_email,
        c.descricao,
        c.materiais,
        c.topicos_abordados,
        c.notas_professor
      FROM aulas a
      JOIN professores p ON a.professor_id = p.id
      LEFT JOIN alunos al ON a.aluno_id = al.id
      LEFT JOIN conteudo_aulas c ON a.id = c.aula_id
      WHERE a.id = ?
    `, [req.params.id]);
    
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Aula não encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar aula' });
  }
});

// GET aulas de um professor
app.get('/api/aulas-professor/:professor_id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT 
        a.id,
        a.titulo,
        a.data_aula,
        a.duracao_minutos,
        a.status,
        a.local,
        a.preco,
        al.nome as aluno
      FROM aulas a
      JOIN professores p ON a.professor_id = p.id
      LEFT JOIN alunos al ON a.aluno_id = al.id
      WHERE a.professor_id = ?
      ORDER BY a.data_aula ASC
    `, [req.params.professor_id]);
    
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar aulas do professor' });
  }
});

// GET aulas de um período (para calendário)
app.get('/api/aulas/periodo/:inicio/:fim', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT 
        a.id,
        a.titulo,
        a.data_aula,
        a.duracao_minutos,
        a.status,
        a.local,
        a.preco,
        p.nome as professor,
        al.nome as aluno
      FROM aulas a
      JOIN professores p ON a.professor_id = p.id
      LEFT JOIN alunos al ON a.aluno_id = al.id
      WHERE DATE(a.data_aula) BETWEEN ? AND ?
      ORDER BY a.data_aula ASC
    `, [req.params.inicio, req.params.fim]);
    
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar aulas do período' });
  }
});

// POST criar nova aula
app.post('/api/aulas', async (req, res) => {
  const { professor_id, aluno_id, titulo, data_aula, duracao_minutos, local, preco } = req.body;
  
  // Validação
  if (!professor_id || !titulo || !data_aula || !duracao_minutos) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }
  
  try {
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      `INSERT INTO aulas 
       (professor_id, aluno_id, titulo, data_aula, duracao_minutos, local, preco, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'agendada')`,
      [professor_id, aluno_id || null, titulo, data_aula, duracao_minutos, local, preco || 0]
    );
    
    connection.release();
    
    res.status(201).json({
      id: result.insertId,
      message: 'Aula criada com sucesso'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar aula' });
  }
});

// PUT atualizar aula
app.put('/api/aulas/:id', async (req, res) => {
  const { titulo, data_aula, duracao_minutos, status, local, preco, aluno_id } = req.body;
  
  try {
    const connection = await pool.getConnection();
    
    await connection.query(
      `UPDATE aulas 
       SET titulo = ?, data_aula = ?, duracao_minutos = ?, status = ?, local = ?, preco = ?, aluno_id = ?
       WHERE id = ?`,
      [titulo, data_aula, duracao_minutos, status, local, preco, aluno_id, req.params.id]
    );
    
    connection.release();
    
    res.json({ message: 'Aula atualizada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar aula' });
  }
});

// DELETE aula
app.delete('/api/aulas/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Deletar conteúdo relacionado
    await connection.query('DELETE FROM conteudo_aulas WHERE aula_id = ?', [req.params.id]);
    
    // Deletar aula
    await connection.query('DELETE FROM aulas WHERE id = ?', [req.params.id]);
    
    connection.release();
    
    res.json({ message: 'Aula deletada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar aula' });
  }
});

// ===== ROTAS DE CONTEÚDO =====

// GET conteúdo de uma aula
app.get('/api/conteudo/:aula_id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM conteudo_aulas WHERE aula_id = ?',
      [req.params.aula_id]
    );
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Conteúdo não encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar conteúdo' });
  }
});

// POST/PUT conteúdo de aula
app.post('/api/conteudo', async (req, res) => {
  const { aula_id, descricao, materiais, topicos_abordados, notas_professor } = req.body;
  
  if (!aula_id || !descricao) {
    return res.status(400).json({ error: 'aula_id e descricao são obrigatórios' });
  }
  
  try {
    const connection = await pool.getConnection();
    
    // Verificar se já existe
    const [existing] = await connection.query(
      'SELECT id FROM conteudo_aulas WHERE aula_id = ?',
      [aula_id]
    );
    
    if (existing.length > 0) {
      // Atualizar
      await connection.query(
        `UPDATE conteudo_aulas 
         SET descricao = ?, materiais = ?, topicos_abordados = ?, notas_professor = ?
         WHERE aula_id = ?`,
        [descricao, materiais, topicos_abordados, notas_professor, aula_id]
      );
    } else {
      // Inserir
      await connection.query(
        `INSERT INTO conteudo_aulas (aula_id, descricao, materiais, topicos_abordados, notas_professor)
         VALUES (?, ?, ?, ?, ?)`,
        [aula_id, descricao, materiais, topicos_abordados, notas_professor]
      );
    }
    
    connection.release();
    res.json({ message: 'Conteúdo salvo com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar conteúdo' });
  }
});

// ===== ROTAS DE ALUNOS =====

// GET todos os alunos
app.get('/api/alunos', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT id, nome, email, telefone FROM alunos ORDER BY nome'
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
});

// POST novo aluno
app.post('/api/alunos', async (req, res) => {
  const { nome, email, telefone } = req.body;
  
  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }
  
  try {
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      'INSERT INTO alunos (nome, email, telefone) VALUES (?, ?, ?)',
      [nome, email, telefone || null]
    );
    
    connection.release();
    
    res.status(201).json({
      id: result.insertId,
      message: 'Aluno criado com sucesso'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar aluno' });
  }
});

// ===== ROTA DE HEALTH CHECK =====

app.get('/api/health', (req, res) => {
  res.json({ status: 'API rodando perfeitamente!' });
});

// ===== INICIAR SERVIDOR =====

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 API de agendamento de aulas ativa`);
});
