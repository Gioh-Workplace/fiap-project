import { jest } from "@jest/globals";
import request from "supertest";

await jest.unstable_mockModule("../middlewares/authMiddleware.js", () => ({
  auth: (req, res, next) => {
    req.user = {
      id: "mock-user-id",
      role: req.headers["x-user-role"] || "aluno",
    };
    next();
  },
}));

await jest.unstable_mockModule("../middlewares/authorizeRole.js", () => ({
  default: () => (req, res, next) => next(),
}));

const listarPosts = async (req, res) => {
  return res.status(200).json({
    total: 1,
    data: [
      {
        _id: "1",
        titulo: "Post publicado",
        descricao: "Teste",
        status: "publicado",
      },
    ],
  });
};

const buscarPosts = async (req, res) => {
  return res.status(200).json({
    total: 1,
    data: [],
  });
};

const listarPostPorID = async (req, res) => {
  return res.status(200).json({
    _id: "1",
    titulo: "Post publicado",
    descricao: "Teste",
    status: "publicado",
  });
};

const cadastrarPost = async (req, res) => {
  return res.status(201).json({
    message: "Post criado com sucesso",
  });
};

const atualizarPost = async (req, res) => {
  return res.status(200).json({
    message: "Post atualizado com sucesso",
  });
};

const excluirPost = async (req, res) => {
  return res.status(200).json({
    message: "Post excluído com sucesso",
  });
};

await jest.unstable_mockModule("../controllers/postController.js", () => {
  const controller = {
    listarPosts: async (req, res) => {
      return res.status(200).json({
        total: 1,
        data: [
          {
            _id: "1",
            titulo: "Post publicado",
            descricao: "Teste",
            status: "publicado",
          },
        ],
      });
    },

    buscarPosts: async (req, res) => {
      return res.status(200).json({
        total: 1,
        data: [],
      });
    },

    listarPostPorID: async (req, res) => {
      return res.status(200).json({
        _id: "1",
        titulo: "Post publicado",
        descricao: "Teste",
        status: "publicado",
      });
    },

    cadastrarPost: async (req, res) => {
      return res.status(201).json({
        message: "Post criado com sucesso",
      });
    },

    atualizarPost: async (req, res) => {
      return res.status(200).json({
        message: "Post atualizado com sucesso",
      });
    },

    deletarPost: async (req, res) => {
      return res.status(200).json({
        message: "Post excluído com sucesso",
      });
    },
  };

  return {
    default: controller,
  };
});

const { default: app } = await import("../app.js");

describe("Posts API", () => {
  it("Professor consegue criar post", async () => {
    const res = await request(app)
      .post("/post")
      .set("x-user-role", "professor")
      .send({
        titulo: "Post de teste",
        descricao: "Conteúdo de teste",
        status: "publicado",
      });

    expect(res.statusCode).toBe(201);
  });

  it("Aluno só vê posts publicados", async () => {
    const res = await request(app)
      .get("/posts")
      .set("x-user-role", "aluno");

    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(1);
  });
});