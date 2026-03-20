# 📖 Guia de Melhores Práticas

## Convenções de Código

### Nomenclatura

#### React Components
```javascript
// ✅ Bom - PascalCase para componentes
function UserProfile() { }
const Dashboard = () => {}

// ❌ Ruim
function userProfile() { }
const dashboard = () => {}
```

#### Variáveis e Funções
```javascript
// ✅ Bom - camelCase
const userData = {}
function getUserData() { }
const handleSubmit = () => {}

// ❌ Ruim
const user_data = {}
function get_user_data() { }
const submit = () => {}
```

#### Constantes
```javascript
// ✅ Bom - UPPER_SNAKE_CASE
const API_URL = 'http://localhost:5000'
const MAX_RETRIES = 3
const DEFAULT_TIMEOUT = 5000

// ❌ Ruim
const apiUrl = 'http://localhost:5000'
const max_retries = 3
```

### Estrutura de Arquivos

```
src/
├── components/         # Componentes reutilizáveis
│   ├── Button.jsx
│   ├── Modal.jsx
│   └── Card.jsx
├── pages/             # Páginas (se usar routing)
│   ├── HomePage.jsx
│   └── DashboardPage.jsx
├── hooks/             # Custom hooks
│   ├── useAulas.js
│   ├── useProfessores.js
│   └── useAuth.js
├── services/          # Serviços (API, auth, etc)
│   ├── api.js
│   └── auth.js
├── utils/             # Utilitários
│   ├── formatters.js
│   └── validators.js
├── styles/            # Estilos globais
│   └── global.css
└── App.jsx            # Componente raiz
```

## React Best Practices

### 1. Componentes Funcionais com Hooks
```javascript
// ✅ Bom
function AulaCard({ aula, onClick }) {
  return <div onClick={onClick}>{aula.titulo}</div>
}

// ❌ Evitar
class AulaCard extends React.Component {
  render() {
    return <div>{this.props.titulo}</div>
  }
}
```

### 2. Usar Hooks Customizados
```javascript
// ✅ Bom - Lógica reutilizável
function MyComponent() {
  const { aulas, loading } = useAulas()
  return <div>{/* ... */}</div>
}

// ❌ Ruim - Lógica repetida em cada componente
function MyComponent() {
  const [aulas, setAulas] = useState([])
  // ... toda a lógica aqui
}
```

### 3. Usar useCallback para Performance
```javascript
// ✅ Bom - Evita re-render desnecessário
const handleClick = useCallback(() => {
  onAulaSelect(aulaId)
}, [aulaId, onAulaSelect])

// ❌ Ruim - Função recriada a cada render
const handleClick = () => {
  onAulaSelect(aulaId)
}
```

### 4. Separar Lógica de UI
```javascript
// ✅ Bom
// services/api.js
export const fetchAulas = () => api.get('/aulas')

// components/AulasList.jsx
function AulasList() {
  const { aulas } = useAulas()
  return <div>{/* ... */}</div>
}

// ❌ Ruim - Lógica misturada
function AulasList() {
  const [aulas, setAulas] = useState([])
  useEffect(() => {
    axios.get('/aulas').then(res => setAulas(res.data))
  }, [])
}
```

## Node.js/Express Best Practices

### 1. Separar Rotas e Lógica
```javascript
// ✅ Bom
// routes/aulas.js
router.get('/', aulaController.getAll)

// controllers/aulaController.js
exports.getAll = async (req, res) => {
  // lógica aqui
}

// ❌ Ruim - Tudo no server.js
app.get('/api/aulas', (req, res) => {
  // 500 linhas de código
})
```

### 2. Tratar Erros Apropriadamente
```javascript
// ✅ Bom
try {
  const aulas = await Aula.findAll()
  res.json(aulas)
} catch (error) {
  console.error('Erro:', error)
  res.status(500).json({ error: 'Erro ao buscar aulas' })
}

// ❌ Ruim
Aula.findAll().then(aulas => {
  res.json(aulas)
})
// O que acontece se der erro?
```

### 3. Validar Inputs
```javascript
// ✅ Bom
const { validarNovaAula } = require('../utils/validacao')

app.post('/api/aulas', (req, res) => {
  const validacao = validarNovaAula(req.body)
  if (!validacao.valido) {
    return res.status(400).json({ erros: validacao.erros })
  }
  // Processar
})

// ❌ Ruim
app.post('/api/aulas', (req, res) => {
  // Usar direto sem validar
  const aula = req.body
})
```

### 4. Usar Promises/Async-Await
```javascript
// ✅ Bom - Async/await (mais legível)
async function getAulas(req, res) {
  try {
    const aulas = await Aula.findAll()
    res.json(aulas)
  } catch (error) {
    res.status(500).json({ error: 'Erro' })
  }
}

// ❌ Ruim - Callback hell
app.get('/aulas', (req, res) => {
  Aula.findAll((err, aulas) => {
    if (err) {
      res.error(err)
    } else {
      res.json(aulas)
    }
  })
})
```

## CSS/Styling Best Practices

### 1. Usar CSS Variables
```css
/* ✅ Bom */
:root {
  --color-primary: #4f46e5;
  --color-success: #10b981;
  --spacing-md: 1rem;
}

.button {
  background: var(--color-primary);
  padding: var(--spacing-md);
}

/* ❌ Ruim */
.button {
  background: #4f46e5;
  padding: 1rem;
}
.button-success {
  background: #10b981;
  padding: 1rem;
}
```

### 2. Estrutura de Classes
```css
/* ✅ Bom - BEM Methodology */
.aula-card {
  /* ... */
}
.aula-card__header {
  /* ... */
}
.aula-card__title {
  /* ... */
}
.aula-card--highlighted {
  /* ... */
}

/* ❌ Ruim */
.card {
  /* ... */
}
.card-title {
  /* ... */
}
.card-title-big {
  /* ... */
}
```

## Performance Optimization

### Frontend
```javascript
// ✅ Lazy load imagens
<img loading="lazy" src="image.jpg" />

// ✅ Code splitting com React.lazy
const Dashboard = React.lazy(() => import('./Dashboard'))

// ✅ Memoizar componentes
const AulaCard = React.memo(({ aula }) => {
  return <div>{aula.titulo}</div>
})

// ✅ Usar useCallback com dependências corretas
const handleFilter = useCallback((status) => {
  setFilteredAulas(aulas.filter(a => a.status === status))
}, [aulas])
```

### Backend
```javascript
// ✅ Usar indexes no banco
CREATE INDEX idx_data_aula ON aulas(data_aula)

// ✅ Pool de conexões
const pool = mysql.createPool({ max: 10 })

// ✅ Pagination
const limit = 20
const offset = (page - 1) * limit
Aula.findAll({ limit, offset })

// ✅ Cache
const cached = await redis.get('aulas')
if (!cached) {
  const aulas = await Aula.findAll()
  await redis.set('aulas', JSON.stringify(aulas), 3600)
}
```

## Testes

### Unit Tests
```javascript
// ✅ Bom
describe('validarEmail', () => {
  it('deve aceitar emails válidos', () => {
    expect(validarEmail('test@example.com')).toBe(true)
  })
  
  it('deve rejeitar emails inválidos', () => {
    expect(validarEmail('invalid')).toBe(false)
  })
})
```

### Integration Tests
```javascript
// ✅ Bom
describe('GET /api/aulas', () => {
  it('deve retornar lista de aulas', async () => {
    const response = await axios.get('/api/aulas')
    expect(response.status).toBe(200)
    expect(Array.isArray(response.data)).toBe(true)
  })
})
```

## Documentação

### JSDoc para Funções
```javascript
/**
 * Cria uma nova aula
 * @param {Object} dados - Dados da aula
 * @param {number} dados.professor_id - ID do professor
 * @param {string} dados.titulo - Título da aula
 * @param {Date} dados.data_aula - Data e hora da aula
 * @returns {Promise<Object>} Aula criada com ID
 * @throws {ValidationError} Se dados inválidos
 * @example
 * const aula = await criarAula({
 *   professor_id: 1,
 *   titulo: 'Matemática',
 *   data_aula: new Date('2024-04-15T14:00:00')
 * })
 */
async function criarAula(dados) {
  // ...
}
```

## Commits e Git

### Mensagens de Commit
```bash
# ✅ Bom
git commit -m "feat: adicionar componente Dashboard"
git commit -m "fix: corrigir bug no filtro de aulas"
git commit -m "docs: atualizar README"
git commit -m "style: formatar código com Prettier"
git commit -m "refactor: simplificar lógica de validação"
git commit -m "test: adicionar testes para API de aulas"

# ❌ Ruim
git commit -m "atualizações"
git commit -m "fix bug"
git commit -m "mudanças diversas"
```

### Branches
```bash
# Feature
git checkout -b feature/novo-dashboard

# Bug fix
git checkout -b fix/aula-duplicada

# Release
git checkout -b release/1.0.0

# Hotfix
git checkout -b hotfix/corrigir-login
```

## Segurança

### Secrets Management
```javascript
// ✅ Bom - Usar variáveis de ambiente
const dbPassword = process.env.DB_PASSWORD

// ❌ Ruim - Hardcoded
const dbPassword = 'senha123'
```

### SQL Injection Prevention
```javascript
// ✅ Bom - Prepared statements
const [rows] = await connection.query(
  'SELECT * FROM aulas WHERE id = ?',
  [id]
)

// ❌ Ruim - String concatenation
const query = `SELECT * FROM aulas WHERE id = ${id}`
```

### XSS Prevention
```javascript
// ✅ Bom - React escapa automaticamente
function AulaTitle({ titulo }) {
  return <h1>{titulo}</h1>
}

// ❌ Ruim
function AulaTitle({ titulo }) {
  return <h1 dangerouslySetInnerHTML={{ __html: titulo }} />
}
```

## Debugging

### Ferramentas Úteis
- **Frontend**: React DevTools, Redux DevTools
- **Backend**: Postman, Insomnia, Thunder Client
- **Database**: MySQL Workbench, DBeaver
- **Network**: Chrome DevTools Network tab

### Console.logs Bons
```javascript
// ✅ Bom - Identificar o que está sendo logado
console.log('Aulas carregadas:', aulas)
console.error('Erro ao deletar aula:', error)
console.warn('Aula futura:', aula.data_aula)

// ❌ Ruim
console.log('aulas')
console.log(aulas)
console.log('error')
```

---

**Lembre-se**: Código bom é código que:
- ✅ Funciona corretamente
- ✅ É fácil de entender
- ✅ É fácil de manter
- ✅ É fácil de testar
- ✅ É seguro
