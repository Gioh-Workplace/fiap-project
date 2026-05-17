import { ActivityIndicator, Alert, FlatList } from "react-native"
import { router } from "expo-router"
import styled from "styled-components/native"
import { useAuth } from "../../src/context/AuthContext"
import { getUsers, deleteUser } from "../../src/api/users"
import { useFocusEffect } from "expo-router"
import { useCallback, useMemo, useState } from "react"

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
`

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
`

const HeaderInfo = styled.View`
  flex: 1;
`

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
`

const Subtitle = styled.Text`
  margin-top: 4px;
  font-size: 13px;
  color: #6b7280;
`

const CreateButton = styled.Pressable`
  background-color: #ff7900;
  padding: 10px 14px;
  border-radius: 8px;
`

const CreateButtonText = styled.Text`
  color: #ffffff;
  font-weight: bold;
`

const FilterRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 16px;
`

const FilterButton = styled.Pressable`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  border-width: 1px;
  border-color: ${({ $active }) => ($active ? "#ff7900" : "#d1d5db")};
  background-color: ${({ $active }) => ($active ? "#ff7900" : "#ffffff")};
`

const FilterText = styled.Text`
  color: ${({ $active }) => ($active ? "#ffffff" : "#374151")};
  font-weight: bold;
  font-size: 13px;
`

const UserCard = styled.View`
  background-color: #fff7ef;
  border-width: 1px;
  border-color: #ffd6ad;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 12px;
`

const UserHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
`

const UserName = styled.Text`
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
`

const RoleBadge = styled.View`
  background-color: #ff7900;
  padding: 4px 8px;
  border-radius: 999px;
`

const RoleText = styled.Text`
  color: #ffffff;
  font-weight: bold;
  font-size: 12px;
  text-transform: capitalize;
`

const UserEmail = styled.Text`
  font-size: 14px;
  color: #374151;
  margin-bottom: 12px;
`

const Actions = styled.View`
  flex-direction: row;
  gap: 10px;
`

const EditButton = styled.Pressable`
  flex: 1;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #ffd6ad;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`

const EditButtonText = styled.Text`
  color: #ff7900;
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
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
`

const HelperText = styled.Text`
  color: #6b7280;
  text-align: center;
`

const ErrorText = styled.Text`
  color: #c0392b;
  text-align: center;
  font-weight: 600;
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

export default function UsersScreen() {
  const { user, role } = useAuth()

  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState("todos")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      console.error("Erro ao buscar usuários:", err)
      setError("Erro ao carregar usuários.")
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchUsers()
    }, [])
  )

  const filteredUsers = useMemo(() => {
    if (filter === "todos") {
      return users
    }

    return users.filter((item) => item.role === filter)
  }, [users, filter])

  const handleDelete = (selectedUser) => {
    const loggedUserId = user?._id || user?.id

    if (selectedUser._id === loggedUserId || selectedUser.id === loggedUserId) {
      Alert.alert("Ação não permitida", "Você não pode excluir o próprio usuário.")
      return
    }

    Alert.alert(
      "Excluir usuário",
      `Deseja excluir ${selectedUser.nome || selectedUser.email}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(selectedUser._id || selectedUser.id)

              setUsers((prevUsers) =>
                prevUsers.filter((item) => {
                  const itemId = item._id || item.id
                  const selectedId = selectedUser._id || selectedUser.id

                  return itemId !== selectedId
                })
              )
            } catch (err) {
              console.error("Erro ao excluir usuário:", err)
              Alert.alert("Erro", "Não foi possível excluir o usuário.")
            }
          },
        },
      ]
    )
  }

  const renderUser = ({ item }) => (
    <UserCard>
      <UserHeader>
        <UserName>{item.nome || "Usuário sem nome"}</UserName>

        <RoleBadge>
          <RoleText>{item.role}</RoleText>
        </RoleBadge>
      </UserHeader>

      <UserEmail>{item.email}</UserEmail>

      <Actions>
        <EditButton onPress={() => router.push(`/users/${item._id || item.id}/edit`)}>
          <EditButtonText>Editar</EditButtonText>
        </EditButton>

        <DeleteButton onPress={() => handleDelete(item)}>
          <DeleteButtonText>Excluir</DeleteButtonText>
        </DeleteButton>
      </Actions>
    </UserCard>
  )

  if (role !== "professor") {
    return (
      <CenterContent>
        <ErrorText>Acesso negado.</ErrorText>
      </CenterContent>
    )
  }

  return (
    <Container>
      <Header>
        <HeaderInfo>
          <Title>Usuários</Title>
          <Subtitle>Gerencie professores e alunos</Subtitle>
        </HeaderInfo>

        <CreateButton onPress={() => router.push("/users/create")}>
          <CreateButtonText>Novo</CreateButtonText>
        </CreateButton>
      </Header>

      <FilterRow>
        <FilterButton $active={filter === "todos"} onPress={() => setFilter("todos")}>
          <FilterText $active={filter === "todos"}>Todos</FilterText>
        </FilterButton>

        <FilterButton $active={filter === "professor"} onPress={() => setFilter("professor")}>
          <FilterText $active={filter === "professor"}>Professores</FilterText>
        </FilterButton>

        <FilterButton $active={filter === "aluno"} onPress={() => setFilter("aluno")}>
          <FilterText $active={filter === "aluno"}>Alunos</FilterText>
        </FilterButton>
      </FilterRow>

      {loading && (
        <CenterContent>
          <ActivityIndicator size="large" color="#ff7900" />
          <HelperText>Carregando usuários...</HelperText>
        </CenterContent>
      )}

      {!loading && error ? (
        <CenterContent>
          <ErrorText>{error}</ErrorText>

          <RetryButton onPress={fetchUsers}>
            <RetryText>Tentar novamente</RetryText>
          </RetryButton>
        </CenterContent>
      ) : null}

      {!loading && !error && (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderUser}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={<HelperText>Nenhum usuário encontrado.</HelperText>}
        />
      )}
    </Container>
  )
}