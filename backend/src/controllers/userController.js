import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { ROLES } from "../constants/roles.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

class UserController {
  static async listarUsuarios(req, res) {
    try {
      const { role } = req.query;

      const filtro = {};

      if (role) {
        const rolesValidas = Object.values(ROLES);

        if (!rolesValidas.includes(role)) {
          return errorResponse(res, 400, "Perfil inválido. Use 'professor' ou 'aluno'.");
        }

        filtro.role = role;
      }

      const usuarios = await User.find(filtro)
        .select("-senha")
        .sort({ nome: 1 });

      const total = await User.countDocuments(filtro);

      return successResponse(res, 200, "Usuários listados com sucesso.", usuarios, {
        total,
      });
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return errorResponse(res, 500, "Erro ao listar usuários.");
    }
  }

  static async buscarUsuarioPorId(req, res) {
    try {
      const { id } = req.params;

      const usuario = await User.findById(id).select("-senha");

      if (!usuario) {
        return errorResponse(res, 404, "Usuário não encontrado.");
      }

      return successResponse(res, 200, "Usuário encontrado com sucesso.", usuario);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return errorResponse(res, 500, "Erro ao buscar usuário.");
    }
  }

  static async criarUsuario(req, res) {
    try {
      const { nome, email, senha, role } = req.body;

      if (!nome || !email || !senha || !role) {
        return errorResponse(res, 400, "Nome, email, senha e perfil são obrigatórios.");
      }

      const rolesValidas = Object.values(ROLES);

      if (!rolesValidas.includes(role)) {
        return errorResponse(res, 400, "Perfil inválido. Use 'professor' ou 'aluno'.");
      }

      const usuarioExistente = await User.findOne({ email });

      if (usuarioExistente) {
        return errorResponse(res, 409, "Já existe um usuário cadastrado com este email.");
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const novoUsuario = await User.create({
        nome,
        email,
        senha: senhaHash,
        role,
      });

      const usuarioSemSenha = await User.findById(novoUsuario._id).select("-senha");

      return successResponse(res, 201, "Usuário criado com sucesso.", usuarioSemSenha);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return errorResponse(res, 500, "Erro ao criar usuário.");
    }
  }

  static async atualizarUsuario(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha, role } = req.body;

      const usuario = await User.findById(id);

      if (!usuario) {
        return errorResponse(res, 404, "Usuário não encontrado.");
      }

      if (role) {
        const rolesValidas = Object.values(ROLES);

        if (!rolesValidas.includes(role)) {
          return errorResponse(res, 400, "Perfil inválido. Use 'professor' ou 'aluno'.");
        }

        usuario.role = role;
      }

      if (nome) {
        usuario.nome = nome;
      }

      if (email) {
        const emailEmUso = await User.findOne({
          email,
          _id: { $ne: id },
        });

        if (emailEmUso) {
          return errorResponse(res, 409, "Já existe outro usuário usando este email.");
        }

        usuario.email = email;
      }

      if (senha) {
        usuario.senha = await bcrypt.hash(senha, 10);
      }

      await usuario.save();

      const usuarioAtualizado = await User.findById(id).select("-senha");

      return successResponse(res, 200, "Usuário atualizado com sucesso.", usuarioAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return errorResponse(res, 500, "Erro ao atualizar usuário.");
    }
  }

  static async deletarUsuario(req, res) {
    try {
      const { id } = req.params;

      if (String(req.user._id) === String(id)) {
        return errorResponse(res, 400, "Você não pode excluir o próprio usuário autenticado.");
      }

      const usuarioDeletado = await User.findByIdAndDelete(id);

      if (!usuarioDeletado) {
        return errorResponse(res, 404, "Usuário não encontrado.");
      }

      return successResponse(res, 200, "Usuário deletado com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return errorResponse(res, 500, "Erro ao deletar usuário.");
    }
  }
}

export default UserController;