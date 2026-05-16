import { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { loginRequest } from "../api/auth"

const AuthContext = createContext(null)

const TOKEN_KEY = "@fiap_blog_token"
const USER_KEY = "@fiap_blog_user"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const role = user?.role || null
  const isAuthenticated = !!token

  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY)
        const storedUser = await AsyncStorage.getItem(USER_KEY)

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Erro ao carregar autenticação:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStoredAuth()
  }, [])

  const login = async (credentials) => {
    const response = await loginRequest(credentials)

    const responseToken = response.data?.token
    const responseUser = response.data?.user

    if (!responseToken || !responseUser) {
      throw new Error("Resposta de login inválida.")
    }

    await AsyncStorage.setItem(TOKEN_KEY, responseToken)
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(responseUser))

    setToken(responseToken)
    setUser(responseUser)

    return response
  }

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY)
    await AsyncStorage.removeItem(USER_KEY)

    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }

  return context
}