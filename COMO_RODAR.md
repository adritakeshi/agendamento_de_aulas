# 🚀 Como Rodar o Sistema - Guia Prático

## Opção 1: Com XAMPP (Mais Fácil) ⭐

### 1️⃣ Instalar XAMPP

**Windows/Mac/Linux:**
1. Baixe em: https://www.apachefriends.org/
2. Execute o instalador
3. Instale na pasta padrão

### 2️⃣ Iniciar XAMPP

**Windows:**
- Abra `XAMPP Control Panel`
- Clique em **Start** para:
  - Apache
  - MySQL

**Mac/Linux:**
```bash
sudo /Applications/XAMPP/xamppfiles/bin/xampp start
# ou
sudo /opt/lampp/lampp start
```

Verifique em http://localhost - deve mostrar página do XAMPP

### 3️⃣ Criar a Pasta do Projeto

**Windows:**
```
C:\xampp\htdocs\agendamento_aulas\
```

**Mac:**
```
/Applications/XAMPP/xamppfiles/htdocs/agendamento_aulas/
```

**Linux:**
```
/opt/lampp/htdocs/agendamento_aulas/
```

### 4️⃣ Copiar os Arquivos

Coloque estes arquivos na pasta acima:
```
- index.html
- api.php
- agendamento_aulas.sql
```

### 5️⃣ Criar o Banco de Dados

**Opção A: Via phpMyAdmin (Mais Visual)**

1. Abra http://localhost/phpmyadmin
2. Clique em **Novo** (lado esquerdo)
3. Digite: `agendamento_aulas`
4. Clique **Criar**
5. Selecione a base criada
6. Clique na aba **SQL**
7. Copie todo conteúdo de `agendamento_aulas.sql`
8. Cole no phpMyAdmin
9. Clique **Executar**

**Opção B: Via Linha de Comando**

```bash
# Entre na pasta do XAMPP
cd C:\xampp\mysql\bin  # Windows
# ou
cd /Applications/XAMPP/xamppfiles/bin  # Mac
# ou
cd /opt/lampp/bin  # Linux

# Execute:
mysql -u root -p < C:\caminho\para\agendamento_aulas.sql
# Pressione Enter (sem senha por padrão)
```

### 6️⃣ Acessar o Sistema

Abra seu navegador e acesse:

```
http://localhost/agendamento_aulas/
```

✅ **Pronto! O sistema está rodando!**

---

## Opção 2: Com Docker (Profissional) 🐳

### 1️⃣ Instalar Docker

Baixe em: https://www.docker.com/products/docker-desktop

### 2️⃣ Criar arquivo `docker-compose.yml`

Na pasta do projeto, crie este arquivo:

```yaml
version: '3'

services:
  web:
    image: php:8.1-apache
    ports:
      - "80:80"
    volumes:
      - .:/var/www/html
    environment:
      PHP_DISPLAY_ERRORS: 1
    depends_on:
      - db

  db:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: agendamento_aulas
    volumes:
      - ./agendamento_aulas.sql:/docker-entrypoint-initdb.d/init.sql
```

### 3️⃣ Rodar o Docker

```bash
# Na pasta do projeto
docker-compose up -d

# Aguarde alguns segundos e acesse:
# http://localhost
```

### 4️⃣ Parar o Docker

```bash
docker-compose down
```

---

## Opção 3: Usar PHP Built-in (Mais Rápido) ⚡

Se tem **PHP 7.4+** instalado no computador:

### 1️⃣ Instalar MySQL Separadamente

**Windows:**
- Baixe em: https://dev.mysql.com/downloads/mysql/
- Siga o instalador

**Mac:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo service mysql start
```

### 2️⃣ Criar o Banco

```bash
mysql -u root -p < agendamento_aulas.sql
```

### 3️⃣ Rodar o Servidor PHP

Na pasta do projeto:

```bash
# Inicie o servidor built-in do PHP
php -S localhost:8000

# Você verá algo como:
# [Mon Mar 20 10:00:00 2024] PHP 8.1.0 Development Server started at http://localhost:8000
```

### 4️⃣ Acessar

Abra seu navegador:

```
http://localhost:8000
```

---

## ⚠️ Problemas Comuns e Soluções

### ❌ "Erro na conexão: Connection refused"

**Solução:**
```php
// Verifique em api.php (linhas 11-14):
$db_host = 'localhost';
$db_user = 'root';
$db_password = '';  // Deixe vazio se não tem senha
$db_name = 'agendamento_aulas';
```

Se tiver senha MySQL:
```php
$db_password = 'sua_senha_aqui';
```

### ❌ "Banco de dados não encontrado"

**Solução:**

1. Abra phpMyAdmin: http://localhost/phpmyadmin
2. Verifique se o banco `agendamento_aulas` existe
3. Se não existir, crie executando o SQL novamente

### ❌ "Arquivo não encontrado / 404"

**Solução:**

1. Certifique-se que `index.html` está na pasta correta
2. Verifique se a URL está correta:
   - Com XAMPP: `http://localhost/agendamento_aulas/`
   - Com PHP built-in: `http://localhost:8000/`

### ❌ "API retorna erro"

**Solução:**

1. Abra o console do navegador (F12)
2. Veja qual erro aparece
3. Verifique se `api.php` está na mesma pasta que `index.html`

### ❌ MySQL não inicia

**XAMPP:**
- Clique em "Config" → "my.ini"
- Procure por conflito de portas
- Mude a porta se necessário

**Linha de comando:**
```bash
# Verifique se está rodando
mysql --version

# Reinicie o serviço
sudo service mysql restart  # Linux
# ou
brew services restart mysql  # Mac
```

---

## 🔧 Comandos Úteis

### Ver se MySQL está rodando

```bash
# Linux/Mac
ps aux | grep mysql

# Windows (Command Prompt)
netstat -ano | findstr :3306
```

### Resetar MySQL

```bash
# Linux
sudo mysql -u root -p
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
exit;

# Mac (com Homebrew)
brew services restart mysql
```

### Resetar o Banco de Dados

```bash
mysql -u root -p agendamento_aulas < agendamento_aulas.sql
```

---

## 📱 Testar os Dados

Após rodar, você deve ver:

✅ 4 aulas no sistema
✅ 3 professores cadastrados
✅ Cards bonitos e responsivos
✅ Modal funcional ao clicar

**Clique em qualquer aula para ver a modal!**

---

## 🎯 Checklist de Verificação

- [ ] XAMPP/Docker/PHP instalado
- [ ] Apache rodando
- [ ] MySQL rodando
- [ ] Banco de dados criado
- [ ] Arquivos na pasta correta
- [ ] index.html abrindo no navegador
- [ ] Aulas carregando
- [ ] Modal abrindo ao clicar

---

## 📞 Dúvidas?

**Como saber se tudo está funcionando:**

1. Abra http://localhost/agendamento_aulas/
2. Se ver a página com cards coloridos ✅
3. Clique em um card
4. Se abrir a modal ✅
5. **Pronto! Está funcionando!**

---

## 🚀 Próximos Passos

Depois de rodar, você pode:

1. **Adicionar mais aulas** via SQL
2. **Customizar cores** no CSS
3. **Adicionar autenticação** (veja SETUP.md)
4. **Fazer deploy** em um servidor

---

Bom uso! 🎓
