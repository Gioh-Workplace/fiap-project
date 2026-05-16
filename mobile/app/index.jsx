import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import { router } from "expo-router"
import { useAuth } from "../src/context/AuthContext"

export default function LoginScreen() {
  const { login, isLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async () => {
    setError("")

    if (!email.trim() || !senha.trim()) {
      setError("Informe email e senha.")
      return
    }

    try {
      setSubmitting(true)

      await login({
        email,
        senha,
      })

      router.replace("/home")
    } catch (err) {
      console.error("Erro ao fazer login:", err)
      setError("Email ou senha inválidos.")
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff7900" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fiap Blog</Text>
      <Text style={styles.subtitle}>Acesse sua conta</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Pressable
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Entrando..." : "Entrar"}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ff7900",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#ff7900",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    width: "100%",
    color: "#c0392b",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
})