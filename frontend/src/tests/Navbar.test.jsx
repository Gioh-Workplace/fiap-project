import { vi } from "vitest"
import { screen, fireEvent } from "@testing-library/react"
import { renderWithProviders } from "./testUtils"
import Navbar from "../components/Navbar"

const mockNavigate = vi.fn()
const mockLogout = vi.fn()

let mockPathname = "/admin"

let mockAuth = {
  role: "professor",
  logout: mockLogout,
}

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: mockPathname,
    }),
  }
})

vi.mock("../context/AuthContext", () => ({
  useAuth: () => mockAuth,
}))

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockPathname = "/admin"

    mockAuth = {
      role: "professor",
      logout: mockLogout,
    }
  })

  it("mostra menu administrativo para professor", () => {
    renderWithProviders(<Navbar />)

    expect(screen.getByText("Fiap-Blog")).toBeInTheDocument()
    expect(screen.getByText("Posts")).toBeInTheDocument()
    expect(screen.getByText("Usuários")).toBeInTheDocument()
    expect(screen.getByText("Professor")).toBeInTheDocument()
  })

  it("não mostra menu administrativo para aluno", () => {
    mockAuth = {
      role: "aluno",
      logout: mockLogout,
    }

    renderWithProviders(<Navbar />)

    expect(screen.getByText("Fiap-Blog")).toBeInTheDocument()
    expect(screen.queryByText("Posts")).not.toBeInTheDocument()
    expect(screen.queryByText("Usuários")).not.toBeInTheDocument()
    expect(screen.getByText("Aluno")).toBeInTheDocument()
  })

  it("faz logout e navega para login ao clicar em sair", () => {
    renderWithProviders(<Navbar />)

    fireEvent.click(screen.getByRole("button", { name: /sair/i }))

    expect(mockLogout).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith("/login")
  })

  it("navega para usuários ao clicar no menu Usuários", () => {
    renderWithProviders(<Navbar />)

    fireEvent.click(screen.getByRole("button", { name: /usuários/i }))

    expect(mockNavigate).toHaveBeenCalledWith("/admin/users")
  })
})