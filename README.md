# FIAP Project - Sistema de Gerenciamento de Posts

Aplicação full stack para gerenciamento de posts, com autenticação de usuários e controle de acesso por perfil (professor/aluno).

O sistema permite criar, visualizar, editar e excluir posts, com regras de acesso baseadas no tipo de usuário.

Desenvolvido com React no frontend e Node.js + MongoDB no backend.

---

## 🧱 Arquitetura do Projeto

O projeto está organizado em duas aplicações principais:

* `frontend/` → Aplicação React (interface do usuário)
* `backend/` → API REST com Node.js e MongoDB

A comunicação entre frontend e backend é feita via requisições HTTP (REST API).

---

## 🚀 Tecnologias Utilizadas

### Frontend

* React
* React Router
* Styled Components
* Axios
* Context API

### Backend

* Node.js
* Express
* MongoDB (Mongoose)
* JWT (Autenticação)
* bcrypt (Hash de senha)

### DevOps

* GitHub Actions (CI)

---

## 🔐 Autenticação e Autorização

O sistema utiliza autenticação baseada em JWT (JSON Web Token).

* Login com email e senha
* Token armazenado no frontend (localStorage)
* Enviado automaticamente nas requisições via header Authorization

Controle de acesso por perfil:

### Professor

* Criar posts
* Editar posts
* Excluir posts
* Acessar área administrativa

### Aluno

* Visualizar apenas posts publicados

---

## ⚙️ Como executar o projeto

### Backend

cd backend
npm install
npm run dev

---

### Frontend

cd frontend
npm install
npm run dev

---

### Endereços

Frontend:
[http://localhost:5173](http://localhost:5173)

Backend:
[http://localhost:3000](http://localhost:3000)

---

## 🧪 Usuários de Teste

### Professor

Email: [professor@teste.com](mailto:professor@teste.com)
Senha: 123456

### Aluno

Email: [aluno@teste.com](mailto:aluno@teste.com)
Senha: 123456

---

## 📌 Funcionalidades

* Login com autenticação JWT
* Persistência de sessão
* Listagem de posts (Home)
* Busca e filtro de posts
* Visualização de post
* Criação de post
* Edição de post
* Exclusão de post
* Página administrativa
* Controle de acesso por perfil
* Feedback visual (toasts)
* Interface responsiva

---

## 📂 Estrutura do Projeto

fiap-project/
├── backend/
├── frontend/
└── .github/

