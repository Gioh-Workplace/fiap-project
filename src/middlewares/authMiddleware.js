import { ROLES } from "../constants/roles.js";

export function mockAuth(req, res, next) {
  const role = req.headers["x-user-role"];

  if (!role || !Object.values(ROLES).includes(role)) {
    req.user = { role: ROLES.ALUNO };
  } else {
    req.user = { role };
  }

  next();
}
