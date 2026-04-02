# Gestão de Equipamentos — Teste Técnico Blux

Aplicação fullstack para gestão de equipamentos com autenticação JWT, CRUD completo, filtros, paginação e geração de relatórios em CSV e PDF.

---

## Stack Tecnológica

### Backend (.NET 9)
- **ASP.NET Core 9** — API REST com controllers
- **Entity Framework Core 9** + **SQLite** — ORM e banco de dados
- **JWT Bearer Authentication** — Autenticação stateless
- **FluentValidation** — Validação declarativa de DTOs
- **AutoMapper** — Mapeamento entre entidades e DTOs
- **Serilog** — Logging estruturado (console + arquivo)
- **Swashbuckle/Swagger** — Documentação OpenAPI
- **QuestPDF** — Geração de relatórios PDF
- **BCrypt.Net** — Hash de senhas
- **xUnit + Moq + FluentAssertions** — Testes unitários

### Frontend (React 18 + TypeScript)
- **Vite 5** — Build tool
- **React Router v6** — Roteamento SPA
- **TanStack Query v5** — Gerenciamento de estado do servidor
- **Zustand** — Estado de autenticação (com persistência em localStorage)
- **React Hook Form + Zod** — Formulários com validação tipada
- **Axios** — Cliente HTTP com interceptores JWT
- **Tailwind CSS 3** — Estilização utility-first

---

## Como Executar

### Pré-requisitos
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/)

### Backend

```bash
cd backend

# Restaurar pacotes e iniciar (migrations são aplicadas automaticamente)
dotnet run --project src/EquipmentManagement.API

# A API estará disponível em:
# http://localhost:5000
# Swagger UI: http://localhost:5000/swagger
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev

# A aplicação estará disponível em:
# http://localhost:5173
```

### Executar Testes (Backend)

```bash
cd backend
dotnet test
```

---

## Credenciais de Demo

| Campo | Valor |
|-------|-------|
| E-mail | `admin@blux.com` |
| Senha | `Admin@123` |

---

## Funcionalidades

### 1. Autenticação
- Login com e-mail e senha, retornando JWT com expiração
- Recuperação de senha com token mockado (retornado diretamente na resposta para fins de demo — em produção seria enviado por e-mail)
- Redefinição de senha com validação de token e expiração (15 minutos)
- Sessão persistida em localStorage via Zustand; interceptor Axios redireciona para `/login` em caso de 401

### 2. CRUD de Equipamentos
- **Criar** com validação completa no frontend (Zod) e backend (FluentValidation)
- **Listar** com paginação server-side, 10 itens por página
- **Editar** via modal com dados pré-carregados
- **Excluir** com modal de confirmação
- **Filtros**: busca por nome/tipo/série, filtro por status, filtro por tipo
- **Ordenação**: por qualquer coluna, com alternância crescente/decrescente

### 3. Relatórios
- **CSV**: exportação com BOM UTF-8 para compatibilidade com Excel
- **PDF**: gerado com QuestPDF, com tabela estilizada, cabeçalho e paginação
- Os relatórios respeitam os filtros ativos da listagem

---

## Regras de Negócio

| Regra | Implementação |
|-------|--------------|
| Usuário autenticado | `[Authorize]` em todos os endpoints de equipment |
| Número de série único | Verificação no `EquipmentService` antes de criar/editar |
| Status válido | Enum `EquipmentStatus` + validação FluentValidation |
| Data de aquisição não futura | Validação em FluentValidation (backend) e Zod (frontend) |

---

## Arquitetura do Backend

### Estrutura de pastas

```
src/EquipmentManagement.API/
├── Controllers/        — AuthController, EquipmentController
├── Data/               — AppDbContext, DbSeeder (seed automático)
├── Domain/
│   ├── Entities/       — User, Equipment
│   └── Enums/          — EquipmentStatus
├── DTOs/               — DTOs de request/response por domínio
├── Extensions/         — ServiceCollectionExtensions (DI organizado)
├── Interfaces/         — Contratos de repositório e serviço
├── Mappings/           — AutoMapper profiles
├── Middleware/         — ExceptionMiddleware (erro global + correlationId)
├── Repositories/       — EquipmentRepository (EF Core)
├── Services/           — AuthService, EquipmentService, ReportService
└── Validators/         — FluentValidation validators
```

### Decisões de design
- **Single project**: dado o escopo (uma entidade principal), Clean Architecture multi-projetos seria over-engineering. Layers são separados por pasta + contratos de interface.
- **Repository pattern**: abstrai o EF Core dos serviços, tornando-os 100% testáveis com mocks.
- **Password recovery mockado**: `ConcurrentDictionary` em memória simula o armazenamento de tokens. Em produção, usaria tabela de banco de dados + serviço de e-mail.
- **Status como string no banco**: `HasConversion<string>()` para legibilidade em consultas SQL diretas.

---

## Arquitetura do Frontend

### Estrutura de pastas

```
src/
├── api/            — Axios client + funções por domínio
├── components/
│   ├── equipment/  — Table, Form, Filters, DeleteModal, StatusBadge
│   ├── layout/     — AppLayout, Sidebar
│   └── ui/         — Button, Input, Select, Modal, Badge, Pagination, Toast, Spinner
├── hooks/          — useAuth, useEquipment (TanStack Query)
├── pages/
│   ├── auth/       — LoginPage, ForgotPasswordPage, ResetPasswordPage
│   ├── equipment/  — EquipmentPage
│   └── reports/    — ReportsPage
├── router/         — BrowserRouter config + ProtectedRoute
├── schemas/        — Zod schemas (fonte de verdade para tipos de formulários)
├── store/          — Zustand auth store (persistido)
└── types/          — TypeScript interfaces de domínio
```

### Decisões de design
- **TanStack Query** para estado do servidor (cache, revalidação, mutations) + **Zustand** somente para auth: evita misturar responsabilidades.
- **Zod schemas** como single source of truth: tipos TypeScript derivados via `z.infer`, garantindo sync entre validação e tipagem.
- **Query keys hierárquicas**: `['equipment', params]` permite invalidação precisa após mutations sem refetch desnecessário.
- **`placeholderData: keepPreviousData`**: evita flash de loading durante paginação.
- **Toast global via pub/sub**: sem Context API, o `toast.success()` pode ser chamado de qualquer lugar.

---

## Endpoints da API

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/forgot-password` | ❌ | Solicitar recuperação de senha |
| POST | `/api/auth/reset-password` | ❌ | Redefinir senha com token |
| GET | `/api/equipment` | ✅ | Listar com paginação e filtros |
| GET | `/api/equipment/{id}` | ✅ | Buscar por ID |
| POST | `/api/equipment` | ✅ | Criar equipamento |
| PUT | `/api/equipment/{id}` | ✅ | Atualizar equipamento |
| DELETE | `/api/equipment/{id}` | ✅ | Excluir equipamento |
| GET | `/api/equipment/report/csv` | ✅ | Download CSV |
| GET | `/api/equipment/report/pdf` | ✅ | Download PDF |

---

## Variáveis de Ambiente

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

### Backend (`backend/src/EquipmentManagement.API/appsettings.json`)
As configurações principais já estão no arquivo. Para produção, substitua:
- `Jwt:Key` por uma chave aleatória forte (mínimo 32 caracteres)
- `ConnectionStrings:DefaultConnection` pelo path desejado do banco SQLite
