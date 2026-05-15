import { vi } from "vitest"
import { screen, waitFor, fireEvent } from "@testing-library/react"
import { renderWithProviders } from "./testUtils"
import Home from "../pages/Home"

const mockNavigate = vi.fn()
const mockFetchPosts = vi.fn()

let mockPosts = []

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: "/",
      state: {},
    }),
  }
})

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    role: "professor",
  }),
}))

vi.mock("../context/PostsContext", () => ({
  usePosts: () => ({
    posts: mockPosts,
    loading: false,
    error: "",
    fetchPosts: mockFetchPosts,
  }),
}))

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPosts = []
  })

  it("renderiza posts vindos do contexto", async () => {
    mockPosts = [
      {
        _id: "1",
        titulo: "Primeiro Post",
        descricao: "Descrição do primeiro",
        status: "publicado",
        dtCriacao: "2026-03-20T10:00:00.000Z",
        autor: { nome: "Professor A" },
      },
      {
        _id: "2",
        titulo: "Segundo Post",
        descricao: "Descrição do segundo",
        status: "rascunho",
        dtCriacao: "2026-03-21T10:00:00.000Z",
        autor: { nome: "Professor B" },
      },
    ]

    renderWithProviders(<Home />)

    await waitFor(() => {
      expect(screen.getByText("Primeiro Post")).toBeInTheDocument()
      expect(screen.getByText("Segundo Post")).toBeInTheDocument()
    })

    expect(mockFetchPosts).toHaveBeenCalled()
  })

  it("filtra posts pela busca", async () => {
    mockPosts = [
      {
        _id: "1",
        titulo: "React Avançado",
        descricao: "Post sobre React",
        status: "publicado",
        dtCriacao: "2026-03-20T10:00:00.000Z",
        autor: { nome: "Professor A" },
      },
      {
        _id: "2",
        titulo: "Node Básico",
        descricao: "Post sobre Node",
        status: "publicado",
        dtCriacao: "2026-03-21T10:00:00.000Z",
        autor: { nome: "Professor B" },
      },
    ]

    renderWithProviders(<Home />)

    await waitFor(() => {
      expect(screen.getByText("React Avançado")).toBeInTheDocument()
      expect(screen.getByText("Node Básico")).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/buscar/i)

    fireEvent.change(searchInput, {
      target: { value: "react" },
    })

    expect(screen.getByText("React Avançado")).toBeInTheDocument()
    expect(screen.queryByText("Node Básico")).not.toBeInTheDocument()
  })
})