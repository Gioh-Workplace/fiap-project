import { useState } from "react"
import { ActivityIndicator } from "react-native"
import { router } from "expo-router"
import styled from "styled-components/native"
import { useAuth } from "../../src/context/AuthContext"
import { usePosts } from "../../src/context/PostsContext"

const Container = styled.ScrollView`
  flex: 1;
  background-color: #ffffff;
`

const Content = styled.View`
  padding: 20px;
`

const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 16px;
`

const FormCard = styled.View`
  background-color: #fff7ef;
  border-width: 1px;
  border-color: #ffd6ad;
  border-radius: 14px;
  padding: 16px;
`

const Label = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #374151;
  margin-bottom: 6px;
`

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #d1d5db;
  border-radius: 10px;
  padding: 12px;
  font-size: 15px;
  background-color: #ffffff;
  margin-bottom: 14px;
`

const TextArea = styled.TextInput`
  min-height: 140px;
  border-width: 1px;
  border-color: #d1d5db;
  border-radius: 10px;
  padding: 12px;
  font-size: 15px;
  background-color: #ffffff;
  text-align-vertical: top;
  margin-bottom: 14px;
`

const PrimaryButton = styled.Pressable`
  background-color: #ff7900;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.7 : 1)};
`

const SecondaryButton = styled.Pressable`
  margin-top: 10px;
  background-color: transparent;
  border-width: 1px;
  border-color: #ffd6ad;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`

const ButtonText = styled.Text`
  color: #ffffff;
  font-weight: bold;
  font-size: 15px;
`

const SecondaryButtonText = styled.Text`
  color: #ff7900;
  font-weight: bold;
  font-size: 15px;
`

const ErrorText = styled.Text`
  color: #c0392b;
  font-weight: 600;
  text-align: center;
  margin-bottom: 12px;
`

const AccessDenied = styled.Text`
  color: #c0392b;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-top: 40px;
`

export default function CreatePostScreen() {
  const { role } = useAuth()
  const { createPost } = usePosts()

  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setError("")

    if (!titulo.trim() || !descricao.trim()) {
      setError("Informe título e descrição.")
      return
    }

    try {
      setSubmitting(true)

      await createPost({
        titulo,
        descricao,
        status: "rascunho",
      })

      router.replace("/home")
    } catch (err) {
      console.error("Erro ao criar post:", err)
      setError("Erro ao criar post.")
    } finally {
      setSubmitting(false)
    }
  }

  if (role !== "professor") {
    return (
      <Container>
        <Content>
          <AccessDenied>Acesso negado.</AccessDenied>
        </Content>
      </Container>
    )
  }

  return (
    <Container>
      <Content>
        <Title>Novo Post</Title>

        <FormCard>
          {error ? <ErrorText>{error}</ErrorText> : null}

          <Label>Título</Label>
          <Input
            placeholder="Digite o título"
            value={titulo}
            onChangeText={setTitulo}
          />

          <Label>Descrição</Label>
          <TextArea
            placeholder="Digite a descrição do post"
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />

          <PrimaryButton
            onPress={handleSubmit}
            disabled={submitting}
            $disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ButtonText>Criar Post</ButtonText>
            )}
          </PrimaryButton>

          <SecondaryButton onPress={() => router.back()}>
            <SecondaryButtonText>Cancelar</SecondaryButtonText>
          </SecondaryButton>
        </FormCard>
      </Content>
    </Container>
  )
}