import { jest } from "@jest/globals";
import request from "supertest";

await jest.unstable_mockModule(
  "../middlewares/authMiddleware.js",
  () => import("./__mocks__/authMiddleware.mock.js")
);

await jest.unstable_mockModule(
  "../middlewares/authorizeRole.js",
  () => import("./__mocks__/authorizeRole.mock.js")
);

await jest.unstable_mockModule(
  "../controllers/postController.js",
  () => import("./__mocks__/postController.mock.js")
);

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