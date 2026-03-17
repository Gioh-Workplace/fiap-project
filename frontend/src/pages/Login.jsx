export default function Login() {
    const handleLogin = (role) => {
      localStorage.setItem("role", role)
      window.location.href = "/"
    }
  
    return (
      <div>
        <h1>Login</h1>
  
        <button onClick={() => handleLogin("professor")}>
          Entrar como Professor
        </button>
  
        <button onClick={() => handleLogin("aluno")}>
          Entrar como Aluno
        </button>
      </div>
    )
  }