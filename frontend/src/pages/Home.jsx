import { useEffect, useState } from "react"
import { getPosts } from "../api/posts"

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const role = localStorage.getItem("role") || "aluno"

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await getPosts()
        console.log("RESPOSTA:", response)

        // pega o array e filtra se for aluno
        const filteredPosts =
          role === "aluno"
            ? response.data.filter(post => post.status === "publicado")
            : response.data

        setPosts(filteredPosts)
      } catch (error) {
        console.error("Erro ao buscar posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [role])

  if (loading) {
    return <h1>Carregando...</h1>
  }

  return (
    <div>
      <h1>Lista de Posts</h1>

  
      {role === "professor" && (
        <button onClick={() => window.location.href = "/create"}>
          Criar Post
        </button>
      )}

      {posts.length === 0 ? (
        <p>Nenhum post encontrado</p>
      ) : (
        posts.map((post) => (
          <div key={post._id}>
            <h2>{post.titulo}</h2>
            <p>{post.descricao}</p>
            <p><strong>Status:</strong> {post.status}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  )
}