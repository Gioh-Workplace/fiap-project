import post from "../models/Post.js";
import { ROLES } from "../constants/roles.js";
import { POST_STATUS } from "../constants/postStatus.js";
import { validarObjectId } from "../utils/validators.js";
import { validarStatusPost, alunoPodeVerPost } from "../utils/postValidators.js";

class PostController {

  static async listarPosts(req, res) {
    try {
      const filtro = {};

      if (req.user.role === ROLES.ALUNO) {
        filtro.status = POST_STATUS.PUBLICADO;
      }

      const posts = await post.find(filtro).populate("autor", "nome email role");
      const total = await post.countDocuments(filtro);

      res.status(200).json({ total, data: posts });

    } catch {
      res.status(500).json({ message: "Erro ao listar posts" });
    }
  }

  static async listarPostPorID(req, res) {
    try {
      const { id } = req.params;
  
      const postagem = await post.findById(id).populate("autor", "nome email role");;
  
      if (!postagem) {
        return res.status(404).json({ message: "Post não encontrado" });
      }
  
      if (!alunoPodeVerPost(req.user?.role, postagem.status)) {
        return res.status(403).json({
          message: "Você não tem permissão para acessar este post"
        });
      }
  
      return res.json(postagem);
  
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar post" });
    }
  }

  static async cadastrarPost(req, res) {
    try {
      if (!validarStatusPost(req.body.status)) {
        return res.status(400).json({ message: "Status inválido" });
      }

      const novoPost = await post.create({
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        status: req.body.status,
        autor: req.user._id
      });

      res.status(201).json(novoPost);

    } catch {
      console.error(error)
      res.status(500).json({ message: "Erro ao cadastrar post" });
    }
  }

  static async atualizarPost(req, res) {
    try {
      if (req.body.status && !validarStatusPost(req.body.status)) {
        return res.status(400).json({ message: "Status inválido" });
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
        return res.status(404).json({ message: "Post não encontrado" });
      }
  
      res.status(200).json(postAtualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar post" });
    }
  }

  static async deletarPost(req, res) {
    try {
      const { id } = req.params;

      if (!validarObjectId(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      await post.findByIdAndDelete(id);
      res.status(200).json({ message: "Post deletado com sucesso" });

    } catch {
      console.error(error)
      res.status(500).json({ message: "Erro ao deletar post" });
    }
  }

  static async buscarPosts(req, res) {
    try {
      const { q } = req.query;
  
      if (!q) {
        return res.status(400).json({
          message: "Parâmetro de busca 'q' é obrigatório"
        });
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
  
      return res.status(200).json({
        total,
        data: posts
      });
  
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar posts"
      });
    }
  }

}

export default PostController;
