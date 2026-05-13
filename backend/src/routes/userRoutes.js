import express from "express";
import UserController from "../controllers/userController.js";
import { auth } from "../middlewares/authMiddleware.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { ROLES } from "../constants/roles.js";

const routes = express.Router();

routes.get("/users", auth, authorizeRole(ROLES.PROFESSOR), UserController.listarUsuarios);

routes.get("/users/:id", auth, authorizeRole(ROLES.PROFESSOR), UserController.buscarUsuarioPorId);

routes.post("/users", auth, authorizeRole(ROLES.PROFESSOR), UserController.criarUsuario);

routes.put("/users/:id", auth, authorizeRole(ROLES.PROFESSOR), UserController.atualizarUsuario);

routes.delete("/users/:id", auth, authorizeRole(ROLES.PROFESSOR), UserController.deletarUsuario);

export default routes;