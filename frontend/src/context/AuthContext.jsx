import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null)

  // carregar role do localStorage ao iniciar
  useEffect(() => {
    const storedRole = localStorage.getItem("role")
    if (storedRole) {
      setRole(storedRole)
    }
  }, [])

  const login = (userRole) => {
    localStorage.setItem("role", userRole)
    setRole(userRole)
  }

  const logout = () => {
    localStorage.removeItem("role")
    setRole(null)
  }

  return (
    <AuthContext.Provider
      value={{
        role,
        isAuthenticated: !!role,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// hook customizado
export function useAuth() {
  return useContext(AuthContext)
}