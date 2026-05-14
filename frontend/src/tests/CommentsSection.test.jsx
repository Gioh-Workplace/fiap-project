import { vi } from "vitest"
import { screen, waitFor, fireEvent } from "@testing-library/react"
import { renderWithProviders } from "./testUtils"
import CommentsSection from "../components/CommentsSection"

const mockGetCommentsByPost = vi.fn()
const mockCreateComment = vi.fn()
const mockUpdateComment = vi.fn()
const mockDeleteComment = vi.fn()

let mockAuth = {
  user: { id: "user1", nome: "Aluno Teste" },
  role: "aluno",
}

vi.mock("../api/comments", () => ({
  getCommentsByPost: (...args) => mockGetCommentsByPost(...args),
  createComment: (...args) => mockCreateComment(...args),
  updateComment: (...args) => mockUpdateComment(...args),
  deleteComment: (...args) => mockDeleteComment(...args),
}))

vi.mock("../context/AuthContext", () => ({
  useAuth: () => mockAuth,
}))

describe("CommentsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockAuth = {
      user: { id: "user1", nome: "Aluno Teste" },
      role: "aluno",
    }

    mockGetCommentsByPost.mockResolvedValue([
      {
        _id: "comment1",
        conteudo: "Comentário do usuário logado",
        createdAt: "2026-03-20T10:00:00.000Z",
        autor: {
          _id: "user1",
          nome: "Aluno Teste",
          role: "aluno",
        },
      },
      {
        _id: "comment2",
        conteudo: "Comentário de outro usuário",
        createdAt: "2026-03-21T10:00:00.000Z",
        autor: {
          _id: "user2",
          nome: "Outro Aluno",
          role: "aluno",
        },
      },
    ])
  })

  it("renderiza comentários vindos da API", async () => {
    renderWithProviders(<CommentsSection postId="post1" />)

    await waitFor(() => {
      expect(screen.getByText("Comentário do usuário logado")).toBeInTheDocument()
      expect(screen.getByText("Comentário de outro usuário")).toBeInTheDocument()
    })

    expect(mockGetCommentsByPost).toHaveBeenCalledWith("post1")
  })

  it("cria um novo comentário", async () => {
    mockCreateComment.mockResolvedValue({
      _id: "comment3",
      conteudo: "Novo comentário criado",
      createdAt: "2026-03-22T10:00:00.000Z",
      autor: {
        _id: "user1",
        nome: "Aluno Teste",
        role: "aluno",
      },
    })

    renderWithProviders(<CommentsSection postId="post1" />)

    const textarea = screen.getByPlaceholderText("Escreva um comentário...")

    fireEvent.change(textarea, {
      target: { value: "Novo comentário criado" },
    })

    fireEvent.click(screen.getByRole("button", { name: /comentar/i }))

    await waitFor(() => {
      expect(mockCreateComment).toHaveBeenCalledWith("post1", {
        conteudo: "Novo comentário criado",
      })
    })

    await waitFor(() => {
      expect(screen.getByText("Novo comentário criado")).toBeInTheDocument()
    })
  })

  it("mostra botões de editar e excluir para comentário próprio", async () => {
    renderWithProviders(<CommentsSection postId="post1" />)

    await waitFor(() => {
      expect(screen.getByText("Comentário do usuário logado")).toBeInTheDocument()
    })

    const editButtons = screen.getAllByRole("button", { name: /editar/i })
    const deleteButtons = screen.getAllByRole("button", { name: /excluir/i })

    expect(editButtons.length).toBe(1)
    expect(deleteButtons.length).toBe(1)
  })

  it("não mostra editar e excluir para comentário de outro usuário quando logado como aluno", async () => {
    renderWithProviders(<CommentsSection postId="post1" />)

    await waitFor(() => {
      expect(screen.getByText("Comentário de outro usuário")).toBeInTheDocument()
    })

    const editButtons = screen.getAllByRole("button", { name: /editar/i })
    const deleteButtons = screen.getAllByRole("button", { name: /excluir/i })

    expect(editButtons.length).toBe(1)
    expect(deleteButtons.length).toBe(1)
  })

  it("mostra editar e excluir para todos os comentários quando logado como professor", async () => {
    mockAuth = {
      user: { id: "professor1", nome: "Professor Teste" },
      role: "professor",
    }

    renderWithProviders(<CommentsSection postId="post1" />)

    await waitFor(() => {
      expect(screen.getByText("Comentário do usuário logado")).toBeInTheDocument()
      expect(screen.getByText("Comentário de outro usuário")).toBeInTheDocument()
    })

    const editButtons = screen.getAllByRole("button", { name: /editar/i })
    const deleteButtons = screen.getAllByRole("button", { name: /excluir/i })

    expect(editButtons.length).toBe(2)
    expect(deleteButtons.length).toBe(2)
  })

  it("edita um comentário próprio", async () => {
    mockUpdateComment.mockResolvedValue({
      _id: "comment1",
      conteudo: "Comentário atualizado",
      createdAt: "2026-03-20T10:00:00.000Z",
      autor: {
        _id: "user1",
        nome: "Aluno Teste",
        role: "aluno",
      },
    })

    renderWithProviders(<CommentsSection postId="post1" />)

    await waitFor(() => {
      expect(screen.getByText("Comentário do usuário logado")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole("button", { name: /editar/i }))

    const textareas = screen.getAllByRole("textbox")
    const editTextarea = textareas.find(
      (textarea) => textarea.value === "Comentário do usuário logado"
    )

    fireEvent.change(editTextarea, {
      target: { value: "Comentário atualizado" },
    })

    fireEvent.click(screen.getByRole("button", { name: /salvar/i }))

    await waitFor(() => {
      expect(mockUpdateComment).toHaveBeenCalledWith("comment1", {
        conteudo: "Comentário atualizado",
      })
    })

    await waitFor(() => {
      expect(screen.getByText("Comentário atualizado")).toBeInTheDocument()
    })
  })

  it("abre modal e exclui comentário", async () => {
    mockDeleteComment.mockResolvedValue({
      success: true,
      message: "Comentário deletado com sucesso.",
    })
  
    renderWithProviders(<CommentsSection postId="post1" />)
  
    await waitFor(() => {
      expect(screen.getByText("Comentário do usuário logado")).toBeInTheDocument()
    })
  
    fireEvent.click(screen.getByRole("button", { name: /excluir/i }))
  
    await waitFor(() => {
      expect(screen.getByText("Excluir comentário")).toBeInTheDocument()
    })
  
    fireEvent.click(screen.getByRole("button", { name: /confirmar/i }))
  
    await waitFor(() => {
      expect(mockDeleteComment).toHaveBeenCalledWith("comment1")
    })
  
    await waitFor(() => {
      expect(screen.queryByText("Comentário do usuário logado")).not.toBeInTheDocument()
    })
  })
})