import React from "react"
import { Text, Pressable } from "react-native"
import { render, fireEvent, screen } from "@testing-library/react-native"
import { ViewModeProvider, useViewMode } from "../context/ViewModeContext"

let mockRole = "professor"

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    role: mockRole,
  }),
}))

function TestComponent() {
  const { viewMode, isAdminView, toggleViewMode } = useViewMode()

  return (
    <>
      <Text testID="view-mode">{viewMode}</Text>
      <Text testID="is-admin-view">{String(isAdminView)}</Text>

      <Pressable testID="toggle-button" onPress={toggleViewMode}>
        <Text>Alternar</Text>
      </Pressable>
    </>
  )
}

function renderWithProvider() {
  return render(
    <ViewModeProvider>
      <TestComponent />
    </ViewModeProvider>
  )
}

describe("ViewModeContext", () => {
  beforeEach(() => {
    mockRole = "professor"
  })

  it("inicia no modo padrão", () => {
    renderWithProvider()

    expect(screen.getByTestId("view-mode").props.children).toBe("default")
    expect(screen.getByTestId("is-admin-view").props.children).toBe("false")
  })

  it("permite professor alternar para modo admin", () => {
    renderWithProvider()

    fireEvent.press(screen.getByTestId("toggle-button"))

    expect(screen.getByTestId("view-mode").props.children).toBe("admin")
    expect(screen.getByTestId("is-admin-view").props.children).toBe("true")
  })

  it("permite professor alternar de admin para padrão", () => {
    renderWithProvider()

    fireEvent.press(screen.getByTestId("toggle-button"))
    fireEvent.press(screen.getByTestId("toggle-button"))

    expect(screen.getByTestId("view-mode").props.children).toBe("default")
    expect(screen.getByTestId("is-admin-view").props.children).toBe("false")
  })

  it("mantém aluno sempre no modo padrão", () => {
    mockRole = "aluno"

    renderWithProvider()

    fireEvent.press(screen.getByTestId("toggle-button"))

    expect(screen.getByTestId("view-mode").props.children).toBe("default")
    expect(screen.getByTestId("is-admin-view").props.children).toBe("false")
  })
})