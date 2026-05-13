import express from "express";
import posts from "./postRoutes.js";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";

const routes = (app) => {
app.route("/").get((req,res) => res.status(200).send("Pagina inicial"));

app.use(express.json(), posts,authRoutes,userRoutes);
};

export default routes;