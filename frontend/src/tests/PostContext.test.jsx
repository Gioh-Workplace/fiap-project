import { vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { PostsProvider, usePosts } from "../context/PostsContext"

const mockGetPosts = vi.fn()
const mockGetPostById = vi.fn()
const mockCreatePost = vi.fn()
const mockUpdatePost = vi.fn()
const mockDeletePost = vi.fn()

vi.mock("../api/posts", () => ({
  getPosts: (...args) => mockGetPosts(...args),
  getPostById: (...args) => mockGetPostById(...args),
  createPost: (...args) => mockCreatePost(...args),
  updatePost: (...args) => mockUpdatePost(...args),
  deletePost: (...args) => mockDeletePost(...args),
}))

function TestComponent() {
  const {
    posts,
    selectedPost,
    loading,
    error,
    fetchPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
  } = usePosts()

  return (
    <div>
      <p data-testid="loading">{loading ? "true" : "false"}</p>
      <p data-testid="error">{error}</p>
      <p data-testid="posts">{posts.map((post) => post.titulo).join(" | ")}</p>
      <p data-testid="selected-post">{selectedPost?.titulo || ""}</p>

      <button type="button" onClick={() => fetchPosts()}>
        Buscar posts
      </button>

      <button type="button" onClick={() => fetchPostById("1")}>
        Buscar post por id
      </button>

      <button
        type="button"
        onClick={() =>
          createPost({
            titulo: "Novo Post",
            descricao: "Descrição do novo post",
            status: "rascunho",
          })
        }
      >
        Criar post
      </button>

      <button
        type="button"
        onClick={() =>
          updatePost("1", {
            titulo: "Post Atualizado",
            descricao: "Descrição atualizada",
            status: "publicado",
          })
        }
      >
        Atualizar post
      </button>

      <button type="button" onClick={() => deletePost("1")}>
        Excluir post
      </button>
    </div>
  )
}

function renderPostsContext() {
  return render(
    <PostsProvider>
      <TestComponent />
    </PostsProvider>
  )
}

describe("PostsContext", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("carrega e ordena posts com fetchPosts", async () => {
    mockGetPosts.mockResolvedValue([
      {
        _id: "1",
        titulo: "Post Antigo",
        descricao: "Descrição 1",
        status: "publicado",
        dtCriacao: "2026-03-20T10:00:00.000Z",
      },
      {
        _id: "2",
        titulo: "Post Novo",
        descricao: "Descrição 2",
        status: "publicado",
        dtCriacao: "2026-03-21T10:00:00.000Z",
      },
    ])

    renderPostsContext()

    fireEvent.click(screen.getByRole("button", { name: /buscar posts/i }))

    await waitFor(() => {
      expect(screen.getByTestId("posts").textContent).toBe("Post Novo | Post Antigo")
    })

    expect(mockGetPosts).toHaveBeenCalled()
  })

  it("busca um post por id e atualiza selectedPost", async () => {
    mockGetPostById.mockResolvedValue({
      _id: "1",
      titulo: "Post Detalhado",
      descricao: "Descrição",
      status: "publicado",
    })

    renderPostsContext()

    fireEvent.click(screen.getByRole("button", { name: /buscar post por id/i }))

    await waitFor(() => {
      expect(screen.getByTestId("selected-post").textContent).toBe("Post Detalhado")
    })

    expect(mockGetPostById).toHaveBeenCalledWith("1")
  })

  it("adiciona um novo post ao estado com createPost", async () => {
    mockCreatePost.mockResolvedValue({
      _id: "3",
      titulo: "Novo Post",
      descricao: "Descrição do novo post",
      status: "rascunho",
      dtCriacao: "2026-03-22T10:00:00.000Z",
    })

    renderPostsContext()

    fireEvent.click(screen.getByRole("button", { name: /criar post/i }))

    await waitFor(() => {
      expect(screen.getByTestId("posts").textContent).toContain("Novo Post")
    })

    expect(mockCreatePost).toHaveBeenCalledWith({
      titulo: "Novo Post",
      descricao: "Descrição do novo post",
      status: "rascunho",
    })
  })

  it("atualiza um post existente com updatePost", async () => {
    mockGetPosts.mockResolvedValue([
      {
        _id: "1",
        titulo: "Post Original",
        descricao: "Descrição original",
        status: "rascunho",
        dtCriacao: "2026-03-20T10:00:00.000Z",
      },
    ])

    mockUpdatePost.mockResolvedValue({
      _id: "1",
      titulo: "Post Atualizado",
      descricao: "Descrição atualizada",
      status: "publicado",
      dtCriacao: "2026-03-20T10:00:00.000Z",
    })

    renderPostsContext()

    fireEvent.click(screen.getByRole("button", { name: /buscar posts/i }))

    await waitFor(() => {
      expect(screen.getByTestId("posts").textContent).toBe("Post Original")
    })

    fireEvent.click(screen.getByRole("button", { name: /atualizar post/i }))

    await waitFor(() => {
      expect(screen.getByTestId("posts").textContent).toBe("Post Atualizado")
    })

    expect(mockUpdatePost).toHaveBeenCalledWith("1", {
      titulo: "Post Atualizado",
      descricao: "Descrição atualizada",
      status: "publicado",
    })
  })

  it("remove um post do estado com deletePost", async () => {
    mockGetPosts.mockResolvedValue([
      {
        _id: "1",
        titulo: "Post Para Excluir",
        descricao: "Descrição",
        status: "publicado",
        dtCriacao: "2026-03-20T10:00:00.000Z",
      },
    ])

    mockDeletePost.mockResolvedValue({
      success: true,
      message: "Post excluído com sucesso.",
    })

    renderPostsContext()

    fireEvent.click(screen.getByRole("button", { name: /buscar posts/i }))

    await waitFor(() => {
      expect(screen.getByTestId("posts").textContent).toBe("Post Para Excluir")
    })

    fireEvent.click(screen.getByRole("button", { name: /excluir post/i }))

    await waitFor(() => {
      expect(screen.getByTestId("posts").textContent).toBe("")
    })

    expect(mockDeletePost).toHaveBeenCalledWith("1")
  })
})