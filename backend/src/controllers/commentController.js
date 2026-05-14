import Comment from "../models/Comment.js";
import post from "../models/Post.js";
import { ROLES } from "../constants/roles.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

class CommentController {
  static async listarComentariosPorPost(req, res) {
    try {
      const { postId } = req.params;

      const postExiste = await post.findById(postId);

      if (!postExiste) {
        return errorResponse(res, 404, "Post não encontrado.");
      }

      const comentarios = await Comment.find({ post: postId })
        .populate("autor", "nome email role")
        .sort({ createdAt: -1 });

      return successResponse(
        res,
        200,
        "Comentários listados com sucesso.",
        comentarios,
        { total: comentarios.length }
      );
    } catch (error) {
      console.error("Erro ao listar comentários:", error);
      return errorResponse(res, 500, "Erro ao listar comentários.");
    }
  }

  static async criarComentario(req, res) {
    try {
      const { postId } = req.params;
      const { conteudo } = req.body;

      if (!conteudo || !conteudo.trim()) {
        return errorResponse(res, 400, "O conteúdo do comentário é obrigatório.");
      }

      const postExiste = await post.findById(postId);

      if (!postExiste) {
        return errorResponse(res, 404, "Post não encontrado.");
      }

      const novoComentario = await Comment.create({
        post: postId,
        autor: req.user._id,
        conteudo: conteudo.trim(),
      });

      const comentarioPopulado = await Comment.findById(novoComentario._id)
        .populate("autor", "nome email role");

      return successResponse(
        res,
        201,
        "Comentário criado com sucesso.",
        comentarioPopulado
      );
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
      return errorResponse(res, 500, "Erro ao criar comentário.");
    }
  }

  static async atualizarComentario(req, res) {
    try {
      const { id } = req.params;
      const { conteudo } = req.body;

      if (!conteudo || !conteudo.trim()) {
        return errorResponse(res, 400, "O conteúdo do comentário é obrigatório.");
      }

      const comentario = await Comment.findById(id);

      if (!comentario) {
        return errorResponse(res, 404, "Comentário não encontrado.");
      }

      const isProfessor = req.user.role === ROLES.PROFESSOR;
      const isAutor = String(comentario.autor) === String(req.user._id);

      if (!isProfessor && !isAutor) {
        return errorResponse(
          res,
          403,
          "Você não tem permissão para editar este comentário."
        );
      }

      comentario.conteudo = conteudo.trim();

      await comentario.save();

      const comentarioAtualizado = await Comment.findById(id)
        .populate("autor", "nome email role");

      return successResponse(
        res,
        200,
        "Comentário atualizado com sucesso.",
        comentarioAtualizado
      );
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
      return errorResponse(res, 500, "Erro ao atualizar comentário.");
    }
  }

  static async deletarComentario(req, res) {
    try {
      const { id } = req.params;

      const comentario = await Comment.findById(id);

      if (!comentario) {
        return errorResponse(res, 404, "Comentário não encontrado.");
      }

      const isProfessor = req.user.role === ROLES.PROFESSOR;
      const isAutor = String(comentario.autor) === String(req.user._id);

      if (!isProfessor && !isAutor) {
        return errorResponse(
          res,
          403,
          "Você não tem permissão para excluir este comentário."
        );
      }

      await Comment.findByIdAndDelete(id);

      return successResponse(res, 200, "Comentário deletado com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
      return errorResponse(res, 500, "Erro ao deletar comentário.");
    }
  }
}

export default CommentController;