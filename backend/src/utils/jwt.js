import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN } from "../constants/auth.js";

export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      nome: user.nome,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}