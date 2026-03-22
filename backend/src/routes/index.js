import express from "express";
import posts from "./postRoutes.js";
import authRoutes from "./authRoutes.js";


const routes = (app) => {
app.route("/").get((req,res) => res.status(200).send("Pagina inicial"));

app.use(express.json(), posts,authRoutes);
};

export default routes;