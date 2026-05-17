import { useEffect } from "react"
import { ActivityIndicator } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
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

const BackButton = styled.Pressable`
  align-self: flex-start;
  background-color: #fff7ef;
  border-width: 1px;
  border-color: #ffd6ad;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
`

const BackButtonText = styled.Text`
  color: #ff7900;
  font-weight: bold;
`

const Card = styled.View`
  background-color: #fff7ef;
  border-width: 1px;
  border-color: #ffd6ad;
  border-radius: 14px;
  padding: 18px;
`

const Header = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`

const Title = styled.Text`
  flex: 1;
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
`

const StatusBadge = styled.View`
  background-color: #ff7900;
  padding: 5px 9px;
  border-radius: 999px;
`

const StatusText = styled.Text`
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  text-transform: capitalize;
`

const MetaText = styled.Text`
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 16px;
`

const Description = styled.Text`
  font-size: 16px;
  color: #374151;
  line-height: 24px;
`

const CenterContent = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: #ffffff;
`

const LoadingText = styled.Text`
  margin-top: 12px;
  color: #6b7280;
`

const ErrorText = styled.Text`
  color: #c0392b;
  font-weight: 600;
  text-align: center;
  margin-bottom: 12px;
`

const RetryButton = styled.Pressable`
  background-color: #ff7900;
  padding: 10px 18px;
  border-radius: 8px;
`

const RetryText = styled.Text`
  color: #ffffff;
  font-weight: bold;
`

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams()
  const { role } = useAuth()
  const { selectedPost, loading, error, fetchPostById } = usePosts()

  useEffect(() => {
    if (id) {
      fetchPostById(id)
    }
  }, [id])

  const handleRetry = () => {
    if (id) {
      fetchPostById(id)
    }
  }

  if (loading) {
    return (
      <CenterContent>
        <ActivityIndicator size="large" color="#ff7900" />
        <LoadingText>Carregando post...</LoadingText>
      </CenterContent>
    )
  }

  if (error) {
    return (
      <CenterContent>
        <ErrorText>{error}</ErrorText>

        <RetryButton onPress={handleRetry}>
          <RetryText>Tentar novamente</RetryText>
        </RetryButton>
      </CenterContent>
    )
  }

  if (!selectedPost) {
    return (
      <CenterContent>
        <ErrorText>Post não encontrado.</ErrorText>

        <RetryButton onPress={() => router.back()}>
          <RetryText>Voltar</RetryText>
        </RetryButton>
      </CenterContent>
    )
  }

  return (
    <Container>
      <Content>
        <BackButton onPress={() => router.back()}>
          <BackButtonText>Voltar</BackButtonText>
        </BackButton>

        <Card>
          <Header>
            <Title>{selectedPost.titulo}</Title>

            {role === "professor" && (
              <StatusBadge>
                <StatusText>{selectedPost.status}</StatusText>
              </StatusBadge>
            )}
          </Header>

          <MetaText>
            Autor: {selectedPost.autor?.nome || selectedPost.autor?.email || "Não informado"}
          </MetaText>

          <Description>{selectedPost.descricao}</Description>
        </Card>
      </Content>
    </Container>
  )
}