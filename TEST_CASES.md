# Casos de Teste E2E — CodePlayground

Checklist de casos de teste para automação (Playwright/Cypress/etc). Cobre UI (com `data-testid`) e API (status codes). Marque `[x]` conforme for implementando.

## Referência rápida

**Base URL:** `http://localhost:3000`

**Usuários seed:**
| Papel | Email | Senha |
|---|---|---|
| Aluno (demo) | `demo@example.com` | `Password123!` |
| Professor | `professor@admin.com` | `admin` |

**Cursos seed (slug / id variável por ambiente):** `java-fundamentals`, `cpp-fundamentals`, `python-fundamentals`, `javascript-fundamentals`, `sql-fundamentals`.

**Rotas protegidas** (redirecionam para `/?login=required` se não autenticado): `/marketplace/*`, `/course/*`, `/dashboard/*`, `/account/*`, `/professor/*`.
**Rotas públicas:** `/`, `/u/[userId]`.

---

## 5. Home

Página: `home-page`

- [ ] Deslogado: exibe `home-login-button` e `home-signup-button`
- [ ] Logado como aluno: exibe `home-dashboard-link` → "Ir para o Dashboard", aponta para `/dashboard`
- [ ] Logado como professor: exibe `home-dashboard-link` → texto "Ir para o Painel do Professor", aponta para `/professor`

---

## 6. Navbar

Componente: `navbar`

- [ ] Deslogado: mostra `nav-login-button` e `nav-signup-button`; não mostra `nav-dashboard-link`/`nav-professor-link`/`nav-account-link`/`nav-logout-button`
- [ ] Logado como aluno: mostra `nav-dashboard-link` (texto "Dashboard"), `nav-account-link` (texto "Minha conta"), `nav-logout-button`; **não** mostra `nav-professor-link`
- [ ] Logado como professor: mostra `nav-professor-link` (texto "Painel do Professor") no lugar de `nav-dashboard-link`; mostra `nav-account-link` e `nav-logout-button`
- [ ] `nav-home-link` sempre leva para `/`

---

## 7. Marketplace

Página: `marketplace-page` · Grid: `marketplace-grid`

- [ ] Lista todos os cursos cadastrados como cards (`course-card-{slug}` para cada um dos 5 cursos seed)
- [ ] Cada card mostra badge de linguagem (`course-card-language-{slug}`) e título (`course-card-title-{slug}`)
- [ ] Clicar em um card navega para `/course/{id}` (id real do curso, não o slug)
- [ ] Estado de carregamento (`marketplace-loading`) aparece brevemente antes da lista

### API — `GET /api/courses`
- [ ] Sem autenticação → `200` (rota pública), retorna lista de cursos

---

## 8. Detalhe do Curso (`/course/{id}`)

Página: `course-detail-page` · Bloco: `course-detail`

### 8.1 Informações gerais
- [ ] Exibe título (`course-detail-title`), descrição (`course-detail-description`) e badge de linguagem
- [ ] Acessar um `id` de curso inexistente → exibe `course-not-found`
- [ ] Estado de carregamento (`course-detail-loading`) antes dos dados chegarem

### 8.2 Matrícula
- [ ] Usuário não matriculado vê botão `enroll-button` ("Inscrever-se")
- [ ] Clicar `enroll-button` → matrícula criada, some o botão e aparece `enrollment-status-badge` ("Matriculado") + link `enrollment-dashboard-link`
- [ ] Usuário já matriculado (ao recarregar a página) vê direto o badge de status, sem o botão de inscrever-se
- [ ] Tentar matricular-se 2x no mesmo curso (via API) → segunda tentativa não quebra a UI (trata 409 como sucesso)

### 8.3 Abas — Módulos / Avaliações / Comentários
Componente de abas: `course-tabs` (`course-tab-modules`, `course-tab-ratings`, `course-tab-comments`)

- [ ] Aba "Módulos" é a padrão ao abrir a página; lista `course-module-list` com um item por módulo (`course-module-item-{order}`)
- [ ] Trocar para aba "Avaliações" exibe `course-ratings`
- [ ] Trocar para aba "Comentários" exibe `course-comments`

#### Avaliações (`course-ratings`)
- [ ] Mostra média (`course-ratings-average`) e contagem (`course-ratings-count`)
- [ ] Deslogado: exibe `course-ratings-login-prompt`, sem widget de avaliação
- [ ] Logado mas **não matriculado**: exibe `course-ratings-enroll-prompt` ("Matricule-se para avaliar este curso"), sem widget
- [ ] Logado **e matriculado**: exibe `course-rating-widget` com 5 estrelas (`course-rating-star-1` a `course-rating-star-5`)
- [ ] Clicar em uma estrela registra/atualiza a nota do usuário, média e contagem são recalculadas
- [ ] Avaliar novamente (clicar outra estrela) atualiza a nota existente ao invés de criar uma nova (1 avaliação por usuário por curso)
- [ ] Lista de avaliações (`course-ratings-list`) mostra nome do avaliador e estrelas de cada `course-rating-item-{id}`
- [ ] Sem avaliações ainda → `course-ratings-empty-state`

#### Comentários (`course-comments`)
- [ ] Deslogado: exibe `course-comments-login-prompt`, sem formulário
- [ ] Logado (matriculado ou não): exibe `course-comment-form` com `course-comment-input` e botão `course-comment-submit-button`
- [ ] Publicar comentário válido → aparece no topo da lista (`course-comments-list`), campo de texto limpa
- [ ] Publicar comentário vazio → bloqueado pelo `required` do textarea
- [ ] Comentário mostra autor (`course-comment-author-{id}`) e corpo (`course-comment-body-{id}`)
- [ ] Sem comentários ainda → `course-comments-empty-state`

### API — cursos/comentários/avaliações
| Rota | Método | Cenário | Status esperado |
|---|---|---|---|
| `/api/courses/{id}` | GET | curso existe | `200` |
| `/api/courses/{id}` | GET | id inexistente | `404` |
| `/api/enrollments` | POST | sem sessão | `401` |
| `/api/enrollments` | POST | courseId inválido/ausente | `400` |
| `/api/enrollments` | POST | courseId inexistente | `404` |
| `/api/enrollments` | POST | já matriculado | `409` |
| `/api/enrollments` | POST | matrícula nova | `201` |
| `/api/courses/{id}/comments` | GET | qualquer (público) | `200` |
| `/api/courses/{id}/comments` | POST | sem sessão | `401` |
| `/api/courses/{id}/comments` | POST | body vazio / > 1000 chars | `400` |
| `/api/courses/{id}/comments` | POST | logado, válido | `201` |
| `/api/courses/{id}/ratings` | GET | qualquer (público) | `200` |
| `/api/courses/{id}/ratings` | POST | sem sessão | `401` |
| `/api/courses/{id}/ratings` | POST | logado mas não matriculado | `403` |
| `/api/courses/{id}/ratings` | POST | score fora de 1-5 | `400` |
| `/api/courses/{id}/ratings` | POST | matriculado, score 1-5 | `200` |

---

## 9. Dashboard do Aluno (`/dashboard`)

Página: `dashboard-page`

- [ ] Sem matrículas → `dashboard-empty-state`
- [ ] Com matrículas → `enrolled-course-list` com um item por curso (`enrolled-course-list-item-{enrollmentId}`), mostrando só o título (`enrolled-course-title-{id}`) e badge de status (`enrolled-course-status-{id}`: "Em andamento" ou "Concluído")
- [ ] **Não** exibe mais uma seção de "Cursos Disponíveis" (catálogo) — removida propositalmente
- [ ] Botão `view-marketplace-button` navega para `/marketplace`
- [ ] Clicar em um item da lista navega para `/dashboard/{enrollmentId}` (página própria da matrícula)
- [ ] Estado de carregamento (`dashboard-loading`)

---

## 10. Página da Matrícula (`/dashboard/{enrollmentId}`)

Página: `enrolled-course-detail-page` · Bloco: `enrolled-course-detail`

- [ ] Mostra título do curso (`enrolled-course-detail-title`) e badge de status (`enrolled-course-detail-status`)
- [ ] Lista os módulos do curso, cada um com vídeo do YouTube embedado (`module-section-{order}`, `module-title-{order}`, `module-video-{order}` no iframe)
- [ ] Status "Em andamento": exibe botão `complete-course-button`
- [ ] Clicar `complete-course-button` → status muda para "Concluído", botão some e aparece `certificate-button`
- [ ] Status "Concluído": exibe `certificate-button` no lugar do botão de concluir
- [ ] Link `enrolled-course-back-link` volta para `/dashboard`
- [ ] Acessar `enrollmentId` que não pertence ao usuário logado → `enrolled-course-detail-error` (não deve vazar dados de outro aluno)
- [ ] Acessar `enrollmentId` inexistente → mesmo tratamento de erro
- [ ] Estado de carregamento (`enrolled-course-detail-loading`)

### API — enrollments/[id]
| Rota | Método | Cenário | Status esperado |
|---|---|---|---|
| `/api/enrollments/{id}` | GET | sem sessão | `401` |
| `/api/enrollments/{id}` | GET | não é o dono | `403` |
| `/api/enrollments/{id}` | GET | id inexistente | `404` |
| `/api/enrollments/{id}` | GET | dono, existe | `200` |
| `/api/enrollments/{id}/complete` | PATCH | sem sessão | `401` |
| `/api/enrollments/{id}/complete` | PATCH | não é o dono | `403` |
| `/api/enrollments/{id}/complete` | PATCH | dono | `200`, status vira `COMPLETED` |

---

## 11. Certificado (`/dashboard/{enrollmentId}/certificate`)

Página: `certificate-page` · Componente: `certificate-view`

- [ ] Curso concluído: exibe nome do usuário (`certificate-user-name`), título do curso (`certificate-course-title`) e data de conclusão formatada (`certificate-completed-date`)
- [ ] Tentar acessar certificado de curso **ainda não concluído** → `certificate-error-state` com mensagem, sem exibir o certificado
- [ ] Link `certificate-back-to-dashboard-link` no estado de erro volta para `/dashboard`
- [ ] Acessar certificado de matrícula de outro usuário → erro (não deve vazar certificado alheio)
- [ ] Estado de carregamento (`certificate-loading`)

### API — `GET /api/enrollments/{id}/certificate`
- [ ] Sem sessão → `401`
- [ ] Não é o dono → `403`
- [ ] Id inexistente → `404`
- [ ] Dono, mas curso não concluído → `400`
- [ ] Dono, curso concluído → `200`, `{ userName, courseTitle, completedAt }`

---

## 12. Minha Conta (`/account`)

Página: `account-page` · Form: `account-form`

### 12.1 Aluno
- [ ] Sidebar mostra avatar (`account-avatar`, iniciais), nome (`account-sidebar-name`) e email
- [ ] Link `account-public-profile-link` ("Ver perfil público") **visível**, aponta para `/u/{userId}`
- [ ] Seção "Dados Básicos" (`account-basic-info-section`) **visível**: nome (`account-name-input`), email somente-leitura (`account-email-display`), telefone (`account-phone-input`), headline (`account-headline-input`), biografia (`account-bio-input`)
- [ ] Seção "Links" sempre visível: website, Facebook, Instagram, LinkedIn, TikTok, X, YouTube (`account-website-input`, `account-facebook-input`, `account-instagram-input`, `account-linkedin-input`, `account-tiktok-input`, `account-x-input`, `account-youtube-input`)
- [ ] Editar campos e clicar `account-save-button` → `account-success-message`, dados persistem após reload da página
- [ ] Editar nome para 1 caractere e salvar → `account-error-message` (validação)
- [ ] Campo de email não é editável (input `disabled`)

### 12.2 Professor
- [ ] Seção "Dados Básicos" (`account-basic-info-section`) **não é renderizada**
- [ ] Link `account-public-profile-link` **não é renderizado**
- [ ] Seção "Links" continua visível e editável
- [ ] Salvar alterações (só links) funciona normalmente, nome do professor permanece inalterado no backend

### API — `/api/account`
- [ ] `GET` sem sessão → `401`
- [ ] `GET` autenticado → `200`, retorna perfil completo (sem `passwordHash`)
- [ ] `PATCH` sem sessão → `401`
- [ ] `PATCH` com nome inválido (< 2 chars) → `400`
- [ ] `PATCH` com campos de link acima do tamanho máximo → `400`
- [ ] `PATCH` válido → `200`, retorna perfil atualizado

---

## 13. Perfil Público (`/u/{userId}`)

Página: `public-profile-page`

- [ ] Acessível **sem estar logado**
- [ ] Mostra avatar (`public-profile-avatar`), nome (`public-profile-name`)
- [ ] Headline (`public-profile-headline`) só aparece se preenchido em "Minha Conta"
- [ ] Bio (`public-profile-bio`) só aparece se preenchido
- [ ] Links (`public-profile-links`) só aparecem os que foram preenchidos, cada um como link externo (`target="_blank"`)
- [ ] Seção "Cursos Concluídos": mostra **apenas** cursos com status `COMPLETED` (`public-profile-completed-courses`, `public-profile-course-item-{courseId}`) — cursos apenas "em andamento" **não** aparecem
- [ ] Nenhum curso concluído → `public-profile-no-completed-courses`
- [ ] Clicar em um curso concluído navega para `/course/{id}`
- [ ] `userId` inexistente → `public-profile-not-found`

### API — `GET /api/users/{id}/public`
- [ ] Sem sessão (rota pública) → `200`
- [ ] Id inexistente → `404`
- [ ] Retorna apenas enrollments com status `COMPLETED` em `completedCourses`

---

## 14. Painel do Professor (`/professor`)

Página: `professor-page`

- [ ] Login como professor redireciona automaticamente para `/professor`
- [ ] Lista todos os cursos da plataforma (`professor-course-list`), cada um com título (`professor-course-title-{id}`), contagem de alunos matriculados (`professor-course-enrolled-count-{id}`) e contagem de concluídos (`professor-course-completed-count-{id}`)
- [ ] Clicar em um curso navega para `/professor/{courseId}`
- [ ] **Aluno comum tentando acessar `/professor` diretamente pela URL** → redirecionado para `/dashboard` (bloqueio de página)
- [ ] Estado de carregamento (`professor-loading`)

### 14.1 Alunos do Curso (`/professor/{courseId}`)

Página: `professor-course-students-page`

- [ ] Mostra título do curso (`professor-course-students-title`) e lista de matrículas (`professor-students-list`)
- [ ] Cada aluno mostra nome (`professor-student-name-{enrollmentId}`), email (`professor-student-email-{enrollmentId}`) e status (`professor-student-status-{enrollmentId}`: "Em andamento"/"Concluído")
- [ ] Curso sem nenhum aluno matriculado → `professor-course-students-empty-state`
- [ ] Link `professor-back-link` volta para `/professor`
- [ ] `courseId` inexistente → `professor-course-not-found`
- [ ] Aluno comum tentando acessar `/professor/{courseId}` diretamente → redirecionado para `/dashboard`

### API — rotas do professor
| Rota | Método | Cenário | Status esperado |
|---|---|---|---|
| `/api/professor/courses` | GET | sem sessão | `401` |
| `/api/professor/courses` | GET | logado como aluno (não-professor) | `403` |
| `/api/professor/courses` | GET | logado como professor | `200` |
| `/api/professor/courses/{id}/enrollments` | GET | sem sessão | `401` |
| `/api/professor/courses/{id}/enrollments` | GET | aluno tentando acessar | `403` |
| `/api/professor/courses/{id}/enrollments` | GET | professor, courseId inexistente | `404` |
| `/api/professor/courses/{id}/enrollments` | GET | professor, curso válido | `200` |

---

## 15. Fluxos end-to-end sugeridos (jornadas completas)

- [ ] **Jornada do aluno completa**: cadastro → marketplace → escolher curso → matricular-se → avaliar (deve bloquear antes de matricular e liberar depois) → comentar → ir ao dashboard → abrir matrícula → assistir módulos → concluir curso → ver certificado → conferir perfil público mostrando o curso concluído
- [ ] **Jornada do professor**: login como professor → painel geral com contagens corretas → abrir um curso → ver o aluno que acabou de concluir na jornada acima com status "Concluído"
- [ ] **Isolamento entre usuários**: criar 2 alunos, matricular só um deles em um curso; o outro não deve ver essa matrícula em `/dashboard`, nem conseguir acessar `/dashboard/{enrollmentId}` do primeiro (403), nem o certificado dele (403)
- [ ] **Sessão expira/cookie removido**: apagar cookie `session` manualmente e tentar navegar em página protegida → redireciona para login
