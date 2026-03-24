import { vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./testUtils";
import Login from "../pages/Login";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockLoginRequest = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

vi.mock("../api/auth", () => ({
  loginRequest: (...args) => mockLoginRequest(...args),
}));

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza campos e botão de login", () => {
    renderWithProviders(<Login />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /entrar/i })
    ).toBeInTheDocument();
  });

  it("faz login com sucesso e redireciona para home", async () => {
    mockLoginRequest.mockResolvedValue({
      user: { nome: "Professor Teste", role: "professor" },
      token: "token_fake",
    });

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "professor@teste.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/senha/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(mockLoginRequest).toHaveBeenCalledWith({
        email: "professor@teste.com",
        senha: "123456",
      });
    });

    expect(mockLogin).toHaveBeenCalledWith({
      user: { nome: "Professor Teste", role: "professor" },
      token: "token_fake",
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});