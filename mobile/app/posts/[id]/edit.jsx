import { useEffect, useState } from "react"
import { ActivityIndicator } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import styled from "styled-components/native"
import { useAuth } from "../../../src/context/AuthContext"
import { usePosts } from "../../../src/context/PostsContext"

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

const StatusRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 14px;
`

const StatusButton = styled.Pressable`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  border-width: 1px;
  border-color: ${({ $active }) => ($active ? "#ff7900" : "#d1d5db")};
  background-color: ${({ $active }) => ($active ? "#ff7900" : "#ffffff")};
`

const StatusText = styled.Text`
  color: ${({ $active }) => ($active ? "#ffffff" : "#374151")};
  font-weight: bold;
  font-size: 12px;
  text-transform: capitalize;
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

const CenterContent = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: #ffffff;
`

const ErrorText = styled.Text`
  color: #c0392b;
  font-weight: 600;
  text-align: center;
  margin-bottom: 12px;
`

const LoadingText = styled.Text`
  margin-top: 12px;
  color: #6b7280;
`

export default function EditPostScreen() {
  const { id } = useLocalSearchParams()
  const { role } = useAuth()
  const { fetchPostById, updatePost } = usePosts()

  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [status, setStatus] = useState("rascunho")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true)
        setError("")

        const post = await fetchPostById(id)

        setTitulo(post.titulo || "")
        setDescricao(post.descricao || "")
        setStatus(post.status || "rascunho")
      } catch (err) {
        console.error("Erro ao carregar post:", err)
        setError("Erro ao carregar post.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadPost()
    }
  }, [id])

  const handleSubmit = async () => {
    setError("")
  
    if (!titulo.trim() || !descricao.trim()) {
      setError("Informe título e descrição.")
      return
    }
  
    try {
      setSubmitting(true)
  
      await updatePost(id, {
        titulo,
        descricao,
        status,
      })
  
      if (router.canGoBack()) {
        router.back()
      } else {
        router.replace(`/posts/${id}`)
      }
    } catch (err) {
      console.error("Erro ao editar post:", err)
      setError("Erro ao editar post.")
    } finally {
      setSubmitting(false)
    }
  }

  if (role !== "professor") {
    return (
      <CenterContent>
        <ErrorText>Acesso negado.</ErrorText>
      </CenterContent>
    )
  }

  if (loading) {
    return (
      <CenterContent>
        <ActivityIndicator size="large" color="#ff7900" />
        <LoadingText>Carregando post...</LoadingText>
      </CenterContent>
    )
  }

  return (
    <Container>
      <Content>
        <Title>Editar Post</Title>

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

          <Label>Status</Label>
          <StatusRow>
            {["rascunho", "publicado", "arquivado"].map((statusOption) => (
              <StatusButton
                key={statusOption}
                $active={status === statusOption}
                onPress={() => setStatus(statusOption)}
              >
                <StatusText $active={status === statusOption}>
                  {statusOption}
                </StatusText>
              </StatusButton>
            ))}
          </StatusRow>

          <PrimaryButton
            onPress={handleSubmit}
            disabled={submitting}
            $disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ButtonText>Salvar Alterações</ButtonText>
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