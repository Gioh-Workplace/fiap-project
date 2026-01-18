import express from "express";
import conectDatabase from "./config/dbConnect.js";
import routes from "./routes/index.js";

const connect = await conectDatabase();

connect.on("error", (erro) => {
console.error("Erro de conexao", erro);
});

connect.once("open",() => {
    console.log("Conexão feita com sucesso")
});

const app = express();
routes(app);



app.delete("/livros/:id", (req,res) => {
    const index = getLivro(req.params.id);
    livros.splice(index,1);
    res.status(200).send(`O livro de id:${req.params} foi excluido`);
});

export default app;


