import app from "./src/app.js";
import conectDatabase from "./src/config/dbConnect.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await conectDatabase();
    console.log("Conexão com MongoDB feita com sucesso");

    if (process.env.NODE_ENV === "development") {
      const { seedPosts } = await import("./src/seeds/postSeeds.js");
      await seedPosts();
      console.log("Seed executado com sucesso");
    }

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor", error);
  }
}

startServer();
