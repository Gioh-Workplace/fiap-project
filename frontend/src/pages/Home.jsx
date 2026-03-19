import { useEffect, useState } from "react"
import { getPosts } from "../api/posts"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"

const Container = styled.div`
  max-width: 1400px;
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
  background: ${({ bg }) => bg};
  padding: 15px;
  border-radius: 8px;

  aspect-ratio: 1 / 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow: 2px 4px 10px rgba(0,0,0,0.1);
  transform: rotate(-1deg);

  &:hover {
    transform: rotate(0deg) scale(1.03);
    box-shadow: 4px 8px 20px rgba(0,0,0,0.15);
  }

  h2 {
    font-size: 16px;
    margin-bottom: 8px;
    color: #333;

    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  p {
    font-size: 13px;
    color: #555;

    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  small {
    font-size: 11px;
    color: #777;
  }
`
const colors = [
  "#fff3cd", // amarelo
  "#ffe0e0", // rosa claro
  "#ffd6a5", // pêssego
  "#d1ecf1", // azul claro
  "#d4edda", // verde claro
  "#f8d7da", // vermelho claro
  "#e2d5f1", // lilás
  "#fce1f1", // rosa pastel
  "#e0f7fa", // azul aqua
  "#fef9c3", // amarelo suave
  "#e6ffe6", // verde bem leve
  "#f0e68c", // khaki suave
]

const getRandomColor = () =>
  colors[Math.floor(Math.random() * colors.length)]


const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
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

            const sortedPosts = filteredPosts.sort(
              (a, b) => new Date(b.dtCriacao) - new Date(a.dtCriacao)
            )
            

        setPosts(sortedPosts)
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
        <Grid>
 {posts.map((post, index) => (
  <PostCard
    key={post._id}
    bg={colors[index % colors.length]}
      onClick={() => navigate(`/post/${post._id}`)}
    >
      <div>
        <h2>{post.titulo}</h2>
        <p>{post.descricao}</p>
      </div>

      <small>
        {new Date(post.dtCriacao).toLocaleDateString()}
      </small>
    </PostCard>
  ))}
</Grid>
      )}
    </Container>
  )
}