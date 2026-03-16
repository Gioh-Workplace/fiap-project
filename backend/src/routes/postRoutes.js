import express from "express";
import PostController from "../controllers/postController.js";
import { mockAuth } from "../middlewares/authMiddleware.js"
import authorizeRole from "../middlewares/authorizeRole.js";
import { ROLES } from "../constants/roles.js";


const routes = express.Router();

routes.get("/posts",mockAuth, PostController.listarPosts);

routes.get("/posts/search",mockAuth, PostController.buscarPosts);

routes.get("/posts/:id",mockAuth, PostController.listarPostPorID)

routes.post("/post",mockAuth, authorizeRole(ROLES.PROFESSOR), PostController.cadastrarPost)

routes.put("/post/:id",mockAuth, authorizeRole(ROLES.PROFESSOR), PostController.atualizarPost)

routes.delete("/post/:id",mockAuth, authorizeRole(ROLES.PROFESSOR), PostController.deletarPost)



export default routes;