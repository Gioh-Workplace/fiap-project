
# Mobile - FIAP Blog

Aplicativo mobile desenvolvido em React Native com Expo para consumir a API REST do projeto FIAP Blog.

O app permite que alunos e professores acessem o sistema pelo celular, com autenticação, visualização de posts, comentários e funcionalidades administrativas para professores.

---

## Objetivo

O objetivo da aplicação mobile é disponibilizar uma interface para consumo dos posts educacionais do sistema, permitindo:

- Visualização de posts publicados
- Busca por posts
- Leitura completa de postagens
- Comentários em posts
- Autenticação de usuários
- Controle de acesso por perfil
- Administração de posts por professores
- Administração de usuários por professores

A aplicação mobile consome os mesmos endpoints REST utilizados pelo frontend web.

---

## Tecnologias Utilizadas

- React Native
- Expo
- Expo Router
- Styled Components
- Axios
- AsyncStorage
- Context API
- Jest
- React Native Testing Library

---

## Arquitetura

O app mobile está organizado em rotas, contextos, componentes reutilizáveis e serviços de API.

```txt
mobile/
├── app/
│   ├── index.jsx
│   ├── home.jsx
│   ├── posts/
│   │   ├── create.jsx
│   │   ├── [id].jsx
│   │   └── [id]/
│   │       └── edit.jsx
│   └── users/
│       ├── index.jsx
│       ├── create.jsx
│       └── [id]/
│           └── edit.jsx
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── tests/
│   └── utils/
├── .env.example
├── package.json
└── README.md
````

---

## Principais Pastas

### `app/`

Contém as telas e rotas da aplicação, utilizando Expo Router.

Principais telas:

* `index.jsx` - tela de login
* `home.jsx` - listagem de posts
* `posts/[id].jsx` - detalhe do post
* `posts/create.jsx` - criação de post
* `posts/[id]/edit.jsx` - edição de post
* `users/index.jsx` - listagem de usuários
* `users/create.jsx` - criação de usuário
* `users/[id]/edit.jsx` - edição de usuário

### `src/api/`

Centraliza as chamadas HTTP para o backend.

Contém serviços para:

* autenticação
* posts
* comentários
* usuários

### `src/context/`

Centraliza o gerenciamento de estado da aplicação.

Contextos principais:

* `AuthContext`
* `PostsContext`
* `ViewModeContext`

### `src/components/`

Componentes reutilizáveis da aplicação.

Exemplos:

* `AppHeader`
* `BottomNav`

### `src/utils/`

Funções utilitárias do app, como geração de cores para posts e perfis.

### `src/tests/`

Testes automatizados do aplicativo mobile.

---

## Autenticação

A autenticação é feita com JWT.

Fluxo de autenticação:

1. Usuário informa email e senha.
2. O app envia os dados para o backend.
3. O backend retorna o token JWT e os dados do usuário.
4. O token é salvo no AsyncStorage.
5. As próximas requisições enviam o token no header de autorização.
6. O backend valida o token e as permissões do usuário.

---

## Perfis de Usuário

O sistema possui dois perfis principais:

### Professor

O professor possui acesso às funcionalidades administrativas.

Pode realizar:

* visualizar posts em todos os status
* criar posts
* editar posts
* excluir posts
* alterar status de posts
* comentar em posts
* gerenciar usuários
* criar professores e alunos
* editar professores e alunos
* excluir usuários
* alternar entre modo padrão e modo admin

### Aluno

O aluno possui acesso limitado à leitura e interação.

Pode realizar:

* visualizar apenas posts publicados
* abrir detalhes de posts publicados
* comentar em posts
* editar ou excluir os próprios comentários, conforme regra do sistema

O aluno não possui acesso ao modo admin nem às funcionalidades administrativas.

---

## Modos de Visualização

O app mobile possui dois modos de visualização para professores.

### Modo Padrão

Modo focado na leitura dos posts.

Características:

* visualização limpa
* ausência da navbar administrativa
* foco na leitura dos posts
* ações administrativas ficam fora da listagem
* alunos permanecem sempre nesse modo

### Modo Admin

Modo disponível apenas para professores.

Características:

* exibe navbar inferior
* permite acesso à gestão de posts e usuários
* exibe ações rápidas nos cards de posts
* permite editar e excluir posts pela listagem
* permite alterar status do post por modal
* exibe botão para criação de novo post
* utiliza detalhes visuais em azul para diferenciar da visualização padrão

Ao sair do modo admin, o professor é redirecionado para a tela de posts.

---

## Gerenciamento de Estado

O app utiliza Context API para controlar estados globais.

### `AuthContext`

Responsável por:

* login
* logout
* persistência do token
* carregamento do usuário autenticado
* controle do perfil do usuário
* armazenamento do token no AsyncStorage

### `PostsContext`

Responsável por:

* listagem de posts
* busca de post por id
* criação de post
* edição de post
* exclusão de post
* atualização do estado local após alterações
* controle do post selecionado

### `ViewModeContext`

Responsável por:

* controlar o modo de visualização atual
* alternar entre modo padrão e modo admin
* impedir que alunos acessem o modo admin
* garantir que apenas professores possam alternar o modo de visualização

---

## Funcionalidades

### Login

* autenticação com email e senha
* persistência de sessão
* redirecionamento para a Home após login
* tratamento de erro para credenciais inválidas

### Posts

* listagem de posts
* busca por título ou descrição
* visualização de detalhe do post
* criação de post
* edição de post
* exclusão de post
* alteração rápida de status
* diferenciação visual por cor de post

### Comentários

* listagem de comentários por post
* criação de comentário
* edição de comentário
* exclusão de comentário
* controle de permissão por usuário

### Usuários

* listagem de usuários
* filtro por professor ou aluno
* criação de usuário
* edição de usuário
* exclusão de usuário
* diferenciação visual entre professor e aluno

---

## Configuração do Ambiente

Crie um arquivo `.env` na raiz da pasta `mobile/`.

Exemplo:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_DA_MAQUINA:3000
```

Exemplo real em rede local:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000
```

Em celular físico, `localhost` aponta para o próprio celular, não para o computador.
Por isso, é necessário usar o IP local da máquina onde o backend está rodando.

O projeto possui um arquivo `.env.example` como referência.

---

## Como Executar

### Instalar dependências

```bash
cd mobile
npm install
```

### Executar com Expo

```bash
npx expo start
```

Também é possível usar:

```bash
npm run android
npm run ios
npm run web
```

Para testar em celular físico:

1. Inicie o backend.
2. Configure o `.env` com o IP local da máquina.
3. Execute `npx expo start`.
4. Leia o QR Code com o aplicativo Expo Go.

---

## Testes

O app mobile possui testes automatizados com Jest e React Native Testing Library.

Os testes cobrem:

* `ViewModeContext`
* `BottomNav`
* `Home`
* `AppHeader`

Principais validações:

* professor alterna entre modo padrão e modo admin
* aluno permanece sempre no modo padrão
* navbar aparece apenas para professor em modo admin
* aluno visualiza apenas posts publicados
* professor visualiza posts em todos os status
* ações administrativas aparecem apenas no modo admin
* botão de logout e botão de voltar funcionam no header

### Executar testes

```bash
npm test
```

---

## Integração com Backend

O aplicativo mobile consome a API REST do backend.

Principais recursos consumidos:

* autenticação
* posts
* comentários
* usuários

Todas as rotas protegidas enviam o token JWT no header da requisição.

---

## Observações

* O backend precisa estar em execução para o app funcionar corretamente.
* O IP configurado no `.env` deve estar acessível pelo celular ou emulador.
* O usuário aluno não possui acesso às rotas administrativas.
* As permissões são validadas tanto no aplicativo quanto no backend.
* O modo admin é uma camada de experiência visual para professores, não substitui a autorização do backend.

---

## Status

A aplicação mobile possui:

* login funcional
* integração com API REST
* listagem e busca de posts
* detalhe de post
* comentários
* CRUD de posts para professores
* CRUD de usuários para professores
* modo padrão/admin
* gerenciamento de estado com Context API
* testes automatizados

