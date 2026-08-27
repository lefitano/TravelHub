# TravelHub

Plataforma web para gerenciamento de viagens, excursões e eventos em grupo. Centraliza controle de participantes, despesas, pagamentos, cronogramas e votações em um único sistema.

## Stack

### Stack do backend

- Java 21
- Spring Boot 3.5.15
- Spring Data JPA + Hibernate
- Spring Security + JWT (jjwt)
- MySQL
- Bean Validation
- Lombok
- Maven

### Stack do frontend

- React 19 + Vite 8
- React Router 7
- Axios
- React Bootstrap 2 + Bootstrap 5
- React Icons 5

## Como rodar localmente

**Pré-requisitos:** Java 21, Node.js, MySQL rodando na porta 3306.

### Backend

1. Clone o repositório
2. Crie o banco de dados:
   ```sql
   CREATE DATABASE travelhub;
   ```
3. Copie `travelhub/src/main/resources/application.properties.example` para `application.properties` (no mesmo diretório) e preencha usuário/senha do MySQL
4. Defina a variável de ambiente `JWT_SECRET` (usada para assinar os tokens JWT)
5. Execute:
   ```bash
   cd travelhub
   ./mvnw spring-boot:run
   ```

A API sobe na porta **8000**.

### Frontend

1. Copie `frontend/.env.example` para `frontend/.env` e preencha `VITE_GEOAPIFY_KEY` com uma chave gratuita do [Geoapify](https://myprojects.geoapify.com) (usada na busca de destino com autocomplete — sem essa chave, o campo de destino continua funcionando como texto livre, só sem sugestões)
2. Execute:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

A aplicação sobe na porta **5173**. O backend já vem configurado (`SecurityConfig`) pra aceitar CORS dessa origem.

## Estrutura do repositório

```
TravelHub/
├── docs/           # Documentação do projeto
├── frontend/       # Frontend React (Vite)
└── travelhub/      # Backend Spring Boot
```

## Estrutura de pacotes (backend)

```
com.travelhub.travelhub
├── controller      # Endpoints REST
├── service         # Regras de negócio
├── repository      # Acesso ao banco (Spring Data JPA)
├── model           # Entidades JPA
├── dto             # Objetos de transferência de dados
├── exception       # Tratamento de erros (GlobalExceptionHandler + Bean Validation)
├── security        # JwtUtil, JwtFilter, UserDetailsServiceImpl
└── config          # SecurityConfig (JWT stateless + CORS)
```

## Entidades do modelo

| Entidade | Descrição |
|---|---|
| `Usuario` | Usuário do sistema |
| `Evento` | Viagem ou evento criado, com um `criador` (usuário responsável — só ele pode editar/excluir o evento) |
| `Participante` | Vínculo entre usuário e evento, com status de pagamento |
| `Despesa` | Gasto registrado em um evento, com um responsável e, opcionalmente, um subconjunto de participantes que a dividem (relação muitos-para-muitos) |
| `Votacao` | Enquete vinculada a um evento |
| `OpcaoVoto` | Opção disponível em uma votação |
| `StatusPagamento` | Enum: `PENDENTE`, `PAGO`, `CANCELADO` |

## Roadmap

- [x] **Sprint 1 — Fundação:** configuração do projeto, entidades JPA e mapeamento do banco
- [x] **Sprint 2 — CRUD:** repositórios, services e controllers para Usuários, Eventos e Participantes
- [x] **Sprint 3 — Regras de Negócio:** divisão de despesas, controle financeiro e votações
- [x] **Sprint 4 — Segurança:** Spring Security, autenticação JWT e controle de acesso
- [ ] **Sprint 5 — Frontend:** React, dashboard, eventos e financeiro
  - [x] Landing page, autenticação (login/cadastro) e dashboard
  - [x] CRUD de eventos, participantes e despesas
  - [x] Divisão seletiva de despesas (por participante) + dashboard financeiro individual e completo
  - [x] Edição e exclusão de evento (restrito ao criador)
  - [x] Página de perfil do usuário
  - [ ] Frontend de votações (backend já pronto)
- [ ] **Sprint 6 — Destino e tipo de evento:**
  - [x] Tipo de evento (Viagem/Saída) — campo, validação, seletor visual nos forms de criar/editar
  - [x] Busca de destino com autocomplete (Geoapify) — implementado, aguardando chave de API real para teste ponta a ponta
- [ ] **Sprint 7 — Deploy:** Docker e ambiente de produção

## Endpoints implementados

### Autenticação

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/auth/login` | Login — devolve `{ token, nome }` |

### Usuários

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/usuarios` | Criar usuário (público) |
| GET | `/usuarios/me` | Dados do usuário logado |
| GET | `/usuarios/{id}` | Buscar usuário (só o próprio) |
| PUT | `/usuarios/{id}` | Atualizar usuário (só o próprio) |
| DELETE | `/usuarios/{id}` | Excluir usuário (só o próprio) |

### Eventos

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/eventos` | Criar evento (criador vira participante automaticamente) |
| GET | `/eventos/meus` | Listar eventos do usuário logado |
| GET | `/eventos/{id}` | Buscar evento (participantes do evento) |
| PUT | `/eventos/{id}` | Atualizar evento (só o criador) |
| DELETE | `/eventos/{id}` | Excluir evento e tudo vinculado a ele — despesas e participantes (só o criador) |

### Participantes

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/participantes` | Adicionar participante por email |
| GET | `/participantes/evento/{eventoId}` | Listar participantes do evento |
| GET | `/participantes/{id}` | Buscar participante |
| PUT | `/participantes/{id}` | Atualizar status de pagamento |
| DELETE | `/participantes/{id}` | Remover participante — o próprio ou o criador do evento (criador não pode se autoexcluir) |

### Despesas

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/despesas` | Criar despesa, opcionalmente vinculada a participantes específicos |
| GET | `/despesas/evento/{eventoId}` | Listar despesas do evento |
| GET | `/despesas/{id}` | Buscar despesa |
| PUT | `/despesas/{id}` | Atualizar despesa |
| DELETE | `/despesas/{id}` | Remover despesa (só o responsável por ela) |
| GET | `/despesas/divisao/{eventoId}` | Saldo devido por participante |
| GET | `/despesas/resumo/{eventoId}` | Dashboard financeiro — visão filtrada pro participante comum, completa pro criador |

### Votações

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/votacoes` | Criar votação vinculada a um evento |
| GET | `/votacoes/evento/{eventoId}` | Listar votações do evento |
| GET \| PUT \| DELETE | `/votacoes/{id}` | Buscar, atualizar ou excluir uma votação |
| POST | `/opcoesvotos` | Criar opção de voto vinculada a uma votação |
| GET | `/opcoesvotos/votacao/{votacaoId}` | Listar opções de uma votação |
| GET \| PUT \| DELETE | `/opcoesvotos/{id}` | Buscar, atualizar ou excluir uma opção |
