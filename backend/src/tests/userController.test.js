import { jest } from "@jest/globals";

const mockFind = jest.fn();
const mockCountDocuments = jest.fn();
const mockFindById = jest.fn();
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockFindByIdAndDelete = jest.fn();
const mockHash = jest.fn();

await jest.unstable_mockModule("../models/User.js", () => ({
  default: {
    find: mockFind,
    countDocuments: mockCountDocuments,
    findById: mockFindById,
    findOne: mockFindOne,
    create: mockCreate,
    findByIdAndDelete: mockFindByIdAndDelete,
  },
}));

await jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    hash: mockHash,
  },
}));

const { default: UserController } = await import("../controllers/userController.js");

const createResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

describe("UserController", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("listarUsuarios", () => {
    it("deve listar usuários com sucesso", async () => {
      const req = {
        query: {},
      };

      const res = createResponse();

      const usuarios = [
        {
          _id: "1",
          nome: "Professor Teste",
          email: "professor@teste.com",
          role: "professor",
        },
      ];

      const sortMock = jest.fn().mockResolvedValue(usuarios);
      const selectMock = jest.fn().mockReturnValue({
        sort: sortMock,
      });

      mockFind.mockReturnValue({
        select: selectMock,
      });

      mockCountDocuments.mockResolvedValue(1);

      await UserController.listarUsuarios(req, res);

      expect(mockFind).toHaveBeenCalledWith({});
      expect(selectMock).toHaveBeenCalledWith("-senha");
      expect(sortMock).toHaveBeenCalledWith({ nome: 1 });
      expect(mockCountDocuments).toHaveBeenCalledWith({});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Usuários listados com sucesso.",
        data: usuarios,
        total: 1,
      });
    });

    it("deve filtrar usuários por role", async () => {
      const req = {
        query: {
          role: "aluno",
        },
      };

      const res = createResponse();

      const usuarios = [
        {
          _id: "1",
          nome: "Aluno Teste",
          email: "aluno@teste.com",
          role: "aluno",
        },
      ];

      const sortMock = jest.fn().mockResolvedValue(usuarios);
      const selectMock = jest.fn().mockReturnValue({
        sort: sortMock,
      });

      mockFind.mockReturnValue({
        select: selectMock,
      });

      mockCountDocuments.mockResolvedValue(1);

      await UserController.listarUsuarios(req, res);

      expect(mockFind).toHaveBeenCalledWith({ role: "aluno" });
      expect(mockCountDocuments).toHaveBeenCalledWith({ role: "aluno" });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Usuários listados com sucesso.",
        data: usuarios,
        total: 1,
      });
    });

    it("deve retornar 400 quando role for inválida", async () => {
      const req = {
        query: {
          role: "admin",
        },
      };

      const res = createResponse();

      await UserController.listarUsuarios(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Perfil inválido. Use 'professor' ou 'aluno'.",
      });
    });
  });

  describe("buscarUsuarioPorId", () => {
    it("deve buscar usuário por id com sucesso", async () => {
      const req = {
        params: {
          id: "123",
        },
      };

      const res = createResponse();

      const usuario = {
        _id: "123",
        nome: "Aluno Teste",
        email: "aluno@teste.com",
        role: "aluno",
      };

      const selectMock = jest.fn().mockResolvedValue(usuario);

      mockFindById.mockReturnValue({
        select: selectMock,
      });

      await UserController.buscarUsuarioPorId(req, res);

      expect(mockFindById).toHaveBeenCalledWith("123");
      expect(selectMock).toHaveBeenCalledWith("-senha");

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Usuário encontrado com sucesso.",
        data: usuario,
      });
    });

    it("deve retornar 404 quando usuário não existir", async () => {
      const req = {
        params: {
          id: "123",
        },
      };

      const res = createResponse();

      const selectMock = jest.fn().mockResolvedValue(null);

      mockFindById.mockReturnValue({
        select: selectMock,
      });

      await UserController.buscarUsuarioPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Usuário não encontrado.",
      });
    });
  });

  describe("criarUsuario", () => {
    it("deve criar usuário com sucesso", async () => {
      const req = {
        body: {
          nome: "Aluno Teste",
          email: "aluno@teste.com",
          senha: "123456",
          role: "aluno",
        },
      };

      const res = createResponse();

      const usuarioCriado = {
        _id: "123",
        nome: "Aluno Teste",
        email: "aluno@teste.com",
        senha: "hash",
        role: "aluno",
      };

      const usuarioSemSenha = {
        _id: "123",
        nome: "Aluno Teste",
        email: "aluno@teste.com",
        role: "aluno",
      };

      mockFindOne.mockResolvedValue(null);
      mockHash.mockResolvedValue("senha-hash");
      mockCreate.mockResolvedValue(usuarioCriado);

      const selectMock = jest.fn().mockResolvedValue(usuarioSemSenha);

      mockFindById.mockReturnValue({
        select: selectMock,
      });

      await UserController.criarUsuario(req, res);

      expect(mockFindOne).toHaveBeenCalledWith({ email: "aluno@teste.com" });
      expect(mockHash).toHaveBeenCalledWith("123456", 10);
      expect(mockCreate).toHaveBeenCalledWith({
        nome: "Aluno Teste",
        email: "aluno@teste.com",
        senha: "senha-hash",
        role: "aluno",
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Usuário criado com sucesso.",
        data: usuarioSemSenha,
      });
    });

    it("deve retornar 400 quando faltar campos obrigatórios", async () => {
      const req = {
        body: {
          nome: "Aluno Teste",
        },
      };

      const res = createResponse();

      await UserController.criarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Nome, email, senha e perfil são obrigatórios.",
      });
    });

    it("deve retornar 409 quando email já estiver cadastrado", async () => {
      const req = {
        body: {
          nome: "Aluno Teste",
          email: "aluno@teste.com",
          senha: "123456",
          role: "aluno",
        },
      };

      const res = createResponse();

      mockFindOne.mockResolvedValue({
        _id: "123",
        email: "aluno@teste.com",
      });

      await UserController.criarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Já existe um usuário cadastrado com este email.",
      });
    });
  });

  describe("atualizarUsuario", () => {
    it("deve atualizar usuário com sucesso", async () => {
      const req = {
        params: {
          id: "123",
        },
        body: {
          nome: "Aluno Atualizado",
          email: "aluno.atualizado@teste.com",
          role: "aluno",
        },
      };
    
      const res = createResponse();
    
      const usuario = {
        _id: "123",
        nome: "Aluno Teste",
        email: "aluno@teste.com",
        role: "aluno",
        save: jest.fn().mockResolvedValue(true),
      };
    
      const usuarioAtualizado = {
        _id: "123",
        nome: "Aluno Atualizado",
        email: "aluno.atualizado@teste.com",
        role: "aluno",
      };
    
      const selectMock = jest.fn().mockResolvedValue(usuarioAtualizado);
    
      mockFindById
        .mockResolvedValueOnce(usuario)
        .mockReturnValueOnce({
          select: selectMock,
        });
    
      mockFindOne.mockResolvedValue(null);
    
      await UserController.atualizarUsuario(req, res);
    
      expect(mockFindById).toHaveBeenNthCalledWith(1, "123");
    
      expect(mockFindOne).toHaveBeenCalledWith({
        email: "aluno.atualizado@teste.com",
        _id: { $ne: "123" },
      });
    
      expect(usuario.nome).toBe("Aluno Atualizado");
      expect(usuario.email).toBe("aluno.atualizado@teste.com");
      expect(usuario.role).toBe("aluno");
      expect(usuario.save).toHaveBeenCalled();
    
      expect(mockFindById).toHaveBeenNthCalledWith(2, "123");
      expect(selectMock).toHaveBeenCalledWith("-senha");
    
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Usuário atualizado com sucesso.",
        data: usuarioAtualizado,
      });
    });
    
    it("deve retornar 404 quando usuário para atualização não existir", async () => {
      const req = {
        params: {
          id: "123",
        },
        body: {
          nome: "Aluno Atualizado",
        },
      };
    
      const res = createResponse();
    
      mockFindById.mockResolvedValueOnce(null);
    
      await UserController.atualizarUsuario(req, res);
    
      expect(mockFindById).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Usuário não encontrado.",
      });
    });
  });

  describe("deletarUsuario", () => {
    it("deve deletar usuário com sucesso", async () => {
      const req = {
        params: {
          id: "123",
        },
        user: {
          _id: "999",
        },
      };

      const res = createResponse();

      mockFindByIdAndDelete.mockResolvedValue({
        _id: "123",
        nome: "Aluno Teste",
      });

      await UserController.deletarUsuario(req, res);

      expect(mockFindByIdAndDelete).toHaveBeenCalledWith("123");

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Usuário deletado com sucesso.",
      });
    });

    it("deve impedir exclusão do próprio usuário autenticado", async () => {
      const req = {
        params: {
          id: "123",
        },
        user: {
          _id: "123",
        },
      };

      const res = createResponse();

      await UserController.deletarUsuario(req, res);

      expect(mockFindByIdAndDelete).not.toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Você não pode excluir o próprio usuário autenticado.",
      });
    });
  });
});