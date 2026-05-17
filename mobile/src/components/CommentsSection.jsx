import { useEffect, useState } from "react"
import { ActivityIndicator } from "react-native"
import styled from "styled-components/native"
import { useAuth } from "../context/AuthContext"
import {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} from "../api/comments"

const Container = styled.View`
  margin-top: 20px;
`

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 12px;
`

const FormCard = styled.View`
  background-color: #fff7ef;
  border-width: 1px;
  border-color: #ffd6ad;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 16px;
`

const Input = styled.TextInput`
  min-height: 90px;
  border-width: 1px;
  border-color: #d1d5db;
  border-radius: 10px;
  padding: 12px;
  font-size: 15px;
  background-color: #ffffff;
  text-align-vertical: top;
  margin-bottom: 10px;
`

const PrimaryButton = styled.Pressable`
  background-color: #ff7900;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.7 : 1)};
`

const SecondaryButton = styled.Pressable`
  background-color: transparent;
  border-width: 1px;
  border-color: #ffd6ad;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  margin-top: 8px;
`

const ButtonText = styled.Text`
  color: #ffffff;
  font-weight: bold;
`

const SecondaryButtonText = styled.Text`
  color: #ff7900;
  font-weight: bold;
`

const CommentCard = styled.View`
  background-color: #ffffff;
  border-width: 1px;
  border-color: #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 10px;
`

const CommentAuthor = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #374151;
  margin-bottom: 6px;
`

const CommentText = styled.Text`
  font-size: 15px;
  color: #1f2937;
  line-height: 22px;
`

const Actions = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 10px;
`

const ActionButton = styled.Pressable`
  padding: 8px 10px;
  border-radius: 8px;
  background-color: ${({ $danger }) => ($danger ? "#fee2e2" : "#fff7ef")};
`

const ActionText = styled.Text`
  color: ${({ $danger }) => ($danger ? "#c0392b" : "#ff7900")};
  font-weight: bold;
  font-size: 13px;
`

const CenterContent = styled.View`
  align-items: center;
  justify-content: center;
  padding: 20px 0;
`

const HelperText = styled.Text`
  color: #6b7280;
  text-align: center;
`

const ErrorText = styled.Text`
  color: #c0392b;
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
`

export default function CommentsSection({ postId }) {
  const { user, role } = useAuth()

  const [comments, setComments] = useState([])
  const [text, setText] = useState("")
  const [editingComment, setEditingComment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const fetchComments = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getCommentsByPost(postId)
      setComments(data)
    } catch (err) {
      console.error("Erro ao buscar comentários:", err)
      setError("Erro ao carregar comentários.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (postId) {
      fetchComments()
    }
  }, [postId])

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Digite um comentário.")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      if (editingComment) {
        const updatedComment = await updateComment(editingComment._id, {
          conteudo: text,
        })

        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === editingComment._id ? updatedComment : comment
          )
        )

        setEditingComment(null)
      } else {
        const newComment = await createComment(postId, {
          conteudo: text,
        })

        setComments((prevComments) => [newComment, ...prevComments])
      }

      setText("")
    } catch (err) {
      console.error("Erro ao salvar comentário:", err)
      setError("Erro ao salvar comentário.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (comment) => {
    setEditingComment(comment)
    setText(comment.conteudo || "")
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setText("")
    setError("")
  }

  const handleDelete = async (commentId) => {
    try {
      setError("")

      await deleteComment(commentId)

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      )
    } catch (err) {
      console.error("Erro ao excluir comentário:", err)
      setError("Erro ao excluir comentário.")
    }
  }

  const canManageComment = (comment) => {
    const authorId = comment.autor?._id || comment.autor
    const userId = user?._id || user?.id

    return role === "professor" || authorId === userId
  }

  return (
    <Container>
      <Title>Comentários</Title>

      <FormCard>
        {error ? <ErrorText>{error}</ErrorText> : null}

        <Input
          placeholder="Escreva um comentário..."
          value={text}
          onChangeText={setText}
          multiline
        />

        <PrimaryButton
          onPress={handleSubmit}
          disabled={submitting}
          $disabled={submitting}
        >
          <ButtonText>
            {submitting
              ? "Salvando..."
              : editingComment
                ? "Salvar alteração"
                : "Comentar"}
          </ButtonText>
        </PrimaryButton>

        {editingComment && (
          <SecondaryButton onPress={handleCancelEdit}>
            <SecondaryButtonText>Cancelar edição</SecondaryButtonText>
          </SecondaryButton>
        )}
      </FormCard>

      {loading && (
        <CenterContent>
          <ActivityIndicator size="small" color="#ff7900" />
          <HelperText>Carregando comentários...</HelperText>
        </CenterContent>
      )}

      {!loading && comments.length === 0 && (
        <HelperText>Nenhum comentário ainda.</HelperText>
      )}

      {!loading &&
        comments.map((comment) => (
          <CommentCard key={comment._id}>
            <CommentAuthor>
              {comment.autor?.nome || comment.autor?.email || "Usuário"}
            </CommentAuthor>

            <CommentText>{comment.conteudo}</CommentText>

            {canManageComment(comment) && (
              <Actions>
                <ActionButton onPress={() => handleEdit(comment)}>
                  <ActionText>Editar</ActionText>
                </ActionButton>

                <ActionButton
                  $danger
                  onPress={() => handleDelete(comment._id)}
                >
                  <ActionText $danger>Excluir</ActionText>
                </ActionButton>
              </Actions>
            )}
          </CommentCard>
        ))}
    </Container>
  )
}