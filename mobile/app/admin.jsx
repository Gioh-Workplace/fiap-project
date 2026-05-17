import { router } from "expo-router"
import styled from "styled-components/native"
import AppHeader from "../src/components/AppHeader"
import BottomNav from "../src/components/BottomNav"
import { useAuth } from "../src/context/AuthContext"

const Screen = styled.View`
  flex: 1;
  background-color: #ffffff;
`

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
`

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 12px;
`

const ActionCard = styled.Pressable`
  background-color: #fff7ef;
  border-width: 1px;
  border-color: #ffd6ad;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 12px;
`

const ActionTitle = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
`

const ActionDescription = styled.Text`
  font-size: 14px;
  color: #6b7280;
  line-height: 20px;
`

const AccessDenied = styled.Text`
  color: #c0392b;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-top: 40px;
`

export default function AdminScreen() {
  const { role } = useAuth()

  if (role !== "professor") {
    return (
      <Screen>
        <AppHeader title="Admin" />

        <Container>
          <AccessDenied>Acesso negado.</AccessDenied>
        </Container>

        <BottomNav />
      </Screen>
    )
  }

  return (
    <Screen>
      <AppHeader title="Admin" subtitle="Ações rápidas do painel" />

      <Container>
        <SectionTitle>Posts</SectionTitle>

        <ActionCard onPress={() => router.push("/posts/create")}>
          <ActionTitle>Criar novo post</ActionTitle>
          <ActionDescription>
            Cadastre uma nova postagem como rascunho.
          </ActionDescription>
        </ActionCard>

        <ActionCard onPress={() => router.push("/home")}>
          <ActionTitle>Gerenciar posts</ActionTitle>
          <ActionDescription>
            Acesse a lista de posts para visualizar, editar ou excluir publicações.
          </ActionDescription>
        </ActionCard>

        <SectionTitle>Usuários</SectionTitle>

        <ActionCard onPress={() => router.push("/users")}>
          <ActionTitle>Gerenciar usuários</ActionTitle>
          <ActionDescription>
            Cadastre, edite ou remova professores e alunos.
          </ActionDescription>
        </ActionCard>
      </Container>

      <BottomNav />
    </Screen>
  )
}