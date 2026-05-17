import { useEffect, useMemo, useState } from "react"
import { ActivityIndicator, FlatList } from "react-native"
import { router } from "expo-router"
import styled from "styled-components/native"
import { useAuth } from "../src/context/AuthContext"
import { usePosts } from "../src/context/PostsContext"
import AppHeader from "../src/components/AppHeader"
import BottomNav from "../src/components/BottomNav"
import { getPostColor } from "../src/utils/colors"


const SearchInput = styled.TextInput`
  border-width: 1px;
  border-color: #d1d5db;
  border-radius: 10px;
  padding: 12px;
  font-size: 15px;
  margin-bottom: 16px;
`

const PostCard = styled.Pressable`
  background-color: ${({ $colors }) => $colors.background};
  border-width: 1px;
  border-color: ${({ $colors }) => $colors.border};
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 12px;
`

const PostHeader = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`

const PostTitle = styled.Text`
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
`

const StatusBadge = styled.View`
  background-color: #ff7900;
  padding: 4px 8px;
  border-radius: 999px;
`

const StatusText = styled.Text`
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  text-transform: capitalize;
`

const PostDescription = styled.Text`
  font-size: 14px;
  color: #374151;
  line-height: 20px;
  margin-bottom: 10px;
`

const PostAuthor = styled.Text`
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
`

const CenterContent = styled.View`
  align-items: center;
  justify-content: center;
  padding: 32px 0;
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

const EmptyText = styled.Text`
  text-align: center;
  color: #6b7280;
  margin-top: 32px;
`
const Screen = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding-top:2px;
`

const Container = styled.View`
  flex: 1;
  padding: 10px 20px 20px 20px;
  background-color: #ffffff;
`

const CreatePostButton = styled.Pressable`
  background-color: #ff7900;
  padding: 14px;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 14px;
`

const CreatePostButtonText = styled.Text`
  color: #ffffff;
  font-weight: bold;
  font-size: 15px;
`



export default function HomeScreen() {
  const { role } = useAuth()
  const { posts, loading, error, fetchPosts } = usePosts()

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [])

  const visiblePosts = useMemo(() => {
    const roleFilteredPosts =
      role === "aluno"
        ? posts.filter((post) => post.status === "publicado")
        : posts

    return roleFilteredPosts.filter((post) => {
      const search = searchTerm.toLowerCase()

      const title = post.titulo?.toLowerCase() || ""
      const description = post.descricao?.toLowerCase() || ""

      return title.includes(search) || description.includes(search)
    })
  }, [posts, role, searchTerm])

  

  const renderPost = ({ item }) => {
    const postColor = getPostColor(item._id)
  
    return (
      <PostCard
        $colors={postColor}
        onPress={() => router.push(`/posts/${item._id}`)}
      >
        <PostHeader>
          <PostTitle>{item.titulo}</PostTitle>
  
          {role === "professor" && (
            <StatusBadge>
              <StatusText>{item.status}</StatusText>
            </StatusBadge>
          )}
        </PostHeader>
  
        <PostDescription numberOfLines={3}>
          {item.descricao}
        </PostDescription>
  
        <PostAuthor>
          Autor: {item.autor?.nome || item.autor?.email || "Não informado"}
        </PostAuthor>
      </PostCard>
    )
  }

  return (
    <Screen>
      <AppHeader title="Mural de Posts" />
      <Container>
      {role === "professor" && (
        <CreatePostButton onPress={() => router.push("/posts/create")}>
          <CreatePostButtonText>Novo Post</CreatePostButtonText>
        </CreatePostButton>
      )}

        <SearchInput
          placeholder="Buscar por título ou descrição..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
  
        {loading && (
          <CenterContent>
            <ActivityIndicator size="large" color="#ff7900" />
            <LoadingText>Carregando posts...</LoadingText>
          </CenterContent>
        )}
  
        {!loading && error ? (
          <CenterContent>
            <ErrorText>{error}</ErrorText>
  
            <RetryButton onPress={fetchPosts}>
              <RetryText>Tentar novamente</RetryText>
            </RetryButton>
          </CenterContent>
        ) : null}
  
        {!loading && !error && (
          <FlatList
            data={visiblePosts}
            keyExtractor={(item) => item._id}
            renderItem={renderPost}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={<EmptyText>Nenhum post encontrado.</EmptyText>}
          />
        )}
      </Container>
  
      <BottomNav />
    </Screen>
  )
}
