import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:3000"
})

api.interceptors.request.use((config) => {
  const role = localStorage.getItem("role")

  if (role) {
    config.headers["x-user-role"] = role
  }

  return config
})