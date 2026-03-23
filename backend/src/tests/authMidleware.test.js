import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import { auth } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

describe("auth middleware", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve retornar 401 quando não houver token", async () => {
    const req = { headers: {} };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token não informado." });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve aceitar token válido e preencher req.user", async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";

    const fakeUser = {
      _id: "123",
      nome: "Teste",
      email: "teste@email.com",
      role: "professor",
    };

    jest.spyOn(User, "findById").mockReturnValue({
      select: jest.fn().mockResolvedValue(fakeUser),
    });

    const token = jwt.sign({ id: "123" }, process.env.JWT_SECRET);

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await auth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(fakeUser);
  });

  it("deve retornar 401 quando token for inválido", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
  
    const req = {
      headers: {
        authorization: "Bearer token_invalido",
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    const next = jest.fn();
  
    await auth(req, res, next);
  
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Não autorizado." });
    expect(next).not.toHaveBeenCalled();
  
    consoleSpy.mockRestore();
  });
});