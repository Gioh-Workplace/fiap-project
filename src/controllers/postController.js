import post from "../models/Post.js";
import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js"
import { POST_STATUS, POST_STATUS_VALUES } from "../constants/postStatus.js";


class PostController{

    static async listarPosts (req,res){
      try {
        const filtro = {};
  
        if (req.user.role === ROLES.ALUNO) {
          filtro.status = POST_STATUS.PUBLICADO;
        }
  
        const posts = await post.find(filtro);
        const total = await post.countDocuments(filtro);
  
        res.status(200).json({
          total,
          data: posts
        });
  
      } catch (error) {
        res.status(500).json({
          message: "Erro ao listar posts"
        });
      }
    };

    static async listarPostPorID (req,res){
        try{
            const id = req.params.id
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                  message: "Erro - ID inválido"
                });
              }

        const postFound= await post.findById(id);
        if (!postFound) {
            return res.status(404).json({
              message: "Erro - Post não encontrado"
            });
          }

         res.status(200).json(postFound);

        } catch(erro) {
        res.status(500).json({message:`${erro.message} - Erro ao buscar post`})
        }
    };

    static async cadastrarPost(req,res){
        try{
            if (req.user.role !== ROLES.PROFESSOR) {
                return res.status(403).json({
                  message: "Apenas professores podem criar postagens"
                });
              } 

            const { status } = req.body;

    if (status !== undefined && !POST_STATUS_VALUES.includes(status)) {
      return res.status(400).json({
        message: "Erro - Status inválido"
      });
    }

    const novoPost = await post.create(req.body);
    res.status(201).json(novoPost);

  } catch (erro) {
    res.status(500).json({
      message: `${erro.message} - Falha ao cadastrar Post`
    });
  }
}
    

    static async atualizarPost(req,res){
        try{
            const id = req.params.id
            await post.findByIdAndUpdate(id,req.body);
            res.status(201).json({message:"Atualizado com sucesso"});
        } catch(erro){
            res.status(500).json({message:`${erro.message} - Falha ao atualizar Post`})
        }
        
    };


static async deletarPost(req,res){
        try{
          if (req.user.role !== ROLES.PROFESSOR) {
            return res.status(403).json({
              message: "Apenas professores podem deletar postagens"
            });
          } 

            const id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                  message: "ID inválido"
                });
              }

              await post.findByIdAndDelete(id);

            res.status(201).json({message:"Post deletado com sucesso"});
        } catch(erro){
            res.status(500).json({message:`${erro.message} - Falha ao excluir Post`})
        }
        
    };




};

export default PostController;