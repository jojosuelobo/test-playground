# CodePlayground

Site de cursos usado como playground para prática de automação de testes (UI e API). Construído com Next.js (App Router), PostgreSQL e Prisma. Todo elemento interativo tem um atributo `data-testid`.

## Stack

- Next.js 16 (App Router, TypeScript)
- PostgreSQL via Docker Compose
- Prisma ORM
- Autenticação própria: bcrypt + sessão JWT em cookie httpOnly
- Tailwind CSS

## Como rodar localmente

1. Suba o banco de dados:

   ```bash
   docker compose up -d
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Aplique as migrations e popule o banco:

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse [http://localhost:3000](http://localhost:3000).

Um usuário de demonstração é criado pelo seed: `demo@example.com` / `Password123!`.

> O container Postgres expõe a porta **5433** (não 5432) para não conflitar com uma instância local já em uso. Ajuste `docker-compose.yml`/`.env` se preferir outra porta.

## Fluxo da aplicação

Home (Log In / Sign Up) → Dashboard (View Marketplace) → Marketplace → Detalhe do curso (Inscrever-se) → Dashboard (módulos com vídeo + Concluir Curso) → Certificado.

## API

Todas as rotas de dados são endpoints HTTP reais em `src/app/api/*`, pensadas para serem exercitadas tanto pela UI quanto diretamente (curl/Postman/Playwright API testing):

| Rota | Método | Auth |
|---|---|---|
| `/api/auth/signup` | POST | - |
| `/api/auth/login` | POST | - |
| `/api/auth/logout` | POST | - |
| `/api/auth/me` | GET | sessão |
| `/api/courses` | GET | - |
| `/api/courses/[slug]` | GET | - |
| `/api/enrollments` | GET, POST | sessão |
| `/api/enrollments/[id]/complete` | PATCH | sessão |
| `/api/enrollments/[id]/certificate` | GET | sessão |

## Testes

Nenhum framework de testes está configurado propositalmente — este repositório é a base para você escrever seus próprios testes de automação em cima dele.
