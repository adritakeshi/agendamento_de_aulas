-- Banco de dados para sistema de agendamento de aulas com Node.js
CREATE DATABASE IF NOT EXISTS agendamento_aulas;
USE agendamento_aulas;

-- Tabela de professores
CREATE TABLE IF NOT EXISTS professores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    foto_perfil VARCHAR(255),
    bio TEXT,
    telefone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_especialidade (especialidade),
    INDEX idx_email (email)
);

-- Tabela de alunos
CREATE TABLE IF NOT EXISTS alunos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Tabela de aulas
CREATE TABLE IF NOT EXISTS aulas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    professor_id INT NOT NULL,
    aluno_id INT,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    data_aula DATETIME NOT NULL,
    duracao_minutos INT DEFAULT 60,
    status ENUM('agendada', 'em_progresso', 'concluida', 'cancelada') DEFAULT 'agendada',
    local VARCHAR(200),
    tipo ENUM('presencial', 'online', 'hibrido') DEFAULT 'online',
    preco DECIMAL(10, 2),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE CASCADE,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE SET NULL,
    INDEX idx_data_aula (data_aula),
    INDEX idx_status (status),
    INDEX idx_professor (professor_id),
    INDEX idx_aluno (aluno_id)
);

-- Tabela de conteúdo das aulas
CREATE TABLE IF NOT EXISTS conteudo_aulas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aula_id INT NOT NULL UNIQUE,
    descricao LONGTEXT NOT NULL,
    materiais LONGTEXT,
    topicos_abordados TEXT,
    notas_professor LONGTEXT,
    arquivo_recursos VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aula_id) REFERENCES aulas(id) ON DELETE CASCADE,
    INDEX idx_aula (aula_id)
);

-- Tabela de disponibilidade do professor (para agendamento)
CREATE TABLE IF NOT EXISTS disponibilidade_professor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    professor_id INT NOT NULL,
    dia_semana INT, -- 0-6 (segunda a domingo)
    hora_inicio TIME,
    hora_fim TIME,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE CASCADE,
    INDEX idx_professor (professor_id)
);

-- Tabela de avaliações (opcional)
CREATE TABLE IF NOT EXISTS avaliacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aula_id INT NOT NULL,
    aluno_id INT NOT NULL,
    nota INT CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aula_id) REFERENCES aulas(id) ON DELETE CASCADE,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    INDEX idx_aula (aula_id)
);

-- ===== DADOS DE EXEMPLO =====

-- Inserir professores
INSERT INTO professores (nome, email, especialidade, bio, telefone) VALUES
('Dr. Carlos Silva', 'carlos.silva@email.com', 'Matemática', 'Professor especializado em Geometria e Álgebra com 15 anos de experiência', '11987654321'),
('Dra. Ana Costa', 'ana.costa@email.com', 'Português e Literatura', 'Especialista em preparação para vestibular e análise de obras clássicas', '11987654322'),
('Prof. João Santos', 'joao.santos@email.com', 'Inglês', 'Native speaker com experiência internacional e certificação TOEFL', '11987654323'),
('Profa. Maria Oliveira', 'maria.oliveira@email.com', 'Física', 'Física moderna e clássica, especialista em resolução de problemas', '11987654324');

-- Inserir alunos
INSERT INTO alunos (nome, email, telefone) VALUES
('Lucas Ferreira', 'lucas.ferreira@email.com', '11999999001'),
('Sofia Rocha', 'sofia.rocha@email.com', '11999999002'),
('Pedro Martins', 'pedro.martins@email.com', '11999999003'),
('Julia Santos', 'julia.santos@email.com', '11999999004'),
('Diego Costa', 'diego.costa@email.com', '11999999005');

-- Inserir aulas
INSERT INTO aulas (professor_id, aluno_id, titulo, data_aula, duracao_minutos, status, local, tipo, preco) VALUES
(1, 1, 'Geometria Analítica - Sistemas de Coordenadas', '2024-03-25 14:00:00', 90, 'agendada', 'Sala 101', 'presencial', 150.00),
(1, 2, 'Álgebra Linear - Matrizes e Determinantes', '2024-03-26 10:00:00', 120, 'agendada', 'Online', 'online', 120.00),
(2, 3, 'Análise de Textos Clássicos - Dom Casmurro', '2024-03-27 15:30:00', 120, 'agendada', 'Sala 201', 'presencial', 180.00),
(3, 1, 'Conversação em Inglês - Business English', '2024-03-28 18:00:00', 60, 'agendada', 'Online', 'online', 100.00),
(4, 4, 'Física Quântica - Introdução', '2024-03-29 16:00:00', 90, 'agendada', 'Sala 301', 'hibrido', 160.00),
(1, 5, 'Trigonometria Avançada', '2024-03-30 11:00:00', 60, 'agendada', 'Online', 'online', 120.00),
(2, 1, 'Redação para Vestibular', '2024-04-01 14:00:00', 90, 'agendada', 'Sala 201', 'presencial', 140.00),
(3, 2, 'Preparation for IELTS', '2024-04-02 19:00:00', 120, 'agendada', 'Online', 'online', 150.00);

-- Inserir conteúdo das aulas
INSERT INTO conteudo_aulas (aula_id, descricao, materiais, topicos_abordados, notas_professor) VALUES
(1, 'Aula completa sobre sistemas de coordenadas cartesianas. Aprenderemos a identificar pontos no plano, calcular distâncias entre pontos, encontrar o ponto médio e entender a relação entre coordenadas e gráficos. Resolveremos exercícios práticos e estudos de caso.', 'Livro: Geometria Analítica de Boulos e Camargo\nVídeos: Khan Academy - Coordinate Geometry\nLista de exercícios resolvidos (10 páginas)', 'Plano Cartesiano, Distância entre Pontos, Ponto Médio, Equação da Reta, Coeficiente Angular', 'Aluno mostrou excelente compreensão. Recomendo aprofundar em aplicações práticas.'),

(2, 'Introdução completa a matrizes e sistemas lineares. Estudaremos operações com matrizes (adição, multiplicação), cálculo de determinantes, inversão de matrizes e métodos de resolução de sistemas. Aplicações práticas em engenharia e economia.', 'Material em PDF com 25 páginas\nLista de 50 exercícios com gabarito\nSimulador online para operações com matrizes', 'Matrizes Quadradas, Determinantes, Sistemas Lineares, Método de Gauss, Inversão de Matrizes', 'Concentre-se em multiplicação de matrizes. Pratique mais exercícios de sistemas 3x3.'),

(3, 'Análise profunda de Dom Casmurro de Machado de Assis. Estudaremos o contexto histórico do Brasil no século XIX, análise de personagens principais (Bentinho, Capitu, Dom Casmurro), figuras de linguagem e tema central da obra. Debate crítico sobre a culpabilidade de Capitu.', 'Livro: Dom Casmurro - edição completa\nGuia de análise crítica (15 páginas)\nVídeos: análise da obra no YouTube\nCartas de Machado de Assis ao editor', 'Literatura Brasileira, Análise de Personagens, Contexto Histórico, Figuras de Linguagem, Themes e Motivos', 'Excelente participação. Prepare argumentos para debate sobre a traição de Capitu.'),

(4, 'Conversação natural em inglês focando em situações de negócios. Trabalharemos pronúncia, vocabulário corporativo, apresentações profissionais, negociações e correspondência formal. Simularemos reuniões de negócios reais.', 'Áudio em inglês com sotaque americano\nVocabulário temático de negócios (200 palavras)\nTemplate de emails corporativos\nVídeos de TED Talks sobre liderança', 'Pronúncia, Business Vocabulary, Presentations, Negotiations, Professional Etiquette', 'Pronúncia está melhorando. Continue praticando "th" sounds. Muito bom!'),

(5, 'Introdução à Física Quântica. Entenderemos os princípios fundamentais que diferem a física quântica da clássica. Estudaremos o modelo atômico de Bohr, equação de Schrödinger, dualidade onda-partícula e o princípio da incerteza de Heisenberg.', 'Livro: Introduction to Quantum Mechanics - Griffiths\nVídeos: PBS Space Time\nArtigos científicos selecionados\nSimulador de átomos', 'Modelo de Bohr, Equação de Schrödinger, Dualidade Onda-Partícula, Princípio da Incerteza', 'Conceitos abstratos. Recomendo rever a matemática de ondas antes da próxima aula.'),

(6, 'Trigonometria avançada incluindo identidades, equações trigonométricas, aplicações em geometria e problemas de otimização. Trabalharemos com funções trigonométricas complexas e suas derivadas.', 'Livro: Trigonometria Avançada\nLista com 40 exercícios\nCalculadora gráfica online\nVídeos explicativos', 'Identidades Trigonométricas, Equações, Funções Trigonométricas, Aplicações', 'Muito bom progresso. Continue praticando identidades.'),

(7, 'Técnicas essenciais para redação de alta qualidade em avaliações como ENEM e vestibulares. Estudaremos estrutura de dissertação argumentativa, coerência, coesão, uso correto de conectivos e argumentação lógica. Análise de redações modelo com nota máxima.', 'Coletânea de redações nota 1000\nGuia completo de estrutura\nGabito comentado de 20 redações\nExercícios práticos diários', 'Estrutura de Dissertação, Argumentação, Coerência, Coesão, Conectivos, Pontuação', 'Excelente introdução. Trabalhe mais na conclusão e use mais conectivos variados.'),

(8, 'Preparação completa para exame IELTS. Estudaremos todas as seções: Listening, Reading, Writing e Speaking. Praticaremos técnicas de gestão de tempo, estratégias de resposta e revisão de gramática avançada. Simulados completos e feedback personalizado.', 'Livro oficial IELTS Preparation\nBanco de 200 questões anteriores\nVídeos com dicas de especialistas\nMaterial de leitura autêntico (artigos, notícias)', 'IELTS Skills, Time Management, Advanced Grammar, Vocabulary, Speaking Fluency', 'Pronúncia e fluência excelentes. Foque em Writing Task 1 e estrutura de essays.');

-- Inserir disponibilidades
INSERT INTO disponibilidade_professor (professor_id, dia_semana, hora_inicio, hora_fim, ativo) VALUES
(1, 1, '09:00:00', '12:00:00', TRUE),
(1, 1, '14:00:00', '18:00:00', TRUE),
(1, 2, '09:00:00', '12:00:00', TRUE),
(1, 2, '14:00:00', '18:00:00', TRUE),
(1, 3, '09:00:00', '12:00:00', TRUE),
(1, 3, '14:00:00', '18:00:00', TRUE),
(1, 4, '09:00:00', '12:00:00', TRUE),
(1, 5, '09:00:00', '12:00:00', TRUE),

(2, 1, '14:00:00', '19:00:00', TRUE),
(2, 2, '14:00:00', '19:00:00', TRUE),
(2, 3, '14:00:00', '19:00:00', TRUE),
(2, 4, '09:00:00', '12:00:00', TRUE),
(2, 5, '14:00:00', '19:00:00', TRUE),

(3, 0, '15:00:00', '20:00:00', TRUE),
(3, 2, '15:00:00', '20:00:00', TRUE),
(3, 4, '15:00:00', '20:00:00', TRUE),
(3, 5, '15:00:00', '20:00:00', TRUE),

(4, 1, '10:00:00', '13:00:00', TRUE),
(4, 1, '16:00:00', '19:00:00', TRUE),
(4, 3, '10:00:00', '13:00:00', TRUE),
(4, 4, '16:00:00', '19:00:00', TRUE);
