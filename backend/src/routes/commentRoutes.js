import express from "express";
import CommentController from "../controllers/commentController.js";
import { auth } from "../middlewares/authMiddleware.js";

const routes = express.Router();

routes.get("/posts/:postId/comments", auth, CommentController.listarComentariosPorPost);

routes.post("/posts/:postId/comments", auth, CommentController.criarComentario);

routes.put("/comments/:id", auth, CommentController.atualizarComentario);

routes.delete("/comments/:id", auth, CommentController.deletarComentario);

export default routes;