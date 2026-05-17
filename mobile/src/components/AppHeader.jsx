import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import styled from "styled-components/native"
import { useAuth } from "../context/AuthContext"
import { getRoleColor } from "../utils/colors"

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

export default function AppHeader({
  title,
  subtitle,
  showBack = false,
  showLogout = true,
}) {
  const { user, role, logout } = useAuth()
  const roleColors = getRoleColor(role)

  const handleLogout = async () => {
    await logout()
    router.replace("/")
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

        {showLogout && (
          <LogoutButton onPress={handleLogout}>
            <LogoutText>Sair</LogoutText>
          </LogoutButton>
        )}
      </Container>
    </SafeContainer>
  )
}