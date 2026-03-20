
# 🚀 Guia de Instalação - Sistema de Agendamento de Aulas

## Estrutura do Projeto

```
agendamento-aulas/
├── backend/                    # API Node.js/Express
│   ├── server.js              # Servidor principal
│   ├── package.json           # Dependências do backend
│   ├── .env                   # Variáveis de ambiente
│   └── database.sql           # Script do banco de dados
│
├── frontend/                  # Aplicação React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── App.jsx           # Componente principal
│   │   ├── App.css           # Estilos principais
│   │   └── index.jsx         # Entry point
│   ├── public/
│   │   └── index.html        # HTML público
│   └── package.json          # Dependências do frontend
```

## ⚙️ Pré-requisitos

- Node.js 16+ (https://nodejs.org/)
- MySQL 5.7+ (https://dev.mysql.com/downloads/mysql/)
- Git (opcional)

## 📋 Passo 1: Preparar o Banco de Dados

### Opção A: Via linha de comando

```bash
# Abra o MySQL
mysql -u root -p

# Cole o conteúdo do arquivo backend/database.sql
# Ou execute:
mysql -u root -p < backend/database.sql
```

### Opção B: Via phpMyAdmin

1. Abra http://localhost/phpmyadmin
2. Clique em **Novo**
3. Digite: `agendamento_aulas`
4. Clique em **Criar**
5. Selecione a base criada
6. Clique na aba **SQL**
7. Cole o conteúdo de `backend/database.sql`
8. Clique **Executar**

## 🛠️ Passo 2: Instalar e Rodar o Backend

### 2.1 Entrar na pasta do backend

```bash
cd backend
```

### 2.2 Instalar dependências

```bash
npm install
```

### 2.3 Configurar variáveis de ambiente

Edite o arquivo `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=        # Deixe vazio se não tem senha
DB_NAME=agendamento_aulas
PORT=5000
```

Se você configurou uma senha para o MySQL:
```env
DB_PASSWORD=sua_senha_aqui
```

### 2.4 Rodar o servidor

```bash
npm start

# Ou usar nodemon para desenvolvimento (auto-reload):
npm install -g nodemon
npm run dev
```

Você verá:
```
🚀 Servidor rodando em http://localhost:5000
📚 API de agendamento de aulas ativa
```

Teste a API: http://localhost:5000/api/health

## 🎨 Passo 3: Instalar e Rodar o Frontend

### 3.1 Abrir novo terminal e entrar na pasta frontend

```bash
cd frontend
```

### 3.2 Instalar dependências

```bash
npm install

# Isso pode levar alguns minutos na primeira vez
```

### 3.3 Rodar o servidor de desenvolvimento

```bash
npm start
```

Seu navegador abrirá automaticamente em:
```
http://localhost:3000
```

## ✅ Verificação Final

Se tudo funcionou corretamente:

✅ Backend rodando em http://localhost:5000
✅ Frontend rodando em http://localhost:3000
✅ Banco de dados MySQL ativo
✅ 8 aulas de exemplo no calendário
✅ Calendário interativo funcionando
✅ Modal abrindo ao clicar em aulas

## 🐛 Troubleshooting

### ❌ "Cannot find module express"

**Solução:**
```bash
cd backend
npm install
```

### ❌ "Erro na conexão: Connection refused"

**Solução:**
1. Verifique se MySQL está rodando
2. Verifique credenciais em `backend/.env`
3. Certifique-se que o banco `agendamento_aulas` foi criado

Teste a conexão:
```bash
mysql -u root -p
SHOW DATABASES;
USE agendamento_aulas;
SHOW TABLES;
```

### ❌ "Cannot find module moment"

**Solução:**
```bash
cd frontend
npm install
```

### ❌ "The default export is not defined" (react-big-calendar)

**Solução:** Já está resolvido no código, mas se aparecer:
```bash
npm install moment --save
```

### ❌ "Port 3000 is already in use"

**Solução:**
```bash
# Use outra porta
PORT=3001 npm start

# Ou mate o processo na porta 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### ❌ "Port 5000 is already in use"

**Solução:**
```bash
# Edite backend/.env:
PORT=5001

# E edite frontend/package.json:
# Mude a linha: "proxy": "http://localhost:5001"
```

### ❌ "CORS error"

**Solução:** Adicione seu domínio em `backend/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'seu-dominio.com']
}));
```

## 📱 Recursos da Aplicação

### 📅 Calendário Interativo
- Visualize aulas por mês, semana, dia ou agenda
- Cores diferentes por status
- Clique em qualquer aula para ver detalhes

### 📋 Lista de Aulas
- Visualize todas as aulas em formato de cards
- Filtrar por especialidade do professor
- Busca rápida

### ➕ Criar Nova Aula
- Escolha professor, aluno, data/hora
- Defina duração, local e preço
- Validação de formulário em tempo real

### 👁️ Detalhes da Aula
- Visualize conteúdo completo
- Tópicos abordados
- Materiais de apoio
- Notas do professor
- Confirme aluno na aula

## 🔗 API Endpoints

### Aulas
- `GET /api/aulas` - Obter todas as aulas
- `GET /api/aulas/:id` - Obter aula por ID
- `GET /api/aulas/periodo/:inicio/:fim` - Aulas em um período
- `POST /api/aulas` - Criar nova aula
- `PUT /api/aulas/:id` - Atualizar aula
- `DELETE /api/aulas/:id` - Deletar aula

### Professores
- `GET /api/professores` - Obter todos
- `GET /api/professores/:id` - Obter por ID

### Alunos
- `GET /api/alunos` - Obter todos
- `POST /api/alunos` - Criar novo

### Conteúdo
- `GET /api/conteudo/:aula_id` - Obter conteúdo
- `POST /api/conteudo` - Criar/atualizar conteúdo

## 🚀 Deploy em Produção

### Construir o frontend

```bash
cd frontend
npm run build

# Será criada pasta 'build' pronta para produção
```

### Deploy do Backend

```bash
# Em um servidor (Heroku, DigitalOcean, etc):
npm install
npm start
```

## 📚 Documentação Adicional

- React: https://react.dev
- React Big Calendar: https://jquense.github.io/react-big-calendar/
- Express: https://expressjs.com
- MySQL: https://dev.mysql.com/doc/

## 💡 Dicas

1. **Desenvolvimento**: Use `npm run dev` no backend para auto-reload com nodemon
2. **Banco de Dados**: Adicione mais professores, alunos e aulas conforme necessário
3. **Customização**: Altere cores em `src/App.css` (variáveis CSS)
4. **Autenticação**: Veja comentários no código para adicionar JWT

## 📞 Suporte

Se tiver problemas:

1. Verifique console do navegador (F12)
2. Verifique logs do servidor backend (terminal)
3. Verifique se MySQL está rodando
4. Verifique credenciais no arquivo `.env`

## 🎉 Pronto!

Agora você tem um **sistema completo de agendamento de aulas** com:
- ✅ React moderno no frontend
- ✅ Node.js/Express no backend
- ✅ MySQL para persistência
- ✅ Calendário interativo
- ✅ Interface elegante e responsiva
- ✅ Dados de exemplo prontos

Bom uso! 🚀
