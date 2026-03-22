import { useState } from "react"
import { createPost } from "../api/posts"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import styled from "styled-components"

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
`

const Button = styled.button`
  margin-top: 15px;
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

const BackButton = styled.button`
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 5px;
  cursor: pointer;
`


export default function CreatePost() {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")

  const { role } = useAuth()
  const navigate = useNavigate()

  if (role !== "professor") {
    return <h1>Acesso negado</h1>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await createPost({
        titulo,
        descricao,
        status: "rascunho"
      })

      navigate("/", {
        state: {
          toast: {
            type: "success",
            message: "Post criado com sucesso."
          }
        }
      })

    } catch (error) {
      console.error("Erro ao criar post:", error)
      alert("Erro ao criar post")
    }
  }

  return (
    <Container>
      <Title>Novo Post</Title>

      <FormCard>

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

          <Button type="submit">Criar Post</Button>
        </form>

        <BackButton onClick={() => navigate("/")}>
          Voltar
        </BackButton>
      </FormCard>
    </Container>
  )
}