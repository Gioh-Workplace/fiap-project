# Frontend - FIAP Project

Aplicação React responsável pela interface do usuário do sistema de gerenciamento de posts.

Este frontend consome a API do backend, implementa autenticação com JWT, controle de acesso por perfil e navegação entre as páginas do sistema.

---

## 📌 Funcionalidades

* Login com autenticação JWT
* Persistência de sessão
* Listagem de posts em grid
* Busca por posts
* Filtro por status para professores
* Visualização individual de post
* Criação de post
* Edição de post
* Exclusão de post
* Página administrativa
* Controle de acesso por perfil (professor/aluno)
* Toasts para feedback de sucesso e erro
* Modal de confirmação para exclusão
* Layout responsivo

---

## 🧠 Arquitetura

O frontend está organizado em camadas para facilitar manutenção e escalabilidade:

* `pages/` → telas da aplicação
* `components/` → componentes reutilizáveis
* `api/` → integração com a API REST
* `context/` → gerenciamento global de autenticação
* `routes/` → proteção de rotas
* `styles/` → tema e estilos globais

---

## 🔐 Autenticação

O login é feito consumindo a rota `/auth/login` do backend.

Após autenticação:

* o token JWT é salvo no `localStorage`
* os dados do usuário também são persistidos
* o Axios envia automaticamente o token no header `Authorization`

Exemplo de header enviado:

Authorization: Bearer `<token>`

---

## 👤 Perfis de acesso

### Professor

* Pode criar posts
* Pode editar posts
* Pode excluir posts
* Pode acessar a página administrativa
* Pode alterar status dos posts

### Aluno

* Pode visualizar apenas posts publicados
* Não possui acesso à área administrativa
* Não pode criar, editar ou excluir posts

---

## 📂 Estrutura de pastas

frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── routes/
│   └── styles/
├── package.json
└── vite.config.js

---

## ⚙️ Como executar

Na pasta `frontend`, execute:

npm install
npm run dev

A aplicação ficará disponível em:

[http://localhost:5173](http://localhost:5173)

---

## 🌐 Integração com o backend

O frontend espera que o backend esteja rodando em:

[http://localhost:3000](http://localhost:3000)

As principais rotas consumidas são:

* `POST /auth/login`
* `GET /posts`
* `GET /posts/:id`
* `POST /post`
* `PUT /post/:id`
* `DELETE /post/:id`

---

## 🎨 Estilo visual

A aplicação utiliza:

* Styled Components
* tema global centralizado
* layout baseado em cards/post-its para exibição dos posts
* navbar global para navegação e ações principais

---

## 📱 Responsividade

A interface foi ajustada para funcionar em:

* Desktop
* Tablet
* Mobile

---

## 📌 Observações

* O frontend depende do backend autenticado com JWT
* O controle de acesso é feito tanto por proteção de rotas quanto por renderização condicional de elementos da interface
* O autor dos posts é definido pelo backend com base no usuário autenticado

---
