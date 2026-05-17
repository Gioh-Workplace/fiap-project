# Backend - FIAP Blog

API REST do projeto FIAP Blog, responsável por autenticação, controle de usuários, posts e comentários.

O backend centraliza as regras de negócio do sistema, incluindo autenticação com JWT, controle de acesso por perfil e integração com o banco de dados MongoDB.

---

## Objetivo

O objetivo do backend é fornecer uma API REST para ser consumida pelas aplicações Web e Mobile.

A API permite:

- autenticar usuários
- validar permissões por perfil
- gerenciar posts
- gerenciar usuários
- gerenciar comentários
- proteger rotas administrativas
- padronizar respostas enviadas ao frontend e ao mobile

---

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- dotenv
- cors
- Jest
- Supertest

---

## Arquitetura

O backend está organizado em camadas para separar responsabilidades.

```txt
backend/
├── src/
│   ├── constants/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── package.json
└── README.md
````

---

## Principais Pastas

### `controllers/`

Contém a lógica das requisições.

Principais controllers:

* `authController.js`
* `postController.js`
* `userController.js`
* `commentController.js`

---

### `models/`

Contém os modelos do MongoDB utilizando Mongoose.

Principais models:

* `User.js`
* `Post.js`
* `Comment.js`

---

### `routes/`

Contém as rotas da API.

Principais rotas:

* `authRoutes.js`
* `postRoutes.js`
* `userRoutes.js`
* `commentRoutes.js`

---

### `middlewares/`

Contém middlewares da aplicação.

Principal middleware:

* `authMiddleware.js`

Esse middleware valida o token JWT enviado nas requisições protegidas.

---

### `utils/`

Contém funções utilitárias.

Principais arquivos:

* `apiResponse.js`
* `jwt.js`

---

### `constants/`

Centraliza constantes usadas no sistema.

Exemplos:

* roles de usuário
* status de posts
* configurações de autenticação

---

## Autenticação

A autenticação é feita com JWT.

Fluxo:

1. O usuário envia email e senha para a rota de login.
2. O backend valida as credenciais.
3. Se os dados estiverem corretos, o backend gera um token JWT.
4. O token é enviado ao cliente.
5. O cliente envia o token nas próximas requisições protegidas.
6. O middleware de autenticação valida o token antes de permitir o acesso.

---

## Autorização

O sistema possui controle de acesso baseado em perfil.

### Professor

Pode realizar ações administrativas:

* criar posts
* editar posts
* excluir posts
* alterar status de posts
* visualizar posts em todos os status
* criar usuários
* editar usuários
* excluir usuários
* comentar em posts

### Aluno

Possui acesso limitado:

* visualizar posts publicados
* visualizar detalhes de posts publicados
* criar comentários
* editar ou excluir seus próprios comentários, conforme regra do sistema

---

## Padronização de Respostas

A API utiliza respostas padronizadas para facilitar o consumo pelo frontend web e pelo aplicativo mobile.

As respostas seguem um padrão com:

* `success`
* `message`
* `data`

Exemplo de resposta de sucesso:

```json
{
  "success": true,
  "message": "Operação realizada com sucesso.",
  "data": {}
}
```

Exemplo de resposta de erro:

```json
{
  "success": false,
  "message": "Erro ao realizar operação."
}
```

---

## Principais Rotas

### Autenticação

```txt
POST /auth/login
```

Realiza login e retorna o token JWT.

---

### Posts

```txt
GET /posts
GET /posts/:id
POST /posts
PUT /posts/:id
DELETE /posts/:id
```

Funcionalidades:

* listar posts
* buscar post por id
* criar post
* editar post
* excluir post
* controlar status de publicação

---

### Usuários

```txt
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id
```

Funcionalidades:

* listar usuários
* buscar usuário por id
* criar usuário
* editar usuário
* excluir usuário
* diferenciar professores e alunos

---

### Comentários

```txt
GET /comments/:postId
POST /comments
PUT /comments/:id
DELETE /comments/:id
```

Funcionalidades:

* listar comentários de um post
* criar comentário
* editar comentário
* excluir comentário

---

## Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/`.

Exemplo:

```env
PORT=3000
MONGO_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta
```

---

## Como Executar

### Instalar dependências

```bash
cd backend
npm install
```

### Executar em modo desenvolvimento

```bash
npm run dev
```

### Executar em modo produção/local

```bash
npm start
```

A API será executada por padrão em:

```txt
http://localhost:3000
```

---

## Testes

O backend possui testes automatizados com Jest e Supertest.

Os testes cobrem pontos como:

* autenticação
* middleware de autenticação
* posts
* usuários
* comentários
* padronização de respostas
* regras de permissão

### Executar testes

```bash
npm test
```

---

## Integração com Frontend e Mobile

O backend é consumido por:

* aplicação web em React
* aplicativo mobile em React Native com Expo

Ambas as interfaces utilizam os mesmos endpoints REST.

Rotas protegidas exigem envio do token JWT no header da requisição:

```txt
Authorization: Bearer <token>
```

---

## Observações

* O backend precisa estar em execução para que o frontend web e o aplicativo mobile funcionem corretamente.
* O mobile deve utilizar o IP local da máquina no `.env`, não `localhost`, quando executado em celular físico.
* As permissões são validadas no backend, mesmo que também existam bloqueios visuais no frontend e no mobile.
* O professor possui permissões administrativas.
* O aluno possui permissões limitadas de leitura e interação.

---

## Status

O backend possui:

* API REST estruturada
* autenticação JWT
* controle de acesso por perfil
* CRUD de posts
* CRUD de usuários
* comentários em posts
* respostas padronizadas
* testes automatizados
* integração com frontend web e aplicativo mobile
