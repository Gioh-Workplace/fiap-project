import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { getPostById,deletePost } from "../api/posts"
import { useAuth } from "../context/AuthContext"
import ConfirmModal from "../components/ConfirmModal"


const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
`

const PostWrapper = styled.div`
  background: #fff3cd;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 2px 4px 14px rgba(0, 0, 0, 0.08);
  position: relative;
`

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 16px;
  color: #333;
`

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
`

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
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

const DateText = styled.span`
  font-size: 14px;
  color: #666;
`

const Content = styled.p`
  font-size: 18px;
  line-height: 1.7;
  color: #444;
  white-space: pre-line;
`

const BackButton = styled.button`
  margin-bottom: 20px;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: #fff7ef;
  }
`

const Message = styled.p`
  text-align: center;
  color: #777;
  font-size: 16px;
`

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`

const ActionButton = styled.button`
  padding: 10px 16px;
  background: ${({ primary, theme }) =>
    primary ? theme.colors.primary : theme.colors.white};
  color: ${({ primary, theme }) =>
    primary ? theme.colors.white : theme.colors.text};
  border: 1px solid
    ${({ primary, theme }) =>
      primary ? theme.colors.primary : theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: ${({ primary, theme }) =>
      primary ? theme.colors.primaryDark : "#fff7ef"};
  }
`

const DangerButton = styled.button`
  padding: 10px 16px;
  background: #c0392b;
  color: white;
  border: 1px solid #c0392b;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #a93226;
    border-color: #a93226;
  }
`

export default function Post() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)


  const handleDelete = async () => {
    try {
      setShowDeleteModal(false)
  
      await deletePost(id)
  
      navigate("/", {
        state: {
          toast: {
            type: "success",
            message: "Post excluído com sucesso."
          }
        }
      })
    } catch (error) {
      console.error("Erro ao excluir post:", error)
    }
  }
  

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await getPostById(id)
        setPost(response)
      } catch (error) {
        console.error("Erro ao buscar post:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id])

  if (loading) {
    return (
      <Container>
        <Message>Carregando post...</Message>
      </Container>
    )
  }

  if (!post) {
    return (
      <Container>
        <BackButton onClick={() => navigate("/")}>Voltar</BackButton>
        <Message>Post não encontrado.</Message>
      </Container>
    )
  }

  return (
    <Container>
      <Actions>
        <ActionButton onClick={() => navigate("/")}>Voltar</ActionButton>

        {role === "professor" && (
    <>
      <ActionButton primary onClick={() => navigate(`/edit/${id}`)}>
        Editar
      </ActionButton>

      <DangerButton onClick={() => setShowDeleteModal(true)}>
        Excluir
      </DangerButton>
    </>
  )}
      </Actions>

      <PostWrapper>
        <Title>{post.titulo}</Title>

        <Meta>
          <StatusBadge status={post.status}>{post.status}</StatusBadge>

          {post.dtCriacao && (
            <DateText>
              Criado em {new Date(post.dtCriacao).toLocaleDateString()}
            </DateText>
          )}

          {post.dtAtualizacao && (
            <DateText>
              • Atualizado em {new Date(post.dtAtualizacao).toLocaleDateString()}
            </DateText>
          )}
        </Meta>

        <Content>{post.descricao}</Content>
      </PostWrapper>
      {showDeleteModal && (
      <ConfirmModal
        title="Excluir post"
        message="Tem certeza que deseja excluir este post? Essa ação não poderá ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    )}

    </Container>
  )
}