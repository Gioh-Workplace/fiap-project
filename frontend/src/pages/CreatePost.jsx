import { useState } from "react"
import { createPost } from "../api/posts"


export default function CreatePost() {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")

  const role = localStorage.getItem("role")

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

      alert("Post criado com sucesso!")

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