# Desafios 07, 08 e 09 - Jornada Ignite (NodeJs) da Rockeseat

<h4 align="center">
 ✅  Desafio 07 Concluído  ✅
</h4>

<h4 align="center">
 ✅  Desafio 08 Concluído  ✅
</h4>

<h4 align="center">
 🚧  Desafio 08 Concluído  🚧
</h4>

## Descrição do Projeto

Este repositório contêm minha solução para o sétimo, oitavo e nono (primeiro e segundo do Chapter IV e primeiro do Chapter V) desafio da trilha de NodeJs da plataforma Ignite da [Rockeseat](https://www.rocketseat.com.br/), consistindo na construção de testes unitários para uma API já pronta.

Link com Detalhes:

[Desafio 07 - Testes unitários](https://www.notion.so/Desafio-01-Testes-unit-rios-0321db2af07e4b48a85a1e4e360fcd11)
[Desafio 08 - Testes de integração](https://www.notion.so/Desafio-02-Testes-de-integra-o-70a8af48044d444cb1d2c1fa00056958)
[Desafio 09 - Transferências com a FinAPI](https://www.notion.so/Desafio-01-Transfer-ncias-com-a-FinAPI-5e1dbfc0bd66420f85f6a4948ad727c2)

## Teste Unitários

- [x] Users;
  - [x] Create user;
  - [x] Authenticate user;
  - [x] Show user profile;
- [x] Statements;
  - [x] Create statements;
  - [x] Get balance;
  - [x] Get statements operation;

## Testes de Integração (Rotas)

- [x] Users;
  - [x] POST /api/v1/users;
  - [x] POST /api/v1/sessions;
  - [x] GET /api/v1/profile;
- [x] Statements;
  - [x] GET /api/v1/statements/balance;
  - [x] POST /api/v1/statements/deposit;
  - [x] POST /api/v1/statements/withdraw;
  - [x] GET /api/v1/statements/:statement_id;

## Tecnologias e Bibliotecas

- [Node.js](https://nodejs.org/)
- [Jest](https://jestjs.io/pt-BR/)
- [SuperTest](github.com/visionmedia/supertest)
