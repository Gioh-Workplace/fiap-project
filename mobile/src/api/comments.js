import api from "./api"

export async function getCommentsByPost(postId) {
  const response = await api.get(`/posts/${postId}/comments`)
  return response.data.data
}

export async function createComment(postId, commentData) {
  const response = await api.post(`/posts/${postId}/comments`, commentData)
  return response.data.data
}

export async function updateComment(commentId, commentData) {
  const response = await api.put(`/comments/${commentId}`, commentData)
  return response.data.data
}

export async function deleteComment(commentId) {
  const response = await api.delete(`/comments/${commentId}`)
  return response.data
}