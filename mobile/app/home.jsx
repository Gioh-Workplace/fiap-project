import { useEffect, useMemo, useState } from "react"
import { ActivityIndicator, FlatList, Modal } from "react-native"
import { router } from "expo-router"
import styled from "styled-components/native"
import { useAuth } from "../src/context/AuthContext"
import { usePosts } from "../src/context/PostsContext"
import AppHeader from "../src/components/AppHeader"
import BottomNav from "../src/components/BottomNav"
import { getPostColor } from "../src/utils/colors"
import { useViewMode } from "../src/context/ViewModeContext"

const Screen = styled.View`
  flex: 1;
  background-color: ${({ $isAdminView }) =>
    $isAdminView ? "#f8fbff" : "#ffffff"};
`

const Container = styled.View`
  flex: 1;
  padding: 8px 20px 20px 20px;
  background-color: ${({ $isAdminView }) =>
    $isAdminView ? "#f8fbff" : "#ffffff"};
`

const CreatePostButton = styled.Pressable`
  background-color: #2563eb;
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

const SearchInput = styled.TextInput`
  border-width: 1px;
  border-color: #d1d5db;
  border-radius: 10px;
  padding: 12px;
  font-size: 15px;
  margin-bottom: 16px;
  background-color: #ffffff;
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

const StatusBadge = styled.Pressable`
  background-color: ${({ $isAdminView }) =>
    $isAdminView ? "#2563eb" : "#ff7900"};
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

const PostActions = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 12px;
`

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.35);
  align-items: center;
  justify-content: center;
  padding: 24px;
`

const ModalCard = styled.View`
  width: 100%;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 18px;
`

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 6px;
`

const ModalSubtitle = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
`

const ModalOption = styled.Pressable`
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: ${({ $active }) => ($active ? "#2563eb" : "#d1d5db")};
  background-color: ${({ $active }) => ($active ? "#eff6ff" : "#ffffff")};
`

const ModalOptionText = styled.Text`
  color: ${({ $active }) => ($active ? "#2563eb" : "#374151")};
  font-weight: bold;
  font-size: 15px;
  text-transform: capitalize;
`

const ModalCancelButton = styled.Pressable`
  margin-top: 4px;
  padding: 12px;
  border-radius: 10px;
  align-items: center;
  background-color: #f3f4f6;
`

const ModalCancelText = styled.Text`
  color: #374151;
  font-weight: bold;
`

const EditButton = styled.Pressable`
  flex: 1;
  background-color: #2563eb;
  padding: 10px;
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
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`

const DeleteButtonText = styled.Text`
  color: #c0392b;
  font-weight: bold;
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



export default function HomeScreen() {
  const { role } = useAuth()
  const { posts, loading, error, fetchPosts, deletePost, updatePost } = usePosts()
  const { isAdminView } = useViewMode()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatusPost, setSelectedStatusPost] = useState(null)

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

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId)
    } catch (err) {
      console.error("Erro ao excluir post:", err)
    }
  }

  const handleUpdateStatus = async (post, newStatus) => {
    try {
      await updatePost(post._id, {
        titulo: post.titulo,
        descricao: post.descricao,
        status: newStatus,
      })

      setSelectedStatusPost(null)
    } catch (err) {
      console.error("Erro ao atualizar status do post:", err)
    }
  }

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
              <StatusBadge
                $isAdminView={isAdminView}
                disabled={!isAdminView}
                onPress={(event) => {
                  event.stopPropagation()

                  if (isAdminView) {
                    setSelectedStatusPost(item)
                  }
                }}
              >
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

        {isAdminView && (
          <>
            <PostActions>
              <EditButton
                onPress={(event) => {
                  event.stopPropagation()
                  router.push(`/posts/${item._id}/edit`)
                }}
              >
                <EditButtonText>Editar</EditButtonText>
              </EditButton>

              <DeleteButton
                onPress={(event) => {
                  event.stopPropagation()
                  handleDeletePost(item._id)
                }}
              >
                <DeleteButtonText>Excluir</DeleteButtonText>
              </DeleteButton>
            </PostActions>
          </>
        )}
      </PostCard>
    )
  }

  return (
    <Screen $isAdminView={isAdminView}>
      <AppHeader title="Mural de Posts" />

      <Container $isAdminView={isAdminView}>
        {isAdminView && (
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
    <Modal
          transparent
          visible={!!selectedStatusPost}
          animationType="fade"
          onRequestClose={() => setSelectedStatusPost(null)}
        >
          <ModalOverlay>
            <ModalCard>
              <ModalTitle>Alterar status</ModalTitle>

              <ModalSubtitle>
                {selectedStatusPost?.titulo || "Selecione o novo status do post"}
              </ModalSubtitle>

              {["rascunho", "publicado", "arquivado"].map((statusOption) => (
                <ModalOption
                  key={statusOption}
                  $active={selectedStatusPost?.status === statusOption}
                  onPress={() => handleUpdateStatus(selectedStatusPost, statusOption)}
                >
                  <ModalOptionText $active={selectedStatusPost?.status === statusOption}>
                    {statusOption}
                  </ModalOptionText>
                </ModalOption>
              ))}

              <ModalCancelButton onPress={() => setSelectedStatusPost(null)}>
                <ModalCancelText>Cancelar</ModalCancelText>
              </ModalCancelButton>
            </ModalCard>
          </ModalOverlay>
        </Modal>
      <BottomNav />
    </Screen>
  )
}