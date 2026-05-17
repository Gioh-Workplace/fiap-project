import { useEffect, useState } from "react"
import { ActivityIndicator } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import styled from "styled-components/native"
import { useAuth } from "../../../src/context/AuthContext"
import { getUserById, updateUser } from "../../../src/api/users"
import AppHeader from "../../../src/components/AppHeader"

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

const RoleRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 14px;
`

const RoleButton = styled.Pressable`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  border-width: 1px;
  border-color: ${({ $active, $role }) =>
    $active ? ($role === "professor" ? "#2563eb" : "#ff7900") : "#d1d5db"};
  background-color: ${({ $active, $role }) =>
    $active ? ($role === "professor" ? "#2563eb" : "#ff7900") : "#ffffff"};
`

const RoleText = styled.Text`
  color: ${({ $active }) => ($active ? "#ffffff" : "#374151")};
  font-weight: bold;
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

const Screen = styled.View`
  flex: 1;
  background-color: #ffffff;
`

export default function EditUserScreen() {
  const { id } = useLocalSearchParams()
  const { role } = useAuth()

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [userRole, setUserRole] = useState("aluno")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true)
        setError("")

        const userData = await getUserById(id)

        setNome(userData.nome || "")
        setEmail(userData.email || "")
        setUserRole(userData.role || "aluno")
      } catch (err) {
        console.error("Erro ao carregar usuário:", err)
        setError("Erro ao carregar usuário.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadUser()
    }
  }, [id])

  const handleSubmit = async () => {
    setError("")

    if (!nome.trim() || !email.trim()) {
      setError("Informe nome e email.")
      return
    }

    try {
      setSubmitting(true)

      const payload = {
        nome,
        email,
        role: userRole,
      }

      if (senha.trim()) {
        payload.senha = senha
      }

      await updateUser(id, payload)

      router.back()
    } catch (err) {
      console.error("Erro ao editar usuário:", err)
      setError("Erro ao editar usuário.")
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
        <LoadingText>Carregando usuário...</LoadingText>
      </CenterContent>
    )
  }

  return (
    <Screen>
        <AppHeader title="Editar Usuário" showBack />
    <Container>
      <Content>
       
        <FormCard>
          {error ? <ErrorText>{error}</ErrorText> : null}

          <Label>Nome</Label>
          <Input placeholder="Digite o nome" value={nome} onChangeText={setNome} />

          <Label>Email</Label>
          <Input
            placeholder="Digite o email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Label>Nova senha</Label>
          <Input
            placeholder="Deixe em branco para manter a atual"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Label>Tipo de usuário</Label>
          <RoleRow>
            <RoleButton
              $active={userRole === "aluno"}
              $role="aluno"
              onPress={() => setUserRole("aluno")}
            >
              <RoleText $active={userRole === "aluno"}>Aluno</RoleText>
            </RoleButton>

            <RoleButton
              $active={userRole === "professor"}
              $role="professor"
              onPress={() => setUserRole("professor")}
            >
              <RoleText $active={userRole === "professor"}>Professor</RoleText>
            </RoleButton>
          </RoleRow>

          <PrimaryButton onPress={handleSubmit} disabled={submitting} $disabled={submitting}>
            {submitting ? <ActivityIndicator color="#ffffff" /> : <ButtonText>Salvar Alterações</ButtonText>}
          </PrimaryButton>

          <SecondaryButton onPress={() => router.back()}>
            <SecondaryButtonText>Cancelar</SecondaryButtonText>
          </SecondaryButton>
        </FormCard>
      </Content>
    </Container>
    </Screen>
  )
}