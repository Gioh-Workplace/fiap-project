import React from "react"
import { render, screen } from "@testing-library/react-native"
import HomeScreen from "../../app/home"

let mockRole = "professor"
let mockIsAdminView = false
let mockPathname = "/home"

const mockFetchPosts = jest.fn()
const mockDeletePost = jest.fn()
const mockUpdatePost = jest.fn()

const mockPosts = [
  {
    _id: "1",
    titulo: "Post Publicado",
    descricao: "Descrição do post publicado",
    status: "publicado",
    autor: { nome: "Professor A" },
  },
  {
    _id: "2",
    titulo: "Post Rascunho",
    descricao: "Descrição do post rascunho",
    status: "rascunho",
    autor: { nome: "Professor B" },
  },
  {
    _id: "3",
    titulo: "Post Arquivado",
    descricao: "Descrição do post arquivado",
    status: "arquivado",
    autor: { nome: "Professor C" },
  },
]

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
  usePathname: () => mockPathname,
}))

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    role: mockRole,
    user: {
      nome: "Usuário Teste",
      email: "teste@teste.com",
    },
    logout: jest.fn(),
  }),
}))

jest.mock("../context/PostsContext", () => ({
  usePosts: () => ({
    posts: mockPosts,
    loading: false,
    error: "",
    fetchPosts: mockFetchPosts,
    deletePost: mockDeletePost,
    updatePost: mockUpdatePost,
  }),
}))

jest.mock("../context/ViewModeContext", () => ({
  useViewMode: () => ({
    isAdminView: mockIsAdminView,
    toggleViewMode: jest.fn(),
  }),
}))

jest.mock("../utils/colors", () => ({
  getPostColor: () => ({
    background: "#fff7ef",
    border: "#ffd6ad",
  }),
  getRoleColor: () => ({
    background: "#fff7ef",
    border: "#ffd6ad",
    text: "#ff7900",
  }),
}))

describe("Home mobile", () => {
  beforeEach(() => {
    mockRole = "professor"
    mockIsAdminView = false
    mockPathname = "/home"
    jest.clearAllMocks()
  })

  it("aluno visualiza apenas posts publicados", () => {
    mockRole = "aluno"

    render(<HomeScreen />)

    expect(screen.getByText("Post Publicado")).toBeTruthy()
    expect(screen.queryByText("Post Rascunho")).toBeNull()
    expect(screen.queryByText("Post Arquivado")).toBeNull()
  })

  it("professor visualiza posts em todos os status", () => {
    mockRole = "professor"

    render(<HomeScreen />)

    expect(screen.getByText("Post Publicado")).toBeTruthy()
    expect(screen.getByText("Post Rascunho")).toBeTruthy()
    expect(screen.getByText("Post Arquivado")).toBeTruthy()
  })

  it("não mostra ações administrativas no modo padrão", () => {
    mockRole = "professor"
    mockIsAdminView = false

    render(<HomeScreen />)

    expect(screen.queryByText("Novo Post")).toBeNull()
    expect(screen.queryByText("Editar")).toBeNull()
    expect(screen.queryByText("Excluir")).toBeNull()
  })

  it("mostra ações administrativas no modo admin", () => {
    mockRole = "professor"
    mockIsAdminView = true

    render(<HomeScreen />)

    expect(screen.getByText("Novo Post")).toBeTruthy()
    expect(screen.getAllByText("Editar").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Excluir").length).toBeGreaterThan(0)
  })

  it("chama fetchPosts ao carregar a tela", () => {
    render(<HomeScreen />)

    expect(mockFetchPosts).toHaveBeenCalled()
  })
})