import api from "./api"

export async function getPosts() {
  const response = await api.get("/posts")
  return response.data.data
}

export async function getPostById(id) {
  const response = await api.get(`/posts/${id}`)
  return response.data.data
}

export async function createPost(postData) {
  const response = await api.post("/posts", postData)
  return response.data.data
}

export async function updatePost(id, postData) {
  const response = await api.put(`/posts/${id}`, postData)
  return response.data.data
}

export async function deletePost(id) {
  const response = await api.delete(`/posts/${id}`)
  return response.data
}