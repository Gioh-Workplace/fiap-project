import api from "./api"

export async function loginRequest(credentials) {
  const response = await api.post("/auth/login", credentials)
  return response.data
}