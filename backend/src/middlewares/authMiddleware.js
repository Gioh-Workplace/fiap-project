import { ROLES } from "../constants/roles.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function mockAuth(req, res, next) {
  const role = req.headers["x-user-role"];

  if (!role) {
    return res.status(401).json({
      message: "Role não informada"
    });
  }

  req.user = { role };
  next();
}

export async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token não informado." });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Token inválido." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-senha");

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return res.status(401).json({ message: "Não autorizado." });
  }
}