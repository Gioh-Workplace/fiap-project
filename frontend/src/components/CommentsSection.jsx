import { useEffect, useState } from "react"
import styled from "styled-components"

import {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} from "../api/comments"

import { useAuth } from "../context/AuthContext"
import Toast from "./Toast"
import ConfirmModal from "./ConfirmModal"

const Container = styled.section`
  margin-top: 32px;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
`

const Title = styled.h2`
  margin: 0 0 20px;
  font-size: 1.4rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`

const TextArea = styled.textarea`
  min-height: 90px;
  resize: vertical;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const PrimaryButton = styled.button`
  align-self: flex-end;
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

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const CommentCard = styled.article`
  border: 1px solid #f1f1f1;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
`

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
`

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const AuthorName = styled.strong`
  font-size: 14px;
`

const DateText = styled.span`
  color: #777;
  font-size: 12px;
`

const CommentText = styled.p`
  margin: 0;
  line-height: 1.5;
  color: #333;
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const ActionButton = styled.button`
  padding: 7px 10px;
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

const EmptyState = styled.p`
  text-align: center;
  color: #777;
  padding: 16px 0;
`

const EditArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

function formatDate(date) {
  if (!date) return ""

  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function CommentsSection({ postId }) {
  const { user, role } = useAuth()

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingContent, setEditingContent] = useState("")
  const [commentToDelete, setCommentToDelete] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  async function fetchComments() {
    try {
      const data = await getCommentsByPost(postId)
      setComments(data)
    } catch (error) {
      console.error("Erro ao buscar comentários:", error)
      setToast({ type: "error", message: "Erro ao carregar comentários." })
    }
  }

  useEffect(() => {
    if (postId) {
      fetchComments()
    }
  }, [postId])

  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => {
      setToast(null)
    }, 2500)

    return () => clearTimeout(timer)
  }, [toast])

  const handleCreateComment = async (event) => {
    event.preventDefault()

    if (!newComment.trim()) {
      setToast({ type: "error", message: "Digite um comentário." })
      return
    }

    try {
      setLoading(true)

      const createdComment = await createComment(postId, {
        conteudo: newComment.trim(),
      })

      setComments((prev) => [createdComment, ...prev])
      setNewComment("")
      setToast({ type: "success", message: "Comentário criado com sucesso." })
    } catch (error) {
      console.error("Erro ao criar comentário:", error)
      setToast({ type: "error", message: "Erro ao criar comentário." })
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (comment) => {
    setEditingCommentId(comment._id)
    setEditingContent(comment.conteudo)
  }

  const cancelEdit = () => {
    setEditingCommentId(null)
    setEditingContent("")
  }

  const handleUpdateComment = async (commentId) => {
    if (!editingContent.trim()) {
      setToast({ type: "error", message: "O comentário não pode ficar vazio." })
      return
    }

    try {
      const updatedComment = await updateComment(commentId, {
        conteudo: editingContent.trim(),
      })

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        )
      )

      cancelEdit()
      setToast({ type: "success", message: "Comentário atualizado com sucesso." })
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error)
      setToast({ type: "error", message: "Erro ao atualizar comentário." })
    }
  }

  const handleDeleteComment = async () => {
    if (!commentToDelete) return

    try {
      await deleteComment(commentToDelete._id)

      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentToDelete._id)
      )

      setCommentToDelete(null)
      setToast({ type: "success", message: "Comentário excluído com sucesso." })
    } catch (error) {
      console.error("Erro ao excluir comentário:", error)
      setToast({ type: "error", message: "Erro ao excluir comentário." })
    }
  }

  const canManageComment = (comment) => {
    const commentAuthorId = comment?.autor?._id || comment?.autor?.id
    const loggedUserId = user?.id || user?._id

    return role === "professor" || String(commentAuthorId) === String(loggedUserId)
  }

  return (
    <Container>
      <Title>Comentários</Title>

      <Form onSubmit={handleCreateComment}>
        <TextArea
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          placeholder="Escreva um comentário..."
        />

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Comentar"}
        </PrimaryButton>
      </Form>

      <CommentList>
        {comments.length === 0 ? (
          <EmptyState>Nenhum comentário ainda.</EmptyState>
        ) : (
          comments.map((comment) => (
            <CommentCard key={comment._id}>
              <CommentHeader>
                <AuthorInfo>
                  <AuthorName>{comment.autor?.nome || "Usuário"}</AuthorName>
                  <DateText>{formatDate(comment.createdAt)}</DateText>
                </AuthorInfo>

                {canManageComment(comment) && (
                  <Actions>
                    <ActionButton onClick={() => startEdit(comment)}>
                      Editar
                    </ActionButton>

                    <DangerButton onClick={() => setCommentToDelete(comment)}>
                      Excluir
                    </DangerButton>
                  </Actions>
                )}
              </CommentHeader>

              {editingCommentId === comment._id ? (
                <EditArea>
                  <TextArea
                    value={editingContent}
                    onChange={(event) => setEditingContent(event.target.value)}
                  />

                  <EditActions>
                    <ActionButton type="button" onClick={cancelEdit}>
                      Cancelar
                    </ActionButton>

                    <PrimaryButton
                      type="button"
                      onClick={() => handleUpdateComment(comment._id)}
                    >
                      Salvar
                    </PrimaryButton>
                  </EditActions>
                </EditArea>
              ) : (
                <CommentText>{comment.conteudo}</CommentText>
              )}
            </CommentCard>
          ))
        )}
      </CommentList>

      {commentToDelete && (
        <ConfirmModal
          title="Excluir comentário"
          message="Tem certeza que deseja excluir este comentário?"
          onCancel={() => setCommentToDelete(null)}
          onConfirm={handleDeleteComment}
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
    </Container>
  )
}