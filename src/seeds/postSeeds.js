import Post from "../models/Post.js";

export async function seedPosts() {
  const count = await Post.countDocuments();

  if (count > 0) {
    console.log("Seed já executado, posts existentes:", count);
    return;
  }

  console.log("Executando seed de posts...");

  await Post.insertMany([
    {
        titulo: "Post de teste",
        descricao: "Funcionando com Docker",
        autor: "66cfa3d2b8e4f1a123456789",
        status: "publicado",
        dtCriacao: "2026-01-19T02:52:00.474Z",
        dtAtualizacao: "2026-01-19T02:52:00.474Z",
      
    },
    {
        titulo: "Anotações de aula 2024",
        descricao: "Material desatualizado, mantido apenas para histórico.",
        autor: "66cfa3d2b8e4f1a123456789",
        status: "arquivado",
        dtCriacao: "2026-01-19T02:51:11.971Z",
        dtAtualizacao: "2026-01-19T02:51:11.971Z",
    }
  ]);

  console.log("Seed de posts concluído");
}
