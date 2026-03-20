# 🚀 Guia de Deploy em Produção

## Pre-Deploy Checklist

### Segurança
- [ ] Remover console.logs de debug
- [ ] Ativar HTTPS (SSL/TLS)
- [ ] Validar todas as inputs
- [ ] Usar variáveis de ambiente para secrets
- [ ] Configurar CORS corretamente
- [ ] Implementar Rate Limiting
- [ ] Adicionar helmet.js para security headers
- [ ] Usar senhas fortes (DB, JWT)
- [ ] Implementar CSRF protection
- [ ] Criptografar dados sensíveis

### Performance
- [ ] Minificar CSS/JS
- [ ] Comprimir imagens
- [ ] Implementar caching
- [ ] Usar CDN para assets estáticos
- [ ] Otimizar queries do banco
- [ ] Adicionar índices ao banco
- [ ] Implementar lazy loading

### Testes
- [ ] Rodar testes unitários
- [ ] Rodar testes de integração
- [ ] Testar em múltiplos navegadores
- [ ] Testar responsividade
- [ ] Testar performance (Lighthouse)
- [ ] Testar acessibilidade

### Documentação
- [ ] Documentar API (Swagger/OpenAPI)
- [ ] Documentar fluxos principais
- [ ] Documentar variáveis de ambiente
- [ ] Documentar processos de deploy

## Deploy Frontend (Vercel)

### Opção 1: Deploy Automático

1. **Conectar GitHub**
```bash
git push origin main
```

2. **Configurar Vercel**
- Vá para https://vercel.com
- Clique em "New Project"
- Selecione seu repositório
- Configure variáveis de ambiente
- Clique em "Deploy"

### Opção 2: Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Production
vercel --prod
```

### Configurar Variáveis de Ambiente
```bash
# vercel.json
{
  "env": {
    "REACT_APP_API_URL": "https://seu-api.com"
  }
}
```

## Deploy Backend (Heroku)

### Pré-requisitos
- Conta Heroku (https://www.heroku.com)
- Heroku CLI instalado

### Passos

1. **Login**
```bash
heroku login
```

2. **Criar App**
```bash
heroku create seu-app-name
```

3. **Configurar Variáveis de Ambiente**
```bash
heroku config:set DB_HOST=seu-rds-host.amazonaws.com
heroku config:set DB_USER=admin
heroku config:set DB_PASSWORD=sua_senha
heroku config:set DB_NAME=agendamento_aulas
heroku config:set JWT_SECRET=sua_chave_secreta
heroku config:set NODE_ENV=production
```

4. **Deploy**
```bash
git push heroku main
```

5. **Ver Logs**
```bash
heroku logs --tail
```

### Procfile (criar na raiz do backend)
```
web: node server.js
```

### package.json (adicionar start script)
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "16.x"
  }
}
```

## Deploy Banco de Dados (AWS RDS)

### 1. Criar RDS Instance

```bash
# Via AWS Console
1. RDS → Create database
2. Selecione MySQL 5.7 ou 8.0
3. Configure DB instance identifier
4. Set master username/password
5. Configure VPC security
6. Create database
```

### 2. Backup Local

```bash
# Fazer dump do banco local
mysqldump -u root -p agendamento_aulas > backup.sql

# Restaurar no RDS
mysql -h seu-rds-endpoint.amazonaws.com -u admin -p agendamento_aulas < backup.sql
```

### 3. Atualizar .env

```env
DB_HOST=seu-rds-endpoint.amazonaws.com
DB_USER=admin
DB_PASSWORD=sua_senha_forte
DB_NAME=agendamento_aulas
```

## Deploy em VPS (DigitalOcean/AWS EC2)

### 1. Setup Servidor

```bash
# SSH no servidor
ssh root@seu-ip

# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt install -y nodejs

# Instalar MySQL
apt install -y mysql-server

# Instalar Nginx
apt install -y nginx

# Instalar PM2 (process manager)
npm install -g pm2
```

### 2. Clonar Projeto

```bash
# Clone repositório
git clone https://github.com/seu-usuario/agendamento-aulas.git
cd agendamento-aulas/backend

# Instalar dependências
npm install

# Setup banco de dados
mysql -u root -p < ../database.sql
```

### 3. Configurar PM2

```bash
# Iniciar com PM2
pm2 start server.js --name "aulas-api"

# Salvar configuração
pm2 save

# Setup autostart
pm2 startup
```

### 4. Configurar Nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/default

upstream backend {
  server 127.0.0.1:5000;
}

server {
  listen 80;
  server_name seu-dominio.com;

  # Redirecionar HTTP para HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name seu-dominio.com;

  # Certificado SSL (Let's Encrypt)
  ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

  # Rotas da API
  location /api {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Servir frontend
  location / {
    root /var/www/seu-dominio.com;
    try_files $uri $uri/ /index.html;
  }
}
```

### 5. Instalar SSL (Let's Encrypt)

```bash
# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Gerar certificado
certbot certonly --nginx -d seu-dominio.com

# Renovação automática
systemctl enable certbot.timer
```

## Monitoramento em Produção

### PM2 Plus (Monitoramento)

```bash
# Registrar na comunidade PM2
pm2 install pm2-auto-pull

# Monitorar
pm2 monitor
```

### Logs

```bash
# Ver logs do PM2
pm2 logs

# Salvar logs
pm2 logs > app.log

# Usar ferramentas externas
# - CloudWatch (AWS)
# - StackDriver (Google Cloud)
# - LogRocket (Application Monitoring)
```

### Uptime/Health Checks

```javascript
// backend/health-check.js
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime()
  })
})
```

Configurar monitoramento:
```bash
# UptimeRobot: https://uptimerobot.com
# - Add Monitor
- URL: https://seu-api.com/health
- Check interval: 5 minutos
```

## Backup Automático

### Banco de Dados

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +\%Y\%m\%d)
mysqldump -h seu-rds-host.amazonaws.com -u admin -p agendamento_aulas > backup-$DATE.sql
gzip backup-$DATE.sql
aws s3 cp backup-$DATE.sql.gz s3://seu-bucket/backups/

# Cron job (rodar todo dia às 2 da manhã)
# 0 2 * * * /home/user/backup-db.sh
```

### Código

```bash
# Git repository como backup
git remote add backup https://github.com/seu-usuario/agendamento-aulas-backup.git
git push backup main
```

## Performance Optimization para Produção

### Frontend

```bash
# Build otimizado
cd frontend
npm run build

# Verificar tamanho
npm install --save-dev source-map-explorer
source-map-explorer 'build/static/js/*.js'
```

### Backend

```javascript
// Adicionar compressão
const compression = require('compression')
app.use(compression())

// Adicionar caching
const redis = require('redis')
const client = redis.createClient()

app.get('/api/aulas', async (req, res) => {
  // Tenta cache primeiro
  const cached = await client.get('aulas')
  if (cached) return res.json(JSON.parse(cached))
  
  // Buscar do banco
  const aulas = await Aula.findAll()
  
  // Cachear por 1 hora
  await client.setex('aulas', 3600, JSON.stringify(aulas))
  
  res.json(aulas)
})

// Adicionar helmet para segurança
const helmet = require('helmet')
app.use(helmet())

// Rate limiting
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite 100 requisições
})
app.use('/api/', limiter)
```

## Troubleshooting

### API não conecta ao banco

```bash
# Verificar conectividade
mysql -h seu-rds-host.amazonaws.com -u admin -p

# Verificar Security Groups
# - Adicionar porta 3306 para backend IP
```

### Baixa performance

```bash
# Verificar índices
SHOW INDEX FROM aulas;

# Analisar queries lentas
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;
```

### Erros de CORS

```javascript
// Backend
const cors = require('cors')
app.use(cors({
  origin: 'https://seu-frontend.com',
  credentials: true
}))
```

### Certificado SSL expirou

```bash
# Renovar manualmente
certbot renew --force-renewal

# Verificar status
certbot certificates
```

## Checklist Pós-Deploy

- [ ] Testar HTTPS
- [ ] Verificar redirects HTTP→HTTPS
- [ ] Testar API endpoints
- [ ] Verificar logs de erro
- [ ] Testar formulários
- [ ] Verificar emails (se implementado)
- [ ] Testar pagamentos (se implementado)
- [ ] Verificar performance (Lighthouse)
- [ ] Testar em múltiplos navegadores/devices
- [ ] Configurar backups
- [ ] Configurar monitoramento
- [ ] Documentar processo de deploy

## Referências

- Vercel: https://vercel.com/docs
- Heroku: https://devcenter.heroku.com
- AWS RDS: https://docs.aws.amazon.com/rds/
- DigitalOcean: https://docs.digitalocean.com
- Let's Encrypt: https://letsencrypt.org/docs/

---

**Dica**: Sempre teste o deploy em um ambiente staging antes de produção!
