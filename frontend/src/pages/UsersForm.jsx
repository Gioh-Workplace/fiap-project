import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"

import { createUser, getUserById, updateUser } from "../api/users"
import Toast from "../components/Toast"

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`

const Title = styled.h1`
  margin: 0;
`

const FormCard = styled.form`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
`

const Label = styled.label`
  font-weight: 700;
`

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const Select = styled.select`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const HelperText = styled.span`
  color: #777;
  font-size: 13px;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
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

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const SecondaryButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #fff7ef;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const ErrorText = styled.p`
  color: #c0392b;
  font-weight: 600;
  margin-bottom: 16px;
`

export default function UserForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const isEditing = Boolean(id)

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [role, setRole] = useState("aluno")
  const [loading, setLoading] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!isEditing) return

    async function fetchUser() {
      try {
        setLoadingUser(true)
        setError("")

        const user = await getUserById(id)

        setNome(user.nome || "")
        setEmail(user.email || "")
        setRole(user.role || "aluno")
      } catch (err) {
        console.error("Erro ao buscar usuário:", err)
        setError("Erro ao carregar usuário.")
      } finally {
        setLoadingUser(false)
      }
    }

    fetchUser()
  }, [id, isEditing])

  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => {
      setToast(null)
    }, 2500)

    return () => clearTimeout(timer)
  }, [toast])

  const validateForm = () => {
    if (!nome.trim()) {
      return "Nome é obrigatório."
    }

    if (!email.trim()) {
      return "Email é obrigatório."
    }

    if (!isEditing && !senha.trim()) {
      return "Senha é obrigatória para novos usuários."
    }

    if (!["professor", "aluno"].includes(role)) {
      return "Perfil inválido."
    }

    return ""
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      setError("")

      const userData = {
        nome: nome.trim(),
        email: email.trim(),
        role,
      }

      if (senha.trim()) {
        userData.senha = senha
      }

      if (isEditing) {
        await updateUser(id, userData)
        setToast({ type: "success", message: "Usuário atualizado com sucesso." })
      } else {
        await createUser(userData)
        setToast({ type: "success", message: "Usuário criado com sucesso." })
      }

      setTimeout(() => {
        navigate("/admin/users")
      }, 700)
    } catch (err) {
      console.error("Erro ao salvar usuário:", err)

      const apiMessage =
        err?.response?.data?.message || "Erro ao salvar usuário."

      setError(apiMessage)
      setToast({ type: "error", message: apiMessage })
    } finally {
      setLoading(false)
    }
  }

  if (loadingUser) {
    return (
      <Container>
        <p>Carregando usuário...</p>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>{isEditing ? "Editar Usuário" : "Novo Usuário"}</Title>

        <SecondaryButton type="button" onClick={() => navigate("/admin/users")}>
          Voltar
        </SecondaryButton>
      </Header>

      <FormCard onSubmit={handleSubmit}>
        {error && <ErrorText>{error}</ErrorText>}

        <FormGroup>
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Digite o nome do usuário"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Digite o email do usuário"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="senha">Senha</Label>
          <Input
            id="senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            placeholder={
              isEditing
                ? "Deixe em branco para manter a senha atual"
                : "Digite a senha do usuário"
            }
          />
          {isEditing && (
            <HelperText>
              Na edição, preencha somente se quiser alterar a senha.
            </HelperText>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="role">Tipo de usuário</Label>
          <Select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
          </Select>
        </FormGroup>

        <Actions>
          <SecondaryButton type="button" onClick={() => navigate("/admin/users")}>
            Cancelar
          </SecondaryButton>

          <PrimaryButton type="submit" disabled={loading}>
            {loading
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Criar usuário"}
          </PrimaryButton>
        </Actions>
      </FormCard>

      {toast && <Toast type={toast.type} message={toast.message} />}
    </Container>
  )
}