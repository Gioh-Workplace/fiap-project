import post from "../models/Post.js";
import { ROLES } from "../constants/roles.js";
import { POST_STATUS } from "../constants/postStatus.js";
import { validarObjectId } from "../utils/validators.js";
import { validarStatusPost, alunoPodeVerPost } from "../utils/postValidators.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

class PostController {

  static async listarPosts(req, res) {
    try {
      const filtro = {};

      if (req.user.role === ROLES.ALUNO) {
        filtro.status = POST_STATUS.PUBLICADO;
      }

      const posts = await post.find(filtro).populate("autor", "nome email role");
      const total = await post.countDocuments(filtro);

      return successResponse(res, 200, "Posts listados com sucesso.", posts, {
        total,
      });

    } catch {
      return errorResponse(res, 500, "Erro ao listar posts");
    }
  }

  static async listarPostPorID(req, res) {
    try {
      const { id } = req.params;
  
      const postagem = await post.findById(id).populate("autor", "nome email role");;
  
      if (!postagem) {
        return errorResponse(res, 404, "Post não encontrado.");
      }
  
      if (!alunoPodeVerPost(req.user?.role, postagem.status)) {
        return errorResponse(res, 403, "Você não tem permissão para acessar este post.");
      }
  
      return successResponse(res, 200, "Post encontrado com sucesso.", postagem);
  
    } catch (error) {
      return errorResponse(res, 500, "Erro ao buscar post.");
    }
  }

  static async cadastrarPost(req, res) {
    try {
      if (!validarStatusPost(req.body.status)) {
        return errorResponse(res, 400, "Status inválido.");
      }

      const novoPost = await post.create({
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        status: req.body.status,
        autor: req.user._id
      });

      return successResponse(res, 201, "Post cadastrado com sucesso.", novoPost);

    } catch (error) {
      console.error(error)
      return errorResponse(res, 500, "Erro ao cadastrar post.");
    }
  }

  static async atualizarPost(req, res) {
    try {
      if (req.body.status && !validarStatusPost(req.body.status)) {
        return errorResponse(res, 400, "Status inválido.");
      }
  
      const postAtualizado = await post.findByIdAndUpdate(
        req.params.id,
        {
          titulo: req.body.titulo,
          descricao: req.body.descricao,
          status: req.body.status
        },
        { new: true }
      ).populate("autor", "nome email role");
  
      if (!postAtualizado) {
        return errorResponse(res, 404, "Post não encontrado.");
      }
  
      return successResponse(res, 200, "Post atualizado com sucesso.", postAtualizado);

    } catch (error) {
      console.error(error);
      return errorResponse(res, 500, "Erro ao atualizar post.");
    }
  }

  static async deletarPost(req, res) {
    try {
      const { id } = req.params;

      if (!validarObjectId(id)) {
        return errorResponse(res, 400, "ID inválido.");
      }

      const postDeletado = await post.findByIdAndDelete(id);

      if (!postDeletado) {
        return errorResponse(res, 404, "Post não encontrado.");
      }

      return successResponse(res, 200, "Post deletado com sucesso.");

    } catch (error){
      console.error(error)
      return errorResponse(res, 500, "Erro ao deletar post.");
    }
  }

  static async buscarPosts(req, res) {
    try {
      const { q } = req.query;
  
      if (!q) {
        return errorResponse(res, 400, "Parâmetro de busca 'q' é obrigatório.");
      }
  
      const filtro = {
        $or: [
          { titulo: { $regex: q, $options: "i" } },
          { descricao: { $regex: q, $options: "i" } }
        ]
      };
  
      if (req.user.role === ROLES.ALUNO) {
        filtro.status = POST_STATUS.PUBLICADO;
      }
  
      const posts = await post.find(filtro).populate("autor", "nome email role");;
      const total = await post.countDocuments(filtro);
  
      return successResponse(res, 200, "Busca realizada com sucesso.", posts, {
        total,
      });
  
    } catch (error) {
      console.log(error);
      return errorResponse(res, 500, "Erro ao buscar posts.");
    }
  }

}

export default PostController;
