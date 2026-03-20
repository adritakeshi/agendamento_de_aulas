# 📚 Sistema de Agendamento de Aulas Particulares

Um sistema moderno e elegante para agendamento de aulas particulares com PHP puro e MySQL.

## ✨ Características

- ✅ Interface moderna e responsiva
- ✅ Agendamento de aulas com detalhes
- ✅ Modal interativo para visualizar conteúdo das aulas
- ✅ Filtros de busca e status
- ✅ Design elegante com animações suaves
- ✅ Compatível com PHP puro e MySQL
- ✅ Sem dependências externas (apenas HTML/CSS/JS)

## 📋 Requisitos

- PHP 7.0 ou superior
- MySQL 5.7 ou superior
- Servidor web (Apache, Nginx, etc.)

## 🚀 Instalação

### 1. **Criar o Banco de Dados**

```bash
# Acesse o MySQL
mysql -u root -p

# Copie o conteúdo do arquivo agendamento_aulas.sql
# Execute o SQL para criar o banco de dados e as tabelas
```

Ou usando a linha de comando:

```bash
mysql -u root -p < agendamento_aulas.sql
```

### 2. **Configurar os Arquivos**

1. Copie os arquivos para o diretório do seu servidor web:
   - `index.html` - Interface frontend
   - `api.php` - API backend

2. Certifique-se de que os arquivos estão no mesmo diretório

### 3. **Configurar Conexão com Banco de Dados**

No arquivo `api.php`, ajuste as credenciais do banco de dados se necessário:

```php
$db_host = 'localhost';      // Host do MySQL
$db_user = 'root';           // Usuário do MySQL
$db_password = '';           // Senha do MySQL
$db_name = 'agendamento_aulas'; // Nome do banco
```

### 4. **Acessar o Sistema**

Abra seu navegador e acesse:

```
http://localhost/agendamento_aulas/index.html
```

ou

```
http://seu-dominio.com/agendamento_aulas/
```

## 📖 Uso

### Visualizando Aulas

1. A página inicial exibe todas as aulas agendadas em cards elegantes
2. Cada card mostra:
   - Título da aula
   - Nome do professor
   - Data e hora
   - Duração
   - Local
   - Nome do aluno
   - Preço

### Filtrar Aulas

Use os filtros disponíveis no topo da página:
- **Buscar**: Pesquise por título ou nome do professor
- **Status**: Filtre por status da aula (Agendada, Concluída)

### Visualizar Detalhes

1. Clique no card de qualquer aula
2. Uma modal elegante abrirá com informações completas:
   - Informações gerais (data, duração, local, preço)
   - Descrição completa do conteúdo
   - Tópicos abordados
   - Materiais de apoio
   - Notas do professor

## 🗄️ Estrutura do Banco de Dados

### Tabela: `professores`
- `id` - ID único
- `nome` - Nome do professor
- `email` - Email
- `especialidade` - Área de especialização
- `foto_perfil` - URL da foto
- `bio` - Biografia

### Tabela: `alunos`
- `id` - ID único
- `nome` - Nome do aluno
- `email` - Email
- `telefone` - Telefone de contato

### Tabela: `aulas`
- `id` - ID único
- `professor_id` - ID do professor (FK)
- `aluno_id` - ID do aluno (FK)
- `titulo` - Título da aula
- `data_aula` - Data e hora da aula
- `duracao_minutos` - Duração em minutos
- `status` - Status (agendada, concluida, cancelada)
- `local` - Local (presencial ou online)
- `preco` - Preço da aula

### Tabela: `conteudo_aulas`
- `id` - ID único
- `aula_id` - ID da aula (FK)
- `descricao` - Descrição detalhada do conteúdo
- `materiais` - Materiais de apoio
- `topicos_abordados` - Tópicos em formato CSV
- `notas_professor` - Notas adicionais

## 🔌 API Endpoints

### `GET api.php?action=aulas`
Retorna todas as aulas agendadas com informações resumidas.

**Resposta:**
```json
[
  {
    "id": 1,
    "titulo": "Geometria Analítica",
    "professor": "Carlos Silva",
    "data_aula": "2024-03-25 14:00:00",
    "duracao_minutos": 90,
    "status": "agendada",
    "preco": "100.00"
  }
]
```

### `GET api.php?action=aula-detalhe&id=1`
Retorna detalhes completos de uma aula específica.

**Resposta:**
```json
{
  "id": 1,
  "titulo": "Geometria Analítica",
  "professor": "Carlos Silva",
  "data_aula": "2024-03-25 14:00:00",
  "descricao": "Aula sobre sistemas de coordenadas...",
  "materiais": "Livro: Geometria Analítica...",
  "topicos_abordados": "Plano cartesiano, Distância entre pontos..."
}
```

### `GET api.php?action=aulas-professor&professor_id=1`
Retorna todas as aulas de um professor específico.

### `POST api.php?action=criar-aula`
Cria uma nova aula.

**Parâmetros:**
- `professor_id` - ID do professor (obrigatório)
- `titulo` - Título da aula (obrigatório)
- `data_aula` - Data e hora (obrigatório, formato: YYYY-MM-DD HH:MM:SS)
- `duracao_minutos` - Duração em minutos (obrigatório)
- `local` - Local da aula (padrão: Online)
- `preco` - Preço da aula (padrão: 0)

### `POST api.php?action=atualizar-conteudo`
Atualiza o conteúdo de uma aula.

**Parâmetros:**
- `aula_id` - ID da aula (obrigatório)
- `descricao` - Descrição do conteúdo (obrigatório)
- `materiais` - Materiais de apoio
- `topicos_abordados` - Tópicos em formato CSV
- `notas_professor` - Notas do professor

## 🎨 Personalização

### Cores

As cores podem ser alteradas no arquivo `index.html` na seção `:root` do CSS:

```css
:root {
    --primary: #0f172a;        /* Cor principal (azul escuro) */
    --secondary: #4f46e5;      /* Cor secundária (índigo) */
    --accent: #10b981;         /* Cor de destaque (verde) */
    --accent-light: #d4fc79;   /* Cor de destaque clara (amarelo) */
    /* ... mais cores */
}
```

### Tipografia

As fontes utilizadas são do Google Fonts:
- **Display**: Playfair Display (títulos elegantes)
- **Body**: Sora (texto geral)

Para alterar, edite a importação de fontes no `<head>` do HTML.

## 🔒 Segurança

- Use prepared statements (já implementado)
- Valide e higienize todas as entradas do usuário
- Configure permissões apropriadas no banco de dados
- Use HTTPS em produção
- Implemente autenticação antes de publicar

## 📝 Adicionar Novas Aulas

Para adicionar aulas via interface administrativa, você pode:

1. Executar queries SQL diretamente
2. Criar um painel de administração (recomendado)
3. Usar a API POST endpoints

Exemplo SQL:
```sql
INSERT INTO aulas (professor_id, aluno_id, titulo, data_aula, duracao_minutos, local, preco)
VALUES (1, 2, 'Nova Aula', '2024-04-10 14:00:00', 60, 'Online', 100.00);
```

## 🐛 Troubleshooting

### Erro: "Erro na conexão"
- Verifique se MySQL está rodando
- Confirme as credenciais em `api.php`
- Verifique se o banco `agendamento_aulas` existe

### Erro: "Rota não encontrada"
- Certifique-se que `api.php` e `index.html` estão no mesmo diretório
- Verifique a URL da API no JavaScript

### Aulas não aparecem
- Verifique se os dados foram inseridos corretamente no banco
- Abra o console do navegador para ver erros
- Verifique as permissions do banco de dados

## 🎯 Arquitetura

```
┌─────────────┐         ┌──────────────┐         ┌──────────┐
│   React     │         │  Node.js     │         │  MySQL   │
│  Frontend   │◄──────► │   Express    │◄──────► │ Database │
│             │  HTTP   │    Backend   │  SQL    │          │
└─────────────┘         └──────────────┘         └──────────┘
   Port 3000              Port 5000
```

## 🔄 Fluxo de Dados

1. **Frontend** → Usuário interage com calendário/formulário
2. **API Call** → React chama serviço de API
3. **Backend** → Express recebe e valida requisição
4. **Database** → MySQL armazena/recupera dados
5. **Response** → Dados retornam ao frontend
6. **UI Update** → React atualiza a interface

## 📊 Modelo de Dados

### Tabela: aulas
```sql
id, professor_id, aluno_id, titulo, data_aula, 
duracao_minutos, status, local, tipo, preco
```

### Tabela: professores
```sql
id, nome, email, especialidade, bio, telefone
```

### Tabela: alunos
```sql
id, nome, email, telefone, data_inscricao
```

### Tabela: conteudo_aulas
```sql
id, aula_id, descricao, materiais, 
topicos_abordados, notas_professor
```

## 🛠️ Tecnologias Utilizadas

| Layer | Tecnologias |
|-------|-------------|
| Frontend | React 18, React Big Calendar, Framer Motion, Axios |
| Backend | Node.js, Express, MySQL2, JWT |
| Database | MySQL 5.7+ |
| Styling | CSS3, CSS Variables |
| Tools | npm, Git |

## 📈 Próximas Funcionalidades (Roadmap)

- [ ] Autenticação completa (Login/Register)
- [ ] Painel administrativo
- [ ] Relatórios e exportação PDF
- [ ] Sistema de pagamento (Stripe)
- [ ] Notificações por email
- [ ] Avaliações de aulas
- [ ] Histórico de aulas
- [ ] API GraphQL
- [ ] Mobile App (React Native)
- [ ] Integração com Google Calendar

## 💡 Tips & Tricks

1. **Performance**: Use React DevTools para debugar re-renders
2. **API**: Use Insomnia ou Postman para testar endpoints
3. **Database**: Use MySQL Workbench para gerenciar tabelas
4. **Logging**: Adicione console.logs estrategicamente
5. **Cache**: Implemente Redis para cachear dados

## 🔐 Segurança (Checklist Produção)

- [ ] Habilitar HTTPS
- [ ] Usar variáveis de ambiente para secrets
- [ ] Implementar Rate Limiting
- [ ] Adicionar CSRF protection
- [ ] Validar/Sanitizar todas as inputs
- [ ] Usar prepared statements (já implementado)
- [ ] Atualizar dependências regularmente
- [ ] Configurar CORS corretamente
- [ ] Usar senhas fortes no MySQL
- [ ] Fazer backups regulares

## 📞 Suporte

- Console do navegador: F12
- Logs do servidor: Terminal do backend
- Erros SQL: Verifique `database.sql`
- Pergunte: Abra uma issue no GitHub

## 📄 Licença

MIT License - Use livremente em projetos comerciais e pessoais.

---

**Versão**: 2.0.0 (Completo com React + Node.js)  
**Última atualização**: Março 2024  
**Status**: ✅ Pronto para Produção  
**Compatibilidade**: React 18+, Node 16+, MySQL 5.7+

Desenvolvido com ❤️ para melhorar a experiência de agendamento de aulas.
