import { router, usePathname } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import styled from "styled-components/native"
import { useAuth } from "../context/AuthContext"
import { useViewMode } from "../context/ViewModeContext"

const Container = styled.View`
  flex-direction: row;
  background-color: #ffffff;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  padding: 8px 12px ${({ $bottomInset }) => $bottomInset + 8}px 12px;
`

const NavItem = styled.Pressable`
  flex: 1;
  align-items: center;
  padding: 10px 4px;
  border-radius: 10px;
  background-color: ${({ $active }) => ($active ? "#eff6ff" : "#ffffff")};
`

const NavText = styled.Text`
  color: ${({ $active }) => ($active ? "#2563eb" : "#6b7280")};
  font-weight: bold;
  font-size: 13px;
`

export default function BottomNav() {
  const pathname = usePathname()
  const { role } = useAuth()
  const { isAdminView } = useViewMode()
  const insets = useSafeAreaInsets()

  if (role !== "professor" || !isAdminView) {
    return null
  }

  const isPostsActive = pathname === "/home" || pathname.startsWith("/posts")
  const isUsersActive = pathname.startsWith("/users")

  return (
    <Container $bottomInset={insets.bottom}>
      <NavItem $active={isPostsActive} onPress={() => router.push("/home")}>
        <NavText $active={isPostsActive}>Posts</NavText>
      </NavItem>

      <NavItem $active={isUsersActive} onPress={() => router.push("/users")}>
        <NavText $active={isUsersActive}>Usuários</NavText>
      </NavItem>
    </Container>
  )
}