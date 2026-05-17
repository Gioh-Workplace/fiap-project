import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import styled from "styled-components/native"
import { useAuth } from "../context/AuthContext"
import { getRoleColor } from "../utils/colors"
import { useViewMode } from "../context/ViewModeContext"

const SafeContainer = styled(SafeAreaView)`
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #d1d5db;
`

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
`

const BackButton = styled.Pressable`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
`

const BackText = styled.Text`
  font-size: 28px;
  color: #1f2937;
  line-height: 30px;
`

const Info = styled.View`
  flex: 1;
`

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
`

const SubtitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
`

const Subtitle = styled.Text`
  font-size: 13px;
  color: #6b7280;
`

const RoleBadge = styled.View`
  background-color: ${({ $colors }) => $colors.background};
  border-width: 1px;
  border-color: ${({ $colors }) => $colors.border};
  padding: 3px 8px;
  border-radius: 999px;
`

const RoleText = styled.Text`
  color: ${({ $colors }) => $colors.text};
  font-size: 12px;
  font-weight: bold;
  text-transform: capitalize;
`

const LogoutButton = styled.Pressable`
  background-color: #fee2e2;
  padding: 10px 14px;
  border-radius: 10px;
`

const LogoutText = styled.Text`
  color: #c0392b;
  font-weight: bold;
`

const ModeButton = styled.Pressable`
  background-color: ${({ $isAdminView }) =>
    $isAdminView ? "#eff6ff" : "#fff7ef"};
  border-width: 1px;
  border-color: ${({ $isAdminView }) =>
    $isAdminView ? "#2563eb" : "#ff7900"};
  padding: 9px 12px;
  border-radius: 10px;
`

const ModeText = styled.Text`
  color: ${({ $isAdminView }) =>
    $isAdminView ? "#2563eb" : "#ff7900"};
  font-weight: bold;
  font-size: 12px;
`

export default function AppHeader({
  title,
  subtitle,
  showBack = false,
  showLogout = true,
}) {
  const { user, role, logout } = useAuth()
  const { isAdminView, toggleViewMode } = useViewMode()
  const roleColors = getRoleColor(role)

  const handleLogout = async () => {
    await logout()
    router.replace("/")
  }

  const handleToggleViewMode = () => {
    const wasAdminView = isAdminView
  
    toggleViewMode()
  
    if (wasAdminView) {
      router.replace("/home")
    }
  }

  return (
    <SafeContainer edges={["top"]}>
      <Container>
        {showBack && (
          <BackButton onPress={() => router.back()}>
            <BackText>‹</BackText>
          </BackButton>
        )}

        <Info>
          <Title>{title}</Title>

          <SubtitleRow>
            <Subtitle>{subtitle || user?.nome || user?.email || "Usuário"}</Subtitle>

            {role && showLogout && (
              <RoleBadge $colors={roleColors}>
                <RoleText $colors={roleColors}>{role}</RoleText>
              </RoleBadge>
            )}
          </SubtitleRow>
        </Info>

        {role === "professor" && showLogout && (
          <ModeButton $isAdminView={isAdminView} onPress={handleToggleViewMode}>
            <ModeText $isAdminView={isAdminView}>
              {isAdminView ? "Admin" : "Padrão"}
            </ModeText>
          </ModeButton>
        )}    


        {showLogout && (
          <LogoutButton onPress={handleLogout}>
            <LogoutText>Sair</LogoutText>
          </LogoutButton>
        )}
      </Container>
    </SafeContainer>
  )
}