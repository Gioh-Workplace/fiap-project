import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

class AuthController {
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          message: "Email e senha são obrigatórios."
        });
      }

      const user = await User.findOne({ email });


      if (!user) {
        return res.status(401).json({
          message: "Credenciais inválidas."
        });
      }

      const senhaValida = await bcrypt.compare(senha, user.senha);

      if (!senhaValida) {
        return res.status(401).json({
          message: "Credenciais inválidas."
        });
      }

      const token = generateToken(user);

      return res.status(200).json({
        message: "Login realizado com sucesso.",
        token,
        user: {
          id: user._id,
          nome: user.nome,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({
        message: "Erro ao realizar login."
      });
    }
  }
}

export default AuthController;