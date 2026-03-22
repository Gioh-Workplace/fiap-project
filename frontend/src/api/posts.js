import { api } from "./api"

export const getPosts = async () => {
  const response = await api.get("/posts")
  return response.data
}

export const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`)
  return response.data
}

export const createPost = async (postData) => {
  const response = await api.post("/post", postData)
  return response.data
}

export const updatePost = async (id, postData) => {
  const response = await api.put(`/post/${id}`, postData)
  return response.data
}

export const deletePost = async (id) => {
  const response = await api.delete(`/post/${id}`)
  return response.data
}