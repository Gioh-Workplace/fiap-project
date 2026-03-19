import { useState } from "react"
import { createPost } from "../api/posts"
import { useNavigate } from "react-router-dom"

export default function CreatePost() {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [success, setSuccess] = useState(false)

  const role = localStorage.getItem("role")
  localStorage.setItem("role", "professor")
  const navigate = useNavigate()
  

  if (role !== "professor") {
    return <h1>Acesso negado</h1>
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await createPost({
        titulo,
        descricao,
        status: "rascunho"
      })

      setSuccess(true)

      // espera 2 segundos antes de redirecionar
      setTimeout(() => {
        navigate("/")
      }, 2000)
      

      setTitulo("")
      setDescricao("")
    } catch (error) {
      console.error("Erro ao criar post:", error)
      alert("Erro ao criar post")
    }
  }
 
  return (
    <div>
      <h1>Criar Post</h1>

      {success && <p>Post criado com sucesso! Redirecionando...</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div>
          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <button type="submit">Criar</button>
      </form>
    </div>
  )
}