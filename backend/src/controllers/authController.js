import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

class AuthController {
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return errorResponse(res, 400, "Email e senha são obrigatórios.");;
      }

      const user = await User.findOne({ email });


      if (!user) {
        return errorResponse(res, 401, "Credenciais inválidas.");
      }

      const senhaValida = await bcrypt.compare(senha, user.senha);

      if (!senhaValida) {
        return errorResponse(res, 401, "Credenciais inválidas.");
      }

      const token = generateToken(user);

      return successResponse(res, 200, "Login realizado com sucesso.", {
        token,
        user: {
          id: user._id,
          nome: user.nome,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Erro no login:", error);
      return errorResponse(res, 500, "Erro ao realizar login.");
    }
  }
}

export default AuthController;