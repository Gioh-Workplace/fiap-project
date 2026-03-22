import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

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
`

const Title = styled.h1`
  margin-bottom: 20px;
`

const Button = styled.button`
  display: block;
  width: 100%;
  margin-top: 10px;
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

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (role) => {
    login(role)
    navigate("/")
  }

  return (
    <Container>
      <Card>
        <Title>Entrar no sistema</Title>

        <Button onClick={() => handleLogin("aluno")}>
          Entrar como Aluno
        </Button>

        <Button onClick={() => handleLogin("professor")}>
          Entrar como Professor
        </Button>
      </Card>
    </Container>
  )
}