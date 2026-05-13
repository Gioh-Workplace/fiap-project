import express from "express";
import PostController from "../controllers/postController.js";
import { auth } from "../middlewares/authMiddleware.js"
import authorizeRole from "../middlewares/authorizeRole.js";
import { ROLES } from "../constants/roles.js";


const routes = express.Router();

routes.get("/posts", auth, PostController.listarPosts);

routes.get("/posts/search",auth, PostController.buscarPosts);

routes.get("/posts/:id",auth, PostController.listarPostPorID)

routes.post("/posts",auth, authorizeRole(ROLES.PROFESSOR), PostController.cadastrarPost)

routes.put("/posts/:id",auth, authorizeRole(ROLES.PROFESSOR), PostController.atualizarPost)

routes.delete("/posts/:id",auth, authorizeRole(ROLES.PROFESSOR), PostController.deletarPost)



export default routes;