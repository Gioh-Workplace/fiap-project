import express from "express";
import PostController from "../controllers/postController.js";
import { mockAuth } from "../middlewares/authMiddleware.js"

const routes = express.Router();

routes.get("/posts",mockAuth, PostController.listarPosts);

routes.get("/posts/:id", PostController.listarPostPorID)

routes.post("/post",mockAuth, PostController.cadastrarPost)

routes.put("/post/:id", PostController.atualizarPost)

routes.delete("/post/:id", PostController.deletarPost)

export default routes;