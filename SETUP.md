# 🚀 Guia de Configuração e Melhorias

## ⚡ Quick Start (Início Rápido)

### Passo 1: Preparar o Banco de Dados
```bash
# Abra um terminal e acesse o MySQL
mysql -u root -p

# Cole o conteúdo do agendamento_aulas.sql
# Ou execute:
mysql -u root -p < agendamento_aulas.sql
```

### Passo 2: Copiar Arquivos
```bash
# Para Apache (htdocs)
cp *.html /var/www/html/agendamento_aulas/
cp *.php /var/www/html/agendamento_aulas/

# Para Nginx ou outro servidor, copie para a pasta raiz do seu projeto
```

### Passo 3: Acessar a Aplicação
```
http://localhost/agendamento_aulas/
```

## 📁 Estrutura de Arquivos Recomendada

```
agendamento_aulas/
├── index.html              # Interface principal
├── api.php                 # API backend
├── config.php              # Configurações (opcional)
├── agendamento_aulas.sql   # Script do banco
├── README.md               # Documentação
├── logs/                   # Pasta para logs (criar manualmente)
├── uploads/                # Pasta para arquivos (criar manualmente)
└── admin/                  # Painel administrativo (criar depois)
    ├── dashboard.html
    ├── gerenciar-aulas.php
    └── ...
```

## 🔐 Melhorias de Segurança

### 1. Adicionar Autenticação

```php
// exemplo em api.php
session_start();

function verificarAutenticacao() {
    if (!isset($_SESSION['usuario_id'])) {
        respondJSON(['error' => 'Não autenticado'], 401);
    }
}

// Usar antes de cada ação sensível
case 'criar-aula':
    verificarAutenticacao();
    criarAula($_POST ?? []);
    break;
```

### 2. Validar entrada com sanitização

```php
function sanitizarEntrada($dado) {
    return htmlspecialchars($dado, ENT_QUOTES, 'UTF-8');
}

function validarEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validarData($data) {
    $formato = 'Y-m-d H:i:s';
    $d = DateTime::createFromFormat($formato, $data);
    return $d && $d->format($formato) === $data;
}
```

### 3. Usar variáveis de ambiente

```php
// Criar arquivo .env na raiz
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=agendamento_aulas

// Em config.php
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $env = parse_ini_file($envFile);
    define('DB_PASSWORD', $env['DB_PASSWORD']);
}

// Nota: Nunca commite .env no Git!
```

## 🎯 Features para Adicionar

### 1. Dashboard do Professor

```html
<!-- admin/professor-dashboard.html -->
<h1>Minhas Aulas</h1>
<div class="aulas-list">
    <!-- Lista de aulas do professor -->
</div>
<button onclick="criarNovaAula()">Nova Aula</button>
```

### 2. Painel de Administração

```php
// admin/api.php
case 'admin-aulas':
    verificarAutenticacao();
    verificarPermissao('admin');
    getTodasAulas();
    break;

case 'deletar-aula':
    verificarAutenticacao();
    verificarPermissao('admin');
    deletarAula($_GET['id'] ?? 0);
    break;
```

### 3. Sistema de Notificações

```php
// Enviar email quando aula é agendada
function enviarEmailNotificacao($aula) {
    $para = $aula['professor_email'];
    $assunto = "Nova aula agendada: " . $aula['titulo'];
    $mensagem = "Uma nova aula foi agendada para " . $aula['data_aula'];
    
    mail($para, $assunto, $mensagem);
}
```

### 4. Sistema de Pagamento

```php
// Integrar com Stripe, PayPal, etc
case 'processar-pagamento':
    verificarAutenticacao();
    processarPagamento($_POST);
    break;

function processarPagamento($dados) {
    // Implementar lógica de pagamento
}
```

### 5. Avaliações e Comentários

```sql
-- Tabela de avaliações
CREATE TABLE avaliacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aula_id INT NOT NULL,
    aluno_id INT NOT NULL,
    nota INT,
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aula_id) REFERENCES aulas(id),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);
```

## 🎨 Customizações de Estilo

### Alterar Paleta de Cores

No arquivo `index.html`, altere as variáveis CSS:

```css
:root {
    --primary: #0f172a;        /* Azul escuro → mude para sua cor */
    --secondary: #4f46e5;      /* Índigo → mude para sua cor */
    --accent: #10b981;         /* Verde → mude para sua cor */
    --accent-light: #d4fc79;   /* Amarelo claro → mude para sua cor */
}
```

### Adicionar Logo

```html
<!-- No header do index.html -->
<header>
    <img src="logo.png" alt="Logo" style="height: 50px; margin-bottom: 1rem;">
    <h1>📚 Aulas Particulares</h1>
    <!-- ... resto do header -->
</header>
```

### Modo Dark

```css
/* Adicionar no index.html -->
@media (prefers-color-scheme: dark) {
    :root {
        --bg: #0f172a;
        --card-bg: #1e293b;
        --text: #f1f5f9;
        --text-light: #cbd5e1;
    }
}
```

## 📱 Otimizações

### 1. Lazy Loading de Imagens
```html
<img src="professor.jpg" loading="lazy" alt="Professor">
```

### 2. Caching do Banco de Dados
```php
// Armazenar resultados em cache
$cacheKey = 'aulas_lista';
$cached = apcu_fetch($cacheKey);

if ($cached === false) {
    $cached = $conn->query($query)->fetch_all();
    apcu_store($cacheKey, $cached, 3600); // 1 hora
}
```

### 3. Compressão de Resposta
```php
// No topo da api.php
if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip')) {
    ob_start('ob_gzhandler');
}
```

## 🧪 Testes

### Teste Manual de API

```bash
# Obter todas as aulas
curl "http://localhost/agendamento_aulas/api.php?action=aulas"

# Obter aula específica
curl "http://localhost/agendamento_aulas/api.php?action=aula-detalhe&id=1"

# Criar nova aula (POST)
curl -X POST "http://localhost/agendamento_aulas/api.php?action=criar-aula" \
  -d "professor_id=1&titulo=Nova Aula&data_aula=2024-04-10 14:00:00&duracao_minutos=60"
```

### Usando Postman/Insomnia

1. Importe os endpoints da API
2. Configure variáveis de ambiente
3. Execute testes automatizados

## 📊 Melhorias de Performance

1. **Índices no Banco**: Já adicionados em data_aula e status
2. **Paginação**: Adicionar LIMIT nas queries
3. **Busca Full-Text**: Usar FULLTEXT indexes para buscas
4. **CDN**: Hospedar CSS/JS em CDN para distribuição global

## 🚢 Deploy em Produção

### 1. Preparar ambiente
```bash
# Atualizar credenciais no config.php
# Ativar HTTPS
# Desativar debug mode
# Configurar backups automáticos
```

### 2. Fazer deploy
```bash
# Via FTP/SFTP ou Git
git clone seu-repositorio produção/
cd produção/
composer install  # se tiver dependências
php artisan migrate  # se usar framework
```

### 3. Configurar segurança
```php
// config.php em produção
define('APP_DEBUG', false);
define('FORCE_HTTPS', true);
// Configurar CORS apropriadamente
```

## 📚 Referências

- [PHP Security](https://www.php.net/manual/en/security.php)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MySQL Best Practices](https://dev.mysql.com/doc/mysql-getting-started/en/)

## 💡 Dicas Extras

1. **Use Git**: Controle de versão é essencial
2. **Documente o código**: Facilita manutenção futura
3. **Faça backups regulares**: Proteja seus dados
4. **Monitore erros**: Use serviços como Sentry
5. **Teste periodicamente**: Automatize testes

---

Desenvolvido com ❤️ para você!
