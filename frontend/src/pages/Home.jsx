import { useEffect, useState } from "react"
import { getPosts } from "../api/posts"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
`

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`

const Button = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`

const PostCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: scale(1.02);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

export default function Home() {
  const navigate = useNavigate()

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
    <Container>
      <Title>Lista de Posts</Title>
  
      {role === "professor" && (
        <Button onClick={() => navigate("/create")}>
          Criar Post
        </Button>
      )}
  
      {posts.length === 0 ? (
        <p>Nenhum post encontrado</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            onClick={() => navigate(`/post/${post._id}`)}
          >
            <h2>{post.titulo}</h2>
            <p>{post.descricao}</p>
            <p><strong>Status:</strong> {post.status}</p>
          </PostCard>
        ))
      )}
    </Container>
  )
}