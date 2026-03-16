import { ROLES } from "../constants/roles.js";

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