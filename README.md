# FIAP Project – API REST com Node.js, MongoDB, Testes e Docker

Este projeto é uma **API REST** desenvolvida em **Node.js** utilizando **Express**, **MongoDB**, **Jest** para testes automatizados, **Docker** para containerização e **GitHub Actions** para integração contínua.

O objetivo do projeto é consolidar boas práticas de desenvolvimento backend, incluindo arquitetura organizada, testes, automação e ambiente reproduzível.

---

## Tecnologias Utilizadas

* **Node.js** (ESM)
* **Express**
* **MongoDB** + **Mongoose**
* **Jest** + **Supertest** (testes automatizados)
* **Docker** e **Docker Compose**
* **GitHub Actions**
* **ESLint / boas práticas de código**

---

## Funcionalidades da API

### Posts

* Criar post (apenas professores)
* Listar posts
* Listar post por ID
* Buscar posts por texto
* Atualizar post (apenas professores)
* Deletar post (apenas professores)

### Regras de Acesso

* **Professor** pode criar, editar e remover posts
* **Aluno** pode apenas visualizar posts publicados
* Controle de acesso feito por middleware

---

## Estrutura do Projeto

```
src/
├── app.js
├── controllers/
├── routes/
├── middlewares/
├── models/
├── utils/
├── constants/
├── tests/
│   ├── __mocks__/
│   ├── post.test.js
│   └── setupTests.js
├── seeds/
│   └── postSeed.js
config/
server.js
Dockerfile
docker-compose.yml
jest.config.js
```

---

## Instalação e Execução Local (sem Docker)

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd fiap-project
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env`:

```env
DB_CONNECTION_STRING=mongodb://localhost:27017/fiap-project
NODE_ENV=development
```

### 4. Iniciar a aplicação

```bash
npm start
```

A API estará disponível em:

```
http://localhost:3000
```

---

## Executando com Docker (Recomendado)

### 1. Subir os containers

```bash
docker-compose up --build
```

Isso irá:

* Subir a API Node.js
* Subir o MongoDB
* Conectar automaticamente os serviços
* Executar o seed inicial (em ambiente development)

### 2. Acessar a API

```
http://localhost:3000/posts
```

---

## Seed de Dados

O projeto possui um **seed automático** que:

* Roda apenas em ambiente `development`
* Insere posts iniciais no MongoDB caso a coleção esteja vazia

Arquivo:

```
src/seeds/postSeed.js
```

---

## Testes Automatizados

### Executar testes

```bash
npm test
```

### O que é testado

* Criação de posts com permissões
* Listagem de posts para aluno
* Regras de autorização
* Rotas da API

Mocks são utilizados para:

* Controllers
* Middlewares
* Banco de dados

---

## Integração Contínua (CI)

O projeto utiliza **GitHub Actions** para:

* Instalar dependências
* Rodar testes automaticamente
* Garantir que o código não quebre a aplicação

Pipeline configurado em:

```
.github/workflows/
```

---

## Boas Práticas Aplicadas

* Separação clara de responsabilidades
* Middlewares reutilizáveis
* Testes automatizados com mocks
* Docker para ambiente padronizado
* CI para validação automática
* Código em ES Modules

---

## Próximos Passos (Evoluções Possíveis)

* Autenticação real com JWT
* Persistência de usuários
* Paginação de resultados
* Documentação com Swagger
* Deploy em ambiente cloud

---

## Autor

Projeto desenvolvido para fins acadêmicos no curso da **FIAP**, com foco em backend moderno, testes e DevOps.


* Escrever uma seção “Como rodar os testes no CI”
* Revisar para padrões de entrega FIAP

Só me dizer.
