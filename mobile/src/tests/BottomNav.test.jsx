import React from "react"
import { render, screen } from "@testing-library/react-native"
import BottomNav from "../components/BottomNav"

let mockRole = "professor"
let mockIsAdminView = true
let mockPathname = "/home"

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  usePathname: () => mockPathname,
}))

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    role: mockRole,
  }),
}))

jest.mock("../context/ViewModeContext", () => ({
  useViewMode: () => ({
    isAdminView: mockIsAdminView,
  }),
}))

describe("BottomNav", () => {
  beforeEach(() => {
    mockRole = "professor"
    mockIsAdminView = true
    mockPathname = "/home"
    jest.clearAllMocks()
  })

  it("renderiza Posts e Usuários para professor em modo admin", () => {
    render(<BottomNav />)

    expect(screen.getByText("Posts")).toBeTruthy()
    expect(screen.getByText("Usuários")).toBeTruthy()
  })

  it("não renderiza para aluno", () => {
    mockRole = "aluno"
    mockIsAdminView = false

    const { queryByText } = render(<BottomNav />)

    expect(queryByText("Posts")).toBeNull()
    expect(queryByText("Usuários")).toBeNull()
  })

  it("não renderiza para professor no modo padrão", () => {
    mockRole = "professor"
    mockIsAdminView = false

    const { queryByText } = render(<BottomNav />)

    expect(queryByText("Posts")).toBeNull()
    expect(queryByText("Usuários")).toBeNull()
  })

  it("não exibe item Admin na navbar", () => {
    render(<BottomNav />)

    expect(screen.queryByText("Admin")).toBeNull()
  })
})