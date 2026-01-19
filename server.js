import app from "./app.js";
import conectDatabase from "./config/dbConnect.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const connect = await conectDatabase();

    connect.on("error", (erro) => {
      console.error("Erro de conexão", erro);
    });

    connect.once("open", () => {
      console.log("Conexão com MongoDB feita com sucesso");
    });

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor", error);
  }
}

startServer();
