# Frontend — Gestão de Equipamentos

Interface SPA desenvolvida com React 18 + TypeScript + Vite.

## Tecnologias

- **React 18 + TypeScript** com Vite 5
- **TanStack Query v5** — estado do servidor (cache, paginação, mutations)
- **Zustand** — estado de autenticação persistido em localStorage
- **React Hook Form + Zod** — formulários com validação tipada
- **Axios** — cliente HTTP com interceptores JWT
- **Tailwind CSS 3** — estilização utility-first (dark theme + paleta ciano)
- **React Router v6** — roteamento SPA com ProtectedRoute

## Como executar

```bash
npm install
npm run dev
# http://localhost:5173
```

## Variáveis de ambiente

```env
VITE_API_URL=http://localhost:5000
```
