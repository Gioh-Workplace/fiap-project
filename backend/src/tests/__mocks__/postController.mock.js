import { jest } from "@jest/globals";

export default {
  cadastrarPost: (req, res) =>
    res.status(201).json({
      _id: "123",
      titulo: "Post de teste",
      descricao: "Conteúdo de teste",
      status: "publicado",
    }),

  listarPosts: (req, res) =>
    res.status(200).json({
      total: 1,
      data: [
        {
          _id: "1",
          titulo: "Post público",
          descricao: "Conteúdo",
          status: "publicado",
        },
      ],
    }),

  buscarPosts: jest.fn(),
  listarPostPorID: jest.fn(),
  atualizarPost: jest.fn(),
  deletarPost: jest.fn(),
};
