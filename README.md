# TravelHub

Plataforma web para gerenciamento de viagens, excursões e eventos em grupo. Centraliza controle de participantes, despesas, pagamentos, cronogramas e votações em um único sistema.

## Stack

- **Java 21**
- **Spring Boot 3.5.15**
- **Spring Data JPA + Hibernate**
- **Spring Security + JWT**
- **MySQL**
- **Lombok**
- **Maven**

## Como rodar localmente

**Pré-requisitos:** Java 21, MySQL rodando na porta 3306.

1. Clone o repositório
2. Crie o banco de dados:
   ```sql
   CREATE DATABASE travelhub;
   ```
3. Configure as credenciais em `travelhub/src/main/resources/application.properties`
4. Execute:
   ```bash
   cd travelhub
   ./mvnw spring-boot:run
   ```

A aplicação sobe na porta **8000**.

## Estrutura do repositório

```
TravelHub/
├── docs/           # Documentação do projeto
└── travelhub/      # Backend Spring Boot
```

## Estrutura de pacotes

```
com.travelhub.travelhub
├── controller      # Endpoints REST
├── service         # Regras de negócio
├── repository      # Acesso ao banco (Spring Data JPA)
├── model           # Entidades JPA
├── dto             # Objetos de transferência de dados
├── mapper          # Conversão entre entidades e DTOs
├── exception       # Tratamento de erros
├── security        # Configuração JWT e Spring Security
├── config          # Configurações gerais
└── util            # Utilitários
```

## Entidades do modelo

| Entidade | Descrição |
|---|---|
| `Usuario` | Usuário do sistema |
| `Evento` | Viagem ou evento criado |
| `Participante` | Vínculo entre usuário e evento |
| `Despesa` | Gasto registrado em um evento |
| `Votacao` | Enquete vinculada a um evento |
| `OpcaoVoto` | Opção disponível em uma votação |
| `StatusPagamento` | Enum: `PENDENTE`, `PAGO`, `CANCELADO` |

## Roadmap

- [x] **Sprint 1 — Fundação:** configuração do projeto, entidades JPA e mapeamento do banco
- [x] **Sprint 2 — CRUD:** repositórios, services e controllers para Usuários, Eventos e Participantes
- [x] **Sprint 3 — Regras de Negócio:** divisão de despesas, controle financeiro e votações
- [x] **Sprint 4 — Segurança:** Spring Security, autenticação JWT e controle de acesso
- [ ] **Sprint 5 — Frontend:** React, dashboard, eventos e financeiro
- [ ] **Sprint 6 — Deploy:** Docker e ambiente de produção

## Endpoints previstos

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/auth/login` | Autenticação |
| POST | `/usuarios` | Criar usuário |
| GET | `/usuarios` | Listar usuários |
| GET | `/usuarios/{id}` | Buscar usuário |
| PUT | `/usuarios/{id}` | Atualizar usuário |
| DELETE | `/usuarios/{id}` | Excluir usuário |
| POST | `/eventos` | Criar evento |
| GET | `/eventos` | Listar eventos |
| POST | `/despesas` | Criar despesa |
| GET | `/despesas` | Listar despesas |
