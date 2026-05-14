import { jest } from "@jest/globals"

const mockPostFindById = jest.fn()

const mockCommentFind = jest.fn()
const mockCommentFindById = jest.fn()
const mockCommentCreate = jest.fn()
const mockCommentFindByIdAndDelete = jest.fn()

await jest.unstable_mockModule("../models/Post.js", () => ({
  default: {
    findById: mockPostFindById,
  },
}))

await jest.unstable_mockModule("../models/Comment.js", () => ({
  default: {
    find: mockCommentFind,
    findById: mockCommentFindById,
    create: mockCommentCreate,
    findByIdAndDelete: mockCommentFindByIdAndDelete,
  },
}))

const { default: CommentController } = await import("../controllers/commentController.js")

const createResponse = () => {
  const res = {}

  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)

  return res
}

describe("CommentController", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe("listarComentariosPorPost", () => {
    it("deve listar comentários de um post com sucesso", async () => {
      const req = {
        params: {
          postId: "post123",
        },
      }

      const res = createResponse()

      const comentarios = [
        {
          _id: "comment1",
          post: "post123",
          conteudo: "Comentário teste",
          autor: {
            _id: "user1",
            nome: "Aluno Teste",
            email: "aluno@teste.com",
            role: "aluno",
          },
        },
      ]

      const sortMock = jest.fn().mockResolvedValue(comentarios)
      const populateMock = jest.fn().mockReturnValue({
        sort: sortMock,
      })

      mockPostFindById.mockResolvedValue({ _id: "post123" })

      mockCommentFind.mockReturnValue({
        populate: populateMock,
      })

      await CommentController.listarComentariosPorPost(req, res)

      expect(mockPostFindById).toHaveBeenCalledWith("post123")
      expect(mockCommentFind).toHaveBeenCalledWith({ post: "post123" })
      expect(populateMock).toHaveBeenCalledWith("autor", "nome email role")
      expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Comentários listados com sucesso.",
        data: comentarios,
        total: comentarios.length,
      })
    })

    it("deve retornar 404 quando o post não existir", async () => {
      const req = {
        params: {
          postId: "post123",
        },
      }

      const res = createResponse()

      mockPostFindById.mockResolvedValue(null)

      await CommentController.listarComentariosPorPost(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Post não encontrado.",
      })
    })
  })

  describe("criarComentario", () => {
    it("deve criar comentário com sucesso", async () => {
      const req = {
        params: {
          postId: "post123",
        },
        body: {
          conteudo: "Comentário criado",
        },
        user: {
          _id: "user1",
          role: "aluno",
        },
      }

      const res = createResponse()

      const novoComentario = {
        _id: "comment1",
        post: "post123",
        autor: "user1",
        conteudo: "Comentário criado",
      }

      const comentarioPopulado = {
        _id: "comment1",
        post: "post123",
        autor: {
          _id: "user1",
          nome: "Aluno Teste",
          email: "aluno@teste.com",
          role: "aluno",
        },
        conteudo: "Comentário criado",
      }

      const populateMock = jest.fn().mockResolvedValue(comentarioPopulado)

      mockPostFindById.mockResolvedValue({ _id: "post123" })
      mockCommentCreate.mockResolvedValue(novoComentario)

      mockCommentFindById.mockReturnValue({
        populate: populateMock,
      })

      await CommentController.criarComentario(req, res)

      expect(mockPostFindById).toHaveBeenCalledWith("post123")
      expect(mockCommentCreate).toHaveBeenCalledWith({
        post: "post123",
        autor: "user1",
        conteudo: "Comentário criado",
      })

      expect(mockCommentFindById).toHaveBeenCalledWith("comment1")
      expect(populateMock).toHaveBeenCalledWith("autor", "nome email role")

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Comentário criado com sucesso.",
        data: comentarioPopulado,
      })
    })

    it("deve retornar 400 quando o conteúdo estiver vazio", async () => {
      const req = {
        params: {
          postId: "post123",
        },
        body: {
          conteudo: "   ",
        },
        user: {
          _id: "user1",
          role: "aluno",
        },
      }

      const res = createResponse()

      await CommentController.criarComentario(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "O conteúdo do comentário é obrigatório.",
      })

      expect(mockCommentCreate).not.toHaveBeenCalled()
    })

    it("deve retornar 404 quando o post não existir", async () => {
      const req = {
        params: {
          postId: "post123",
        },
        body: {
          conteudo: "Comentário teste",
        },
        user: {
          _id: "user1",
          role: "aluno",
        },
      }

      const res = createResponse()

      mockPostFindById.mockResolvedValue(null)

      await CommentController.criarComentario(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Post não encontrado.",
      })

      expect(mockCommentCreate).not.toHaveBeenCalled()
    })
  })

  describe("atualizarComentario", () => {
    it("deve permitir que o autor atualize o próprio comentário", async () => {
      const req = {
        params: {
          id: "comment1",
        },
        body: {
          conteudo: "Comentário atualizado",
        },
        user: {
          _id: "user1",
          role: "aluno",
        },
      }

      const res = createResponse()

      const comentario = {
        _id: "comment1",
        autor: "user1",
        conteudo: "Comentário antigo",
        save: jest.fn().mockResolvedValue(true),
      }

      const comentarioAtualizado = {
        _id: "comment1",
        autor: {
          _id: "user1",
          nome: "Aluno Teste",
          role: "aluno",
        },
        conteudo: "Comentário atualizado",
      }

      const populateMock = jest.fn().mockResolvedValue(comentarioAtualizado)

      mockCommentFindById
        .mockResolvedValueOnce(comentario)
        .mockReturnValueOnce({
          populate: populateMock,
        })

      await CommentController.atualizarComentario(req, res)

      expect(comentario.conteudo).toBe("Comentário atualizado")
      expect(comentario.save).toHaveBeenCalled()

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Comentário atualizado com sucesso.",
        data: comentarioAtualizado,
      })
    })

    it("deve permitir que professor atualize comentário de outro usuário", async () => {
      const req = {
        params: {
          id: "comment1",
        },
        body: {
          conteudo: "Comentário moderado",
        },
        user: {
          _id: "professor1",
          role: "professor",
        },
      }

      const res = createResponse()

      const comentario = {
        _id: "comment1",
        autor: "aluno1",
        conteudo: "Comentário antigo",
        save: jest.fn().mockResolvedValue(true),
      }

      const comentarioAtualizado = {
        _id: "comment1",
        autor: {
          _id: "aluno1",
          nome: "Aluno Teste",
          role: "aluno",
        },
        conteudo: "Comentário moderado",
      }

      const populateMock = jest.fn().mockResolvedValue(comentarioAtualizado)

      mockCommentFindById
        .mockResolvedValueOnce(comentario)
        .mockReturnValueOnce({
          populate: populateMock,
        })

      await CommentController.atualizarComentario(req, res)

      expect(comentario.save).toHaveBeenCalled()

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Comentário atualizado com sucesso.",
        data: comentarioAtualizado,
      })
    })

    it("deve bloquear aluno atualizando comentário de outro usuário", async () => {
      const req = {
        params: {
          id: "comment1",
        },
        body: {
          conteudo: "Tentativa inválida",
        },
        user: {
          _id: "aluno2",
          role: "aluno",
        },
      }

      const res = createResponse()

      const comentario = {
        _id: "comment1",
        autor: "aluno1",
        conteudo: "Comentário original",
        save: jest.fn(),
      }

      mockCommentFindById.mockResolvedValue(comentario)

      await CommentController.atualizarComentario(req, res)

      expect(comentario.save).not.toHaveBeenCalled()

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Você não tem permissão para editar este comentário.",
      })
    })

    it("deve retornar 400 quando o conteúdo atualizado estiver vazio", async () => {
      const req = {
        params: {
          id: "comment1",
        },
        body: {
          conteudo: "   ",
        },
        user: {
          _id: "user1",
          role: "aluno",
        },
      }

      const res = createResponse()

      await CommentController.atualizarComentario(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "O conteúdo do comentário é obrigatório.",
      })
    })

    it("deve retornar 404 quando comentário não existir", async () => {
      const req = {
        params: {
          id: "comment1",
        },
        body: {
          conteudo: "Comentário atualizado",
        },
        user: {
          _id: "user1",
          role: "aluno",
        },
      }

      const res = createResponse()

      mockCommentFindById.mockResolvedValue(null)

      await CommentController.atualizarComentario(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Comentário não encontrado.",
      })
    })
  })

  describe("deletarComentario", () => {
    it("deve permitir que o autor delete o próprio comentário", async () => {
      const req = {
        params: {
          id: "comment1",
        },
        user: {
          _id: "user1",
          role: "aluno",
        },
      }

      const res = createResponse()

      const comentario = {
        _id: "comment1",
        autor: "user1",
      }

      mockCommentFindById.mockResolvedValue(comentario)
      mockCommentFindByIdAndDelete.mockResolvedValue(comentario)

      await CommentController.deletarComentario(req, res)

      expect(mockCommentFindByIdAndDelete).toHaveBeenCalledWith("comment1")

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Comentário deletado com sucesso.",
      })
    })

    it("deve permitir que professor delete comentário de outro usuário", async () => {
      const req = {
        params: {
          id: "comment1",
        },
        user: {
          _id: "professor1",
          role: "professor",
        },
      }

      const res = createResponse()

      const comentario = {
        _id: "comment1",
        autor: "aluno1",
      }

      mockCommentFindById.mockResolvedValue(comentario)
      mockCommentFindByIdAndDelete.mockResolvedValue(comentario)

      await CommentController.deletarComentario(req, res)

      expect(mockCommentFindByIdAndDelete).toHaveBeenCalledWith("comment1")

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Comentário deletado com sucesso.",
      })
    })

    it("deve bloquear aluno deletando comentário de outro usuário", async () => {
      const req = {
        params: {
          id: "comment1",
        },
        user: {
          _id: "aluno2",
          role: "aluno",
        },
      }

      const res = createResponse()

      const comentario = {
        _id: "comment1",
        autor: "aluno1",
      }

      mockCommentFindById.mockResolvedValue(comentario)

      await CommentController.deletarComentario(req, res)

      expect(mockCommentFindByIdAndDelete).not.toHaveBeenCalled()

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Você não tem permissão para excluir este comentário.",
      })
    })

    it("deve retornar 404 quando comentário não existir", async () => {
      const req = {
        params: {
          id: "comment1",
        },
        user: {
          _id: "user1",
          role: "aluno",
        },
      }

      const res = createResponse()

      mockCommentFindById.mockResolvedValue(null)

      await CommentController.deletarComentario(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Comentário não encontrado.",
      })
    })
  })
})