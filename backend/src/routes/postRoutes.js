import express from "express";
import PostController from "../controllers/postController.js";
import { auth } from "../middlewares/authMiddleware.js"
import authorizeRole from "../middlewares/authorizeRole.js";
import { ROLES } from "../constants/roles.js";


const routes = express.Router();

routes.get("/posts", auth, PostController.listarPosts);

routes.get("/posts/search",auth, PostController.buscarPosts);

routes.get("/posts/:id",auth, PostController.listarPostPorID)

routes.post("/post",auth, authorizeRole(ROLES.PROFESSOR), PostController.cadastrarPost)

routes.put("/post/:id",auth, authorizeRole(ROLES.PROFESSOR), PostController.atualizarPost)

routes.delete("/post/:id",auth, authorizeRole(ROLES.PROFESSOR), PostController.deletarPost)



export default routes;