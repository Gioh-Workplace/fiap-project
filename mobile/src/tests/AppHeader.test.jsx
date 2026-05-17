import React from "react"
import { fireEvent, render, screen } from "@testing-library/react-native"
import AppHeader from "../components/AppHeader"

let mockRole = "professor"
let mockIsAdminView = false

const mockLogout = jest.fn()
const mockToggleViewMode = jest.fn()
const mockReplace = jest.fn()
const mockBack = jest.fn()

jest.mock("expo-router", () => ({
  router: {
    replace: (...args) => mockReplace(...args),
    back: (...args) => mockBack(...args),
  },
}))

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      nome: "Usuário Teste",
      email: "teste@teste.com",
    },
    role: mockRole,
    logout: mockLogout,
  }),
}))

jest.mock("../context/ViewModeContext", () => ({
  useViewMode: () => ({
    isAdminView: mockIsAdminView,
    toggleViewMode: mockToggleViewMode,
  }),
}))

jest.mock("../utils/colors", () => ({
  getRoleColor: () => ({
    background: "#fff7ef",
    border: "#ffd6ad",
    text: "#ff7900",
  }),
}))

describe("AppHeader", () => {
  beforeEach(() => {
    mockRole = "professor"
    mockIsAdminView = false
    jest.clearAllMocks()
  })

  it("renderiza título, usuário e perfil", () => {
    render(<AppHeader title="Mural de Posts" />)

    expect(screen.getByText("Mural de Posts")).toBeTruthy()
    expect(screen.getByText("Usuário Teste")).toBeTruthy()
    expect(screen.getByText("professor")).toBeTruthy()
  })

  it("exibe botão de modo para professor", () => {
    render(<AppHeader title="Mural de Posts" />)

    expect(screen.getByText("Padrão")).toBeTruthy()
  })

  it("não exibe botão de modo para aluno", () => {
    mockRole = "aluno"

    render(<AppHeader title="Mural de Posts" />)

    expect(screen.queryByText("Padrão")).toBeNull()
    expect(screen.queryByText("Admin")).toBeNull()
  })

  it("chama toggleViewMode ao clicar no botão de modo", () => {
    render(<AppHeader title="Mural de Posts" />)

    fireEvent.press(screen.getByText("Padrão"))

    expect(mockToggleViewMode).toHaveBeenCalledTimes(1)
  })

  it("redireciona para home ao sair do modo admin", () => {
    mockIsAdminView = true

    render(<AppHeader title="Usuários" />)

    fireEvent.press(screen.getByText("Admin"))

    expect(mockToggleViewMode).toHaveBeenCalledTimes(1)
    expect(mockReplace).toHaveBeenCalledWith("/home")
  })

  it("executa logout e redireciona para login", async () => {
    render(<AppHeader title="Mural de Posts" />)

    fireEvent.press(screen.getByText("Sair"))

    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it("renderiza botão de voltar quando showBack for true", () => {
    render(<AppHeader title="Editar Post" showBack />)

    fireEvent.press(screen.getByText("‹"))

    expect(mockBack).toHaveBeenCalledTimes(1)
  })

  it("não renderiza logout nem modo quando showLogout for false", () => {
    render(<AppHeader title="Detalhes" showLogout={false} />)

    expect(screen.queryByText("Sair")).toBeNull()
    expect(screen.queryByText("Padrão")).toBeNull()
    expect(screen.queryByText("Admin")).toBeNull()
  })
})