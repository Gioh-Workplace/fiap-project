import { useEffect } from "react"
import { ActivityIndicator } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import styled from "styled-components/native"
import { useAuth } from "../../src/context/AuthContext"
import { usePosts } from "../../src/context/PostsContext"
import CommentsSection from "../../src/components/CommentsSection"
import { getPostColor } from "../../src/utils/colors"
import AppHeader from "../../src/components/AppHeader"

const Container = styled.ScrollView`
  flex: 1;
  background-color: #ffffff;
`

const Content = styled.View`
  padding: 20px;
`

const Card = styled.View`
  background-color: ${({ $colors }) => $colors.background};
  border-width: 1px;
  border-color: ${({ $colors }) => $colors.border};
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

const Actions = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-bottom: 16px;
`

const EditButton = styled.Pressable`
  flex: 1;
  background-color: #ff7900;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`

const EditButtonText = styled.Text`
  color: #ffffff;
  font-weight: bold;
`

const DeleteButton = styled.Pressable`
  flex: 1;
  background-color: #fee2e2;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`

const DeleteButtonText = styled.Text`
  color: #c0392b;
  font-weight: bold;
`

const Screen = styled.View`
  flex: 1;
  background-color: #ffffff;
`

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams()
  const { role } = useAuth()
  const { selectedPost, loading, error, fetchPostById, deletePost } = usePosts()
  const postColor = getPostColor(selectedPost?._id)

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

  const handleDeletePost = async () => {
    try {
      await deletePost(id)
      router.replace("/home")
    } catch (err) {
      console.error("Erro ao excluir post:", err)
    }
  }

  return (
    <Screen>
      <AppHeader title="Post" showBack />


    <Container>
      <Content>
        
        {role === "professor" && (
          <Actions>
              <EditButton onPress={() => router.push(`/posts/${id}/edit`)}>
                <EditButtonText>Editar</EditButtonText>
              </EditButton>

              <DeleteButton onPress={handleDeletePost}>
                <DeleteButtonText>Excluir</DeleteButtonText>
              </DeleteButton>
          </Actions>
        )}


        <Card $colors={postColor}>
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
        <CommentsSection postId={id} />
      </Content>
    </Container>
    </Screen>
  )
}