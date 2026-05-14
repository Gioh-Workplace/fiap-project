import { useEffect, useState } from "react"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"

import { getUsers, deleteUser } from "../api/users"
import { useAuth } from "../context/AuthContext"

import ConfirmModal from "../components/ConfirmModal"
import Toast from "../components/Toast"

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`

const Title = styled.h1`
  margin-bottom: 20px;
  margin: 0;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

const TableWrapper = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: auto;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
`

const Table = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
`

const Th = styled.th`
  text-align: left;
  padding: 14px 16px;
  background: #fff7ef;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
`

const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #f1f1f1;
  vertical-align: middle;
  font-size: 14px;
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const ActionButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #fff7ef;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const DangerButton = styled(ActionButton)`
  border-color: #c0392b;
  color: #c0392b;

  &:hover {
    background: #fdecea;
    border-color: #c0392b;
  }
`

const PrimaryButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`

const FilterSelect = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const RoleBadge = styled.span`
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  background: ${({ $role }) =>
    $role === "professor" ? "#fff7ef" : "#eef7ff"};
  color: ${({ $role, theme }) =>
    $role === "professor" ? theme.colors.primary : "#2563eb"};
  font-weight: 700;
  font-size: 13px;
`

const EmptyState = styled.p`
  text-align: center;
  color: #777;
  padding: 24px;
`

export default function UsersAdmin() {
  const { role } = useAuth()
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [roleFilter, setRoleFilter] = useState("")
  const [toast, setToast] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)

  async function fetchUsers() {
    try {
      const data = await getUsers(roleFilter)
      setUsers(data)
    } catch (error) {
      console.error("Erro ao buscar usuários:", error)
      setToast({ type: "error", message: "Erro ao carregar usuários." })
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [roleFilter])

  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => {
      setToast(null)
    }, 2500)

    return () => clearTimeout(timer)
  }, [toast])

  if (role !== "professor") {
    return <Container>Acesso negado.</Container>
  }

  const handleDelete = async () => {
    if (!userToDelete) return

    try {
      await deleteUser(userToDelete._id)

      setUsers((prev) => prev.filter((user) => user._id !== userToDelete._id))

      setToast({ type: "success", message: "Usuário excluído com sucesso." })
      setUserToDelete(null)
    } catch (error) {
      console.error("Erro ao excluir usuário:", error)
      setToast({ type: "error", message: "Erro ao excluir usuário." })
    }
  }

  return (
    <Container>
      <Header>
        <Title>Gerenciar Usuários</Title>

        <HeaderActions>
          <FilterSelect
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Todos os perfis</option>
            <option value="professor">Professores</option>
            <option value="aluno">Alunos</option>
          </FilterSelect>

          <PrimaryButton onClick={() => navigate("/admin/users/new")}>
            Novo Usuário
          </PrimaryButton>
        </HeaderActions>
      </Header>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Nome</Th>
              <Th>Email</Th>
              <Th>Perfil</Th>
              <Th>Ações</Th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <Td colSpan="4">
                  <EmptyState>Nenhum usuário encontrado.</EmptyState>
                </Td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <Td>{user.nome}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <RoleBadge $role={user.role}>
                      {user.role === "professor" ? "Professor" : "Aluno"}
                    </RoleBadge>
                  </Td>
                  <Td>
                    <Actions>
                      <ActionButton
                        onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                      >
                        Editar
                      </ActionButton>

                      <DangerButton onClick={() => setUserToDelete(user)}>
                        Excluir
                      </DangerButton>
                    </Actions>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrapper>

      {userToDelete && (
        <ConfirmModal
          title="Excluir usuário"
          message={`Tem certeza que deseja excluir o usuário "${userToDelete.nome}"?`}
          onCancel={() => setUserToDelete(null)}
          onConfirm={handleDelete}
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
    </Container>
  )
}