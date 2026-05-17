import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useAuth } from "./AuthContext"

const ViewModeContext = createContext(null)

export function ViewModeProvider({ children }) {
  const { role } = useAuth()
  const [viewMode, setViewMode] = useState("default")

  const isProfessor = role === "professor"
  const isAdminView = isProfessor && viewMode === "admin"

  useEffect(() => {
    if (!isProfessor) {
      setViewMode("default")
    }
  }, [isProfessor])

  const toggleViewMode = useCallback(() => {
    if (!isProfessor) {
      setViewMode("default")
      return
    }

    setViewMode((currentMode) =>
      currentMode === "admin" ? "default" : "admin"
    )
  }, [isProfessor])

  const setDefaultView = useCallback(() => {
    setViewMode("default")
  }, [])

  const setAdminView = useCallback(() => {
    if (isProfessor) {
      setViewMode("admin")
    }
  }, [isProfessor])

  const value = useMemo(
    () => ({
      viewMode,
      isAdminView,
      toggleViewMode,
      setDefaultView,
      setAdminView,
    }),
    [viewMode, isAdminView, toggleViewMode, setDefaultView, setAdminView]
  )

  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  )
}

export function useViewMode() {
  const context = useContext(ViewModeContext)

  if (!context) {
    throw new Error("useViewMode deve ser usado dentro de ViewModeProvider")
  }

  return context
}