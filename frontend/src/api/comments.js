import { api } from "./api"

export const getCommentsByPost = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`)
  return response.data.data
}

export const createComment = async (postId, commentData) => {
  const response = await api.post(`/posts/${postId}/comments`, commentData)
  return response.data.data
}

export const updateComment = async (id, commentData) => {
  const response = await api.put(`/comments/${id}`, commentData)
  return response.data.data
}

export const deleteComment = async (id) => {
  const response = await api.delete(`/comments/${id}`)
  return response.data
}