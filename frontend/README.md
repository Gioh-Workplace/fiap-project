# Frontend Web - FIAP Blog

Aplicação Web desenvolvida em React para consumir a API REST do projeto FIAP Blog.

O frontend permite que professores e alunos acessem o sistema pelo navegador, com autenticação, listagem de posts, comentários e funcionalidades administrativas conforme o perfil do usuário.

---

## Objetivo

O objetivo do frontend web é fornecer uma interface para utilização do sistema FIAP Blog em ambiente desktop/web.

A aplicação permite:

- autenticar usuários
- listar posts
- buscar posts
- visualizar detalhes de posts
- comentar em posts
- gerenciar posts
- gerenciar usuários
- diferenciar permissões entre professores e alunos

---

## Tecnologias Utilizadas

- React
- Vite
- React Router
- Styled Components
- Axios
- Context API
- Vitest
- Testing Library

---

## Arquitetura

O frontend está organizado em páginas, componentes, serviços de API, contextos e estilos globais.

```txt
frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── routes/
│   ├── styles/
│   ├── tests/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
````

---

## Principais Pastas

### `api/`

Centraliza as chamadas HTTP para o backend.

Contém serviços relacionados a:

* autenticação
* posts
* usuários
* comentários

---

### `components/`

Contém componentes reutilizáveis da aplicação.

Exemplos:

* layout principal
* navbar
* protected route
* componentes visuais reutilizados nas páginas

---

### `context/`

Centraliza estados globais da aplicação.

Principais contextos:

* `AuthContext`
* `PostsContext`

---

### `pages/`

Contém as telas principais da aplicação.

Principais páginas:

* login
* home/listagem de posts
* detalhe do post
* criação de post
* edição de post
* administração de posts
* administração de usuários

---

### `routes/`

Centraliza a configuração das rotas da aplicação.

---

### `styles/`

Contém configurações visuais globais, como tema, cores e estilos compartilhados.

---

### `tests/`

Contém os testes automatizados do frontend.

---

## Autenticação

A autenticação é feita com JWT.

Fluxo:

1. O usuário informa email e senha.
2. O frontend envia os dados para o backend.
3. O backend retorna token e dados do usuário.
4. O token é armazenado no cliente.
5. As próximas requisições enviam o token automaticamente.
6. As rotas protegidas verificam se o usuário está autenticado.
7. As permissões visuais são ajustadas conforme o perfil do usuário.

---

## Controle de Acesso

O frontend utiliza controle de acesso baseado no perfil do usuário autenticado.

### Professor

O professor possui acesso às funcionalidades administrativas.

Pode realizar:

* visualizar posts em todos os status
* criar posts
* editar posts
* excluir posts
* alterar status de posts
* acessar área administrativa
* gerenciar usuários
* criar professores e alunos
* editar professores e alunos
* excluir usuários
* comentar em posts

---

### Aluno

O aluno possui acesso limitado.

Pode realizar:

* visualizar apenas posts publicados
* abrir detalhes de posts publicados
* comentar em posts
* editar ou excluir seus próprios comentários, conforme regra do sistema

O aluno não possui acesso às páginas administrativas.

---

## Funcionalidades

### Login

* autenticação com email e senha
* tratamento de erro para credenciais inválidas
* redirecionamento após login
* persistência dos dados do usuário autenticado

---

### Posts

* listagem de posts
* busca por título ou descrição
* filtro por status para professores
* visualização individual de post
* criação de post
* edição de post
* exclusão de post
* alteração de status
* ordenação por data de criação

---

### Comentários

* listagem de comentários por post
* criação de comentário
* edição de comentário
* exclusão de comentário
* controle de permissão por usuário

---

### Usuários

* listagem de usuários
* criação de usuários
* edição de usuários
* exclusão de usuários
* diferenciação entre professor e aluno

---

## Gerenciamento de Estado

O frontend utiliza Context API para centralizar estados importantes.

### `AuthContext`

Responsável por:

* armazenar usuário autenticado
* armazenar perfil do usuário
* controlar login
* controlar logout
* disponibilizar dados de autenticação para o restante da aplicação

### `PostsContext`

Responsável por:

* listar posts
* criar posts
* editar posts
* excluir posts
* atualizar a listagem após alterações
* centralizar ações relacionadas aos posts

---

## Integração com Backend

O frontend consome a API REST do backend utilizando Axios.

A URL base da API é configurada no serviço de API do projeto.

Por padrão, durante o desenvolvimento local, o backend roda em:

```txt
http://localhost:3000
```

As rotas protegidas enviam o token JWT no header da requisição:

```txt
Authorization: Bearer <token>
```

---

## Como Executar

### Instalar dependências

```bash
cd frontend
npm install
```

### Executar em modo desenvolvimento

```bash
npm run dev
```

A aplicação será executada por padrão em:

```txt
http://localhost:5173
```

---

## Build

Para gerar a versão de produção:

```bash
npm run build
```

Para visualizar o build localmente:

```bash
npm run preview
```

---

## Testes

O frontend possui testes automatizados com Vitest e Testing Library.

Os testes cobrem pontos como:

* login
* rotas protegidas
* renderização de posts
* busca de posts
* regras de exibição conforme perfil

### Executar testes

```bash
npm test
```

---

## Layout e Identidade Visual

A aplicação utiliza Styled Components para estilização.

A identidade visual segue o padrão do projeto FIAP Blog, com:

* cores em tons de laranja
* cards para exibição de posts
* layout responsivo
* feedback visual para ações do usuário
* diferenciação entre áreas comuns e administrativas

---

## Relação com o Mobile

O frontend web e o aplicativo mobile consomem a mesma API REST.

Ambos compartilham a mesma lógica central de negócio, como:

* autenticação
* permissões por perfil
* posts
* usuários
* comentários

A diferença principal está na experiência visual e na navegação de cada plataforma.

---

## Observações

* O backend precisa estar em execução para o frontend funcionar corretamente.
* Usuários alunos não acessam páginas administrativas.
* Usuários professores possuem acesso às telas de gerenciamento.
* As permissões são validadas visualmente no frontend e também protegidas no backend.
* O frontend web foi mantido como interface administrativa e de uso geral do sistema.

---

## Status

O frontend web possui:

* login funcional
* integração com API REST
* listagem e busca de posts
* detalhe de post
* comentários
* CRUD de posts
* CRUD de usuários
* área administrativa
* controle de acesso por perfil
* gerenciamento de estado com Context API
* testes automatizados
