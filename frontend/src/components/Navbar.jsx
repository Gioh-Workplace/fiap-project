import styled from "styled-components"
import { useLocation,useNavigate } from "react-router-dom"
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
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`

const Left = styled.div`
   display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

   @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
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

  @media (max-width: 768px) {
    flex: 1 1 auto;
  }
`
const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px;
  height: 100%;
  padding-left:10px;
`;

const NavItem = styled.button`
  position: relative;
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "#ff7900" : "#374151")};
  font-size: 0.95rem;
  font-weight: 700;
  padding: 18px 2px;
  cursor: pointer;
  transition: color 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 8px;
    height: 3px;
    border-radius: 999px;
    background: #ff7900;
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: center;
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #ff7900;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;


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
  const location = useLocation();
  const { role } = useAuth();
  

  const isPostsActive = location.pathname === "/admin";
  const isUsersActive = location.pathname.startsWith("/admin/users");

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
              <NavMenu>
                <NavItem
                  type="button"
                  $active={isPostsActive}
                  onClick={() => navigate("/admin")}
                >
                  Posts
                </NavItem>

                <NavItem
                  type="button"
                  $active={isUsersActive}
                  onClick={() => navigate("/admin/users")}
                >
                  Usuários
                </NavItem>
              </NavMenu>
  )}
        </Left>

        <Right>
          <RoleBadge>{roleLabel}</RoleBadge>
          <UserIcon>{userInitial}</UserIcon>
          <NavButton onClick={() => {logout()
          navigate("/login")
          }}>
          Sair
        </NavButton>
        </Right>
      </BarContent>
    </Bar>
  )
}