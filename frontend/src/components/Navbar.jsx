import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Bar = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`

const BarContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const Brand = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`

const NavButton = styled.button`
  padding: 10px 14px;
  background: ${({ primary, theme }) =>
    primary ? theme.colors.primary : theme.colors.white};
  color: ${({ primary, theme }) =>
    primary ? theme.colors.white : theme.colors.text};
  border: 1px solid
    ${({ primary, theme }) =>
      primary ? theme.colors.primary : theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: ${({ primary, theme }) =>
      primary ? theme.colors.primaryDark : "#fff7ef"};
  }
`

const RoleBadge = styled.span`
  padding: 8px 12px;
  border-radius: 999px;
  background: #fff7ef;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`

const UserIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: bold;
`

export default function Navbar() {
  const navigate = useNavigate()
  const { role, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const roleLabel = role === "professor" ? "Professor" : "Aluno"
  const userInitial = role === "professor" ? "P" : "A"

  return (
    <Bar>
      <BarContent>
        <Left>
          <Brand onClick={() => navigate("/")}>Fiap-Blog</Brand>
      

          {role === "professor" && (
            <>
            <NavButton primary onClick={() => navigate("/create")}>
              Criar Post
            </NavButton>
            
            <NavButton onClick={() => navigate("/admin")}>
            Admin
            </NavButton>
            </>
          )}
        </Left>

        <Right>
          <RoleBadge>{roleLabel}</RoleBadge>
          <UserIcon>{userInitial}</UserIcon>
          <NavButton onClick={handleLogout}>Sair</NavButton>
        </Right>
      </BarContent>
    </Bar>
  )
}