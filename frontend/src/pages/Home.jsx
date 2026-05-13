import { useEffect, useState } from "react"
import { getPosts } from "../api/posts"
import styled from "styled-components"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Toast from "../components/Toast"


const Container = styled.div`
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    margin: 24px auto;
    padding: 0 12px;
  }
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
  position: relative;

   &::before {
    content: "";
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 15px;
    background: rgba(0, 0, 0, 0.08);
    border-radius: 3px;
  }

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
    display: block;
    margin-top: 8px;
    font-size: 11px;
    color: #777;
  }

    @media (max-width: 768px) {
    aspect-ratio: auto;
    min-height: 180px;
    padding: 12px;
  }
`

const StatusBadge = styled.span`
  display: inline-block;
  align-self: flex-start;
  margin-top: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: bold;
  text-transform: capitalize;
  color: #333;

  background: ${({ status }) => {
    switch (status) {
      case "publicado":
        return "#d4edda"
      case "rascunho":
        return "#fff3cd"
      case "arquivado":
        return "#f8d7da"
      default:
        return "#eeeeee"
    }
  }};
`
const EmptyState = styled.p`
  text-align: center;
  color: #777;
  font-size: 16px;
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

   @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 14px;
  }
`

const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`

const SearchInput = styled.input`
  flex: 1;
  min-width: 240px;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const FilterSelect = styled.select`
  min-width: 180px;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`
const AuthorText = styled.small`
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  font-weight: 600;
`


export default function Home() {
  const navigate = useNavigate()
  const { role } = useAuth()
  const location = useLocation()

  const [toast, setToast] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")


  useEffect(() => {
  if (location.state?.toast) {
    setToast(location.state.toast)

    const timer = setTimeout(() => {
      setToast(null)
      navigate(location.pathname, { replace: true, state: {} })
    }, 2500)

    return () => clearTimeout(timer)
  }
}, [location, navigate])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const posts = await getPosts()

        const roleFilteredPosts =
          role === "aluno"
            ? posts.filter((post) => post.status === "publicado")
            : posts

        const sortedPosts = [...roleFilteredPosts].sort(
          (a, b) => new Date(b.dtCriacao) - new Date(a.dtCriacao)
        )
            

        setPosts(sortedPosts)
      } catch (error) {
        console.error("Erro ao buscar posts:", error)
      } finally {
        setLoading(false)
      }
    }

    if (role) {
      fetchPosts()
    }
  }, [role])

  if (loading) {
    return <EmptyState>Carregando posts...</EmptyState>
  }

  const visiblePosts = posts.filter((post) => {
    const matchesSearch =
      post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  
    const matchesStatus =
      role !== "professor" || statusFilter === "todos"
        ? true
        : post.status === statusFilter
  
    return matchesSearch && matchesStatus
  })


  return (
    <Container>
      <Title>Mural de Posts</Title>
  
      <Controls>
  <SearchInput
    type="text"
    placeholder="Buscar por título ou descrição..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  {role === "professor" && (
    <FilterSelect
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="todos">Todos os status</option>
      <option value="publicado">Publicado</option>
      <option value="rascunho">Rascunho</option>
      <option value="arquivado">Arquivado</option>
    </FilterSelect>
  )}
</Controls>
    
  
      {visiblePosts.length === 0 ? (
        <EmptyState>Nenhum post encontrado.</EmptyState>
      ) : (
        <Grid>
 {visiblePosts.map((post, index) => (
  <PostCard
    key={post._id}
    bg={colors[index % colors.length]}
      onClick={() => navigate(`/post/${post._id}`)}
    >
      <div>
        <h2>{post.titulo}</h2>
        <p>{post.descricao}</p>
        <AuthorText>
        Por {post.autor?.nome || post.autor?.name || "Autor desconhecido"}
      </AuthorText>
      </div>

      <div>
                <StatusBadge status={post.status}>
                  {post.status}
                </StatusBadge>
            
                  <small>
                    {new Date(post.dtCriacao).toLocaleDateString()}
                  </small>
      </div>
    </PostCard>
  ))}
</Grid>
      )}
      <Toast message={toast?.message} type={toast?.type} />
    </Container>
  )
}