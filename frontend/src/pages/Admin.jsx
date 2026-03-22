import { useEffect, useState } from "react"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { getPosts, deletePost,updatePost } from "../api/posts"
import { useAuth } from "../context/AuthContext"
import ConfirmModal from "../components/ConfirmModal"
import Toast from "../components/Toast"

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`

const Title = styled.h1`
  margin-bottom: 20px;
  margin: 0;
`

  const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`


const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
`

const TableWrapper = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
`

const Th = styled.th`
  text-align: left;
  padding: 14px 16px;
  background: #fff7ef;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px
`

const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #f1f1f1;
  vertical-align: middle;
  font-size: 14px;
`
const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`


const ActionButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #fff7ef;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`


const DangerButton = styled(ActionButton)`
  border-color: #c0392b;
  color: #c0392b;

  &:hover {
    background: #fdecea;
    border-color: #c0392b;
  }
`

const StatusSelect = styled.select`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const EmptyState = styled.p`
  text-align: center;
  color: #777;
  padding: 24px;
`
const PrimaryButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`

export default function Admin() {
  const { role } = useAuth()
  const navigate = useNavigate()

  const [posts, setPosts] = useState([])
  const [toast, setToast] = useState(null)
  const [postToDelete, setPostToDelete] = useState(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await getPosts()

        const sortedPosts = [...response.data].sort(
          (a, b) => new Date(b.dtCriacao) - new Date(a.dtCriacao)
        )

        setPosts(sortedPosts)
      } catch (error) {
        console.error("Erro ao buscar posts:", error)
        setToast({ type: "error", message: "Erro ao carregar posts." })
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => {
      setToast(null)
    }, 2500)

    return () => clearTimeout(timer)
  }, [toast])

  if (role !== "professor") {
    return <Container>Acesso negado.</Container>
  }
  const handleDelete = async () => {
    if (!postToDelete) return

    try {
      await deletePost(postToDelete._id)

      setPosts((prev) => prev.filter((p) => p._id !== postToDelete._id))
      setToast({ type: "success", message: "Post excluído com sucesso." })
      setPostToDelete(null)
    } catch (error) {
      console.error("Erro ao excluir post:", error)
      setToast({ type: "error", message: "Erro ao excluir post." })
    }
  }
  
  const handleStatusChange = async (id, newStatus) => {
    const originalPost = posts.find((p) => p._id === id)
    if (!originalPost) return

    try {
      await updatePost(id, {
        titulo: originalPost.titulo,
        descricao: originalPost.descricao,
        status: newStatus
      })

      setPosts((prev) =>
        prev.map((post) =>
          post._id === id ? { ...post, status: newStatus } : post
        )
      )

      setToast({ type: "success", message: "Status atualizado com sucesso." })
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      setToast({ type: "error", message: "Erro ao atualizar status." })
    }
  }



  return (
    <Container>
       <Header>
  <Title>Painel Administrativo</Title>

  <PrimaryButton onClick={() => navigate("/create", {
        state: { returnTo: "/admin" }
      })
    }>
    Novo Post
  </PrimaryButton>
</Header>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Título</Th>
              <Th>Autor</Th>
              <Th>Status</Th>
              <Th>Data</Th>
              <Th>Ações</Th>
            </tr>
          </thead>

          <tbody>
            {posts.length === 0 ? (
              <tr>
                <Td colSpan="5">
                  <EmptyState>Nenhum post encontrado.</EmptyState>
                </Td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post._id}>
                  <Td>{post.titulo}</Td>

                  <Td>
                    {typeof post.autor === "object"
                      ? post.autor?.nome || post.autor?.name || "Sem autor"
                      : post.autor || "Sem autor"}
                  </Td>

                  <Td>
                    <StatusSelect
                      value={post.status}
                      onChange={(e) =>
                        handleStatusChange(post._id, e.target.value)
                      }
                    >
                      <option value="rascunho">Rascunho</option>
                      <option value="publicado">Publicado</option>
                      <option value="arquivado">Arquivado</option>
                    </StatusSelect>
                  </Td>

                  <Td>
                    {post.dtCriacao
                      ? new Date(post.dtCriacao).toLocaleDateString()
                      : "-"}
                  </Td>

                  <Td>
                    <Actions>
                    <ActionButton
                      onClick={() => navigate(`/post/${post._id}`, {
                          state: { returnTo: "/admin" }
                        })
                      }>
                      Ver
                    </ActionButton>

                      <ActionButton
                        onClick={() =>
                          navigate(`/edit/${post._id}`, {
                            state: { returnTo: "/admin" }
                          })
                        }
                      >
                        Editar
                      </ActionButton>

                      <DangerButton onClick={() => setPostToDelete(post)}>
                        Excluir
                      </DangerButton>
                    </Actions>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrapper>

      {postToDelete && (
        <ConfirmModal
          title="Excluir post"
          message={`Tem certeza que deseja excluir "${postToDelete.titulo}"? Essa ação não poderá ser desfeita.`}
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => setPostToDelete(null)}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} />
    </Container>
  )
}