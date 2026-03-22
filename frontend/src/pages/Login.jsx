import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useAuth } from "../context/AuthContext"
import { loginRequest } from "../api/auth"

const Container = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`

const Card = styled.div`
  background: #fff3cd;
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 2px 4px 15px rgba(0,0,0,0.1);
  transform: rotate(-1deg);
  width: 100%;
  max-width: 420px;
`

const Title = styled.h1`
  margin-bottom: 20px;
`

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
`

const Button = styled.button`
  display: block;
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`

const ErrorMessage = styled.p`
  margin-top: 12px;
  color: #c0392b;
  font-size: 14px;
`

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const data = await loginRequest({ email, senha })

      login({
        user: data.user,
        token: data.token
      })

      navigate("/")
    } catch (err) {
      console.error("Erro no login:", err)
      setError("Email ou senha inválidos.")
    }
  }

  return (
    <Container>
      <Card>
        <Title>Entrar no sistema</Title>

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <Button type="submit">Entrar</Button>
        </form>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Card>
    </Container>
  )
}