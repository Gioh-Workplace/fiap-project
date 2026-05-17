import { useState } from "react"
import { ActivityIndicator } from "react-native"
import { router } from "expo-router"
import styled from "styled-components/native"
import { useAuth } from "../src/context/AuthContext"


const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #ffffff;
`

const Title = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #ff7900;
  margin-bottom: 8px;
`

const Subtitle = styled.Text`
  font-size: 16px;
  color: #374151;
  margin-bottom: 24px;
`

const ErrorText = styled.Text`
  width: 100%;
  color: #c0392b;
  margin-bottom: 12px;
  text-align: center;
  font-weight: 600;
`

const Input = styled.TextInput`
  width: 100%;
  border-width: 1px;
  border-color: #d1d5db;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  font-size: 16px;
`

const Button = styled.Pressable`
  width: 100%;
  background-color: #ff7900;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
  margin-top: 8px;
  opacity: ${({ $disabled }) => ($disabled ? 0.7 : 1)};
`

const ButtonText = styled.Text`
  color: #ffffff;
  font-weight: bold;
  font-size: 16px;
`

export default function LoginScreen() {
  const { login, isLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async () => {
    setError("")

    if (!email.trim() || !senha.trim()) {
      setError("Informe email e senha.")
      return
    }

    try {
      setSubmitting(true)

      await login({
        email,
        senha,
      })

      router.replace("/home")
    } catch (err) {
      console.error("Erro ao fazer login:", err)
      setError("Email ou senha inválidos.")
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Container>
        <ActivityIndicator size="large" color="#ff7900" />
      </Container>
    )
  }

  return (
    <Container>
      <Title>Fiap Blog</Title>
      <Subtitle>Acesse sua conta</Subtitle>

      {error ? <ErrorText>{error}</ErrorText> : null}

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Button onPress={handleLogin} disabled={submitting} $disabled={submitting}>
        <ButtonText>{submitting ? "Entrando..." : "Entrar"}</ButtonText>
      </Button>
    </Container>
  )
}
