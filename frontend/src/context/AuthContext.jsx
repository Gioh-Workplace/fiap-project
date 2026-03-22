import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")
    
    if (storedUser && storedToken) {
      try{
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    } catch (error){
        console.error("Erro ao restaurar sessão:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    }
  }

    setIsLoading(false)
}, [])

  const login = ({ user, token }) => {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", token)

    setUser(user)
    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider
  value={{
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout
  }}
>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}