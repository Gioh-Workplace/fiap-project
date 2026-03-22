import { useEffect, useState } from "react"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { getPosts, deletePost } from "../api/posts"
import { useAuth } from "../context/AuthContext"

const Container = styled.div`
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
`

const Title = styled.h1`
  margin-bottom: 20px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
`

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
`

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
`

const ActionButton = styled.button`
  margin-right: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  &:hover {
    background: #fff7ef;
  }
`

const DangerButton = styled(ActionButton)`
  border-color: #c0392b;
  color: #c0392b;
`

export default function Admin() {
  const { role } = useAuth()
  const navigate = useNavigate()

  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function fetchPosts() {
      const response = await getPosts()
      setPosts(response.data)
    }

    fetchPosts()
  }, [])

  if (role !== "professor") {
    return <Container>Acesso negado.</Container>
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Deseja excluir este post?")
    if (!confirmed) return

    try {
      await deletePost(id)
      setPosts(posts.filter((p) => p._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Container>
      <Title>Painel Administrativo</Title>

      <Table>
        <thead>
          <tr>
            <Th>Título</Th>
            <Th>Status</Th>
            <Th>Data</Th>
            <Th>Ações</Th>
          </tr>
        </thead>

        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              <Td>{post.titulo}</Td>
              <Td>{post.status}</Td>
              <Td>
                {new Date(post.dtCriacao).toLocaleDateString()}
              </Td>
              <Td>
                <ActionButton onClick={() => navigate(`/post/${post._id}`)}>
                  Ver
                </ActionButton>

                <ActionButton onClick={() => navigate(`/edit/${post._id}`)}>
                  Editar
                </ActionButton>

                <DangerButton onClick={() => handleDelete(post._id)}>
                  Excluir
                </DangerButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}