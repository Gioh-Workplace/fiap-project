
# FIAP Project - Sistema de Gerenciamento de Posts

Aplicação full stack para gerenciamento de posts educacionais, com autenticação de usuários, controle de acesso por perfil e interfaces Web e Mobile.

O sistema permite que professores criem, editem, excluam e administrem postagens e usuários, enquanto alunos podem visualizar posts publicados e interagir por meio de comentários.

Desenvolvido com React no frontend web, React Native com Expo no aplicativo mobile e Node.js + MongoDB no backend.

---

## Arquitetura do Projeto

O projeto está organizado em três aplicações principais:

- `frontend/` → Aplicação Web em React
- `mobile/` → Aplicação Mobile em React Native com Expo
- `backend/` → API REST com Node.js, Express e MongoDB

A comunicação entre as interfaces e o backend é feita via requisições HTTP para a API REST.

O backend centraliza as regras de autenticação, autorização, usuários, posts e comentários.  
O frontend web e o aplicativo mobile consomem os mesmos endpoints, respeitando as permissões de cada tipo de usuário.

---

## Tecnologias Utilizadas

### Frontend Web

- React
- Vite
- React Router
- Styled Components
- Axios
- Context API
- Vitest

### Mobile

- React Native
- Expo
- Expo Router
- Styled Components
- Axios
- AsyncStorage
- Context API
- Jest
- React Native Testing Library

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- Jest
- Supertest

### DevOps

- GitHub Actions para execução automatizada dos testes
- Concurrently para execução simultânea de backend e frontend web

---

## Autenticação e Autorização

O sistema utiliza autenticação baseada em JWT.

- Login com email e senha
- Geração de token JWT no backend
- Armazenamento do token no cliente
- Envio automático do token nas requisições autenticadas
- Proteção de rotas no backend por middleware
- Controle de acesso por perfil de usuário

### Professor

O usuário professor possui acesso às funcionalidades administrativas.

Pode realizar:

- Criar posts
- Editar posts
- Excluir posts
- Alterar status dos posts
- Visualizar posts em diferentes status
- Gerenciar usuários
- Criar professores e alunos
- Editar professores e alunos
- Excluir usuários
- Comentar em posts
- Acessar a visualização administrativa no aplicativo mobile

### Aluno

O usuário aluno possui acesso limitado às funcionalidades de leitura e interação.

Pode realizar:

- Visualizar apenas posts publicados
- Abrir detalhes de um post
- Criar comentários
- Editar ou excluir seus próprios comentários, conforme regra do sistema
- Não possui acesso às funcionalidades administrativas

---

## Funcionalidades

- Login com autenticação JWT
- Persistência de sessão
- Controle de acesso por perfil
- Listagem de posts
- Busca de posts por palavra-chave
- Visualização individual de post
- Criação de post
- Edição de post
- Exclusão de post
- Alteração de status de post
- Comentários em posts
- CRUD de usuários
- Cadastro de professores
- Cadastro de alunos
- Área administrativa na Web
- Modo Admin no aplicativo Mobile
- Feedback visual para ações do usuário
- Interface responsiva na Web
- Interface Mobile com experiência diferenciada por perfil

---

## Aplicação Mobile

O aplicativo mobile foi desenvolvido com React Native e Expo para atender à etapa mobile do projeto.

A aplicação mobile possui duas experiências principais para professores:

### Modo Padrão

Visualização focada na leitura dos posts.

- Lista os posts
- Permite abrir detalhes
- Mantém a experiência próxima à do aluno
- Oculta a navegação administrativa

### Modo Admin

Visualização focada em gerenciamento.

- Disponível apenas para professores
- Exibe navegação inferior
- Permite acesso à gestão de posts e usuários
- Exibe ações rápidas nos cards de posts
- Permite alteração rápida de status por modal
- Utiliza identidade visual levemente azulada para diferenciar da visualização padrão

Alunos permanecem sempre no modo padrão.

---

## Gerenciamento de Estado

O projeto utiliza Context API para centralizar estados importantes da aplicação.

### Frontend Web

- `AuthContext` → autenticação, usuário logado e perfil
- `PostsContext` → listagem, criação, edição e exclusão de posts

### Mobile

- `AuthContext` → autenticação, token, usuário logado e perfil
- `PostsContext` → listagem, criação, edição, exclusão e seleção de posts
- `ViewModeContext` → alternância entre modo padrão e modo admin

---

## Como Executar o Projeto

### Instalar dependências da raiz

```bash
npm install
````

### Executar backend e frontend juntos

```bash
npm run dev
```

Esse comando executa backend e frontend web ao mesmo tempo.

---

### Backend

```bash
cd backend
npm install
npm run dev
```

---

### Frontend Web

```bash
cd frontend
npm install
npm run dev
```

---

### Mobile

```bash
cd mobile
npm install
npx expo start
```

Para utilizar o aplicativo em um celular físico, configure a URL da API no arquivo `.env` do projeto mobile usando o IP local da máquina onde o backend está rodando.

Exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000
```

---

## Endereços

Frontend Web:

```txt
http://localhost:5173
```

Backend API:

```txt
http://localhost:3000
```

Mobile:

```txt
Executado via Expo Go ou emulador Android/iOS
```

---

## Testes

### Backend

```bash
cd backend
npm test
```

### Frontend Web

```bash
cd frontend
npm test
```

### Mobile
```bash
cd mobile
npm test
```

O projeto também possui integração com GitHub Actions para execução automatizada dos testes.

---

## Usuários de Teste

### Professor

```txt
Email: professor@teste.com
Senha: 123456
```

### Aluno

```txt
Email: aluno@teste.com
Senha: 123456
```

---

## Estrutura do Projeto

```txt
fiap-project/
├── backend/
├── frontend/
├── mobile/
├── .github/
├── package.json
└── README.md
```

---

## Status do Projeto

O projeto conta com:

- Backend estruturado em API REST
- Frontend Web funcional
- Aplicativo Mobile funcional
- Autenticação e autorização por perfil
- CRUD de posts
- CRUD de usuários
- Comentários em posts
- Gerenciamento de estado com Context API
- Testes automatizados no backend
- Testes automatizados no frontend web
- Testes automatizados no app mobile
- Pipeline de CI com GitHub Actions

