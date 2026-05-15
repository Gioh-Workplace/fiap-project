import { createContext, useContext, useState } from "react"

import {
  getPosts,
  getPostById,
  createPost as createPostRequest,
  updatePost as updatePostRequest,
  deletePost as deletePostRequest,
} from "../api/posts"

const PostsContext = createContext(null)

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const sortPostsByDate = (postsList) => {
    return [...postsList].sort((a, b) => {
      const dateA = new Date(a.dtCriacao || a.createdAt)
      const dateB = new Date(b.dtCriacao || b.createdAt)

      return dateB - dateA
    })
  }

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getPosts()
      const sortedPosts = sortPostsByDate(data)

      setPosts(sortedPosts)

      return sortedPosts
    } catch (err) {
      console.error("Erro ao buscar posts:", err)
      setError("Erro ao carregar posts.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchPostById = async (id) => {
    try {
      setLoading(true)
      setError("")

      const post = await getPostById(id)

      setSelectedPost(post)

      return post
    } catch (err) {
      console.error("Erro ao buscar post:", err)
      setError("Erro ao carregar post.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (postData) => {
    try {
      setLoading(true)
      setError("")

      const newPost = await createPostRequest(postData)

      setPosts((prevPosts) => sortPostsByDate([newPost, ...prevPosts]))

      return newPost
    } catch (err) {
      console.error("Erro ao criar post:", err)
      setError("Erro ao criar post.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePost = async (id, postData) => {
    try {
      setLoading(true)
      setError("")

      const updatedPost = await updatePostRequest(id, postData)

      setPosts((prevPosts) =>
        sortPostsByDate(
          prevPosts.map((post) =>
            post._id === id ? updatedPost : post
          )
        )
      )

      setSelectedPost((prevPost) =>
        prevPost?._id === id ? updatedPost : prevPost
      )

      return updatedPost
    } catch (err) {
      console.error("Erro ao atualizar post:", err)
      setError("Erro ao atualizar post.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id) => {
    try {
      setLoading(true)
      setError("")

      const response = await deletePostRequest(id)

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id))

      if (selectedPost?._id === id) {
        setSelectedPost(null)
      }

      return response
    } catch (err) {
      console.error("Erro ao excluir post:", err)
      setError("Erro ao excluir post.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    posts,
    selectedPost,
    loading,
    error,
    fetchPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    setPosts,
    setSelectedPost,
  }

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostsContext)

  if (!context) {
    throw new Error("usePosts deve ser usado dentro de PostsProvider")
  }

  return context
}