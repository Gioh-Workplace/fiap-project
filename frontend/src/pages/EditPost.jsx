import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { getPostById, updatePost } from "../api/posts"
import { useAuth } from "../context/AuthContext"

const Container = styled.div`
  max-width: 600px;
  margin: 60px auto;
  padding: 20px;
`

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`

const FormCard = styled.div`
  background: #fff3cd;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 2px 4px 10px rgba(0,0,0,0.1);
  transform: rotate(-1deg);
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  min-height: 120px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  resize: none;
  margin-bottom: 15px;
`

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const Button = styled.button`
  margin-top: 10px;
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`

const SecondaryButton = styled.button`
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 5px;
  cursor: pointer;
`

const Message = styled.p`
  text-align: center;
  margin-bottom: 10px;
  color: green;
`

const ErrorMessage = styled.p`
  text-align: center;
  margin-bottom: 10px;
  color: #c0392b;
`

export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()

  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [status, setStatus] = useState("rascunho")
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await getPostById(id)
        const post = response.data ? response.data : response

        setTitulo(post.titulo || "")
        setDescricao(post.descricao || "")
        setStatus(post.status || "rascunho")
      } catch (err) {
        console.error("Erro ao carregar post:", err)
        setError("Não foi possível carregar o post.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id])

  if (role !== "professor") {
    return <Container><ErrorMessage>Acesso negado.</ErrorMessage></Container>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      await updatePost(id, {
        titulo,
        descricao,
        status
      })

      setSuccess(true)

      setTimeout(() => {
        navigate(`/post/${id}`)
      }, 1200)
    } catch (err) {
      console.error("Erro ao atualizar post:", err)
      setError("Erro ao atualizar post.")
    }
  }

  if (loading) {
    return <Container><p>Carregando post...</p></Container>
  }

  return (
    <Container>
      <Title>Editar Post</Title>

      <FormCard>
        {success && <Message>Post atualizado com sucesso!</Message>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <TextArea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="rascunho">Rascunho</option>
            <option value="publicado">Publicado</option>
            <option value="arquivado">Arquivado</option>
          </Select>

          <Button type="submit">Salvar Alterações</Button>
        </form>

        <SecondaryButton onClick={() => navigate(`/post/${id}`)}>
          Cancelar
        </SecondaryButton>
      </FormCard>
    </Container>
  )
}