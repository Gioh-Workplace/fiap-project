# Backend - FIAP Project

API REST responsável pelo gerenciamento de posts e autenticação de usuários.

A aplicação implementa autenticação com JWT, controle de acesso por perfil e integração com banco de dados MongoDB.

---

## 📌 Funcionalidades

* Autenticação de usuários com JWT
* Login com email e senha
* Criação de posts
* Edição de posts
* Exclusão de posts
* Listagem de posts
* Busca de posts
* Controle de acesso por perfil (professor/aluno)
* Associação automática do autor ao post
* Validação de status de posts

---

## 🧠 Arquitetura

A API segue uma estrutura organizada em camadas:

* `controllers/` → regras de negócio
* `models/` → schemas do MongoDB
* `routes/` → definição das rotas
* `middlewares/` → autenticação e autorização
* `utils/` → funções auxiliares (JWT, etc.)
* `constants/` → valores fixos da aplicação

---

## 🔐 Autenticação

A API utiliza autenticação baseada em JWT (JSON Web Token).

### Fluxo:

1. Usuário faz login via `/auth/login`
2. Backend valida credenciais
3. Um token JWT é gerado
4. O token deve ser enviado no header:

Authorization: Bearer `<token>`

### Middleware de autenticação:

* Valida o token
* Recupera o usuário
* Injeta em `req.user`

---

## 👤 Controle de acesso

O sistema utiliza roles:

### Professor

* Pode criar posts
* Pode editar posts
* Pode excluir posts

### Aluno

* Pode apenas visualizar posts

Controle feito via middleware:

* `auth` → autenticação
* `authorizeRole` → autorização por perfil

---

## 🗄️ Modelos de dados

### User

* nome
* email
* senha (hash com bcrypt)
* role (professor | aluno)

---

### Post

* titulo
* descricao
* status (rascunho | publicado | arquivado)
* autor (referência ao User)
* dtCriacao
* dtAtualizacao

---

## 🔗 Rotas principais

### Autenticação

POST /auth/login

---

### Posts

GET /posts
GET /posts/:id
POST /post
PUT /post/:id
DELETE /post/:id

---

## ⚙️ Como executar

Na pasta `backend`, execute:

npm install
npm run dev

A API ficará disponível em:

[http://localhost:3000](http://localhost:3000)

---

## 🔧 Variáveis de ambiente

Crie um arquivo `.env` na raiz do backend:

JWT_SECRET=sua_chave_secreta

---

## 🧪 Usuários de teste

### Professor

Email: [professor@teste.com](mailto:professor@teste.com)
Senha: 123456

### Aluno

Email: [aluno@teste.com](mailto:aluno@teste.com)
Senha: 123456

*(Certifique-se de que as senhas estejam salvas com hash no banco)*

---

## 🔐 Segurança

* Senhas armazenadas com hash (bcrypt)
* Autenticação via token JWT
* Rotas protegidas por middleware
* Dados sensíveis não retornados (ex: senha)

---

## 📌 Observações

* O campo `autor` do post é definido automaticamente a partir do usuário autenticado
* O frontend não envia o autor
* O populate é utilizado para retornar dados do usuário nos posts
* A API segue padrão REST

---
