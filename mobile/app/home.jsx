import { View, Text, Pressable, StyleSheet } from "react-native"
import { router } from "expo-router"
import { useAuth } from "../src/context/AuthContext"

export default function HomeScreen() {
  const { user, role, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.replace("/")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mural de Posts</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Usuário logado:</Text>
        <Text style={styles.text}>{user?.nome || user?.email || "Usuário"}</Text>

        <Text style={styles.label}>Perfil:</Text>
        <Text style={styles.text}>{role || "Não informado"}</Text>
      </View>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff7ef",
    borderWidth: 1,
    borderColor: "#ffd6ad",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    color: "#374151",
    marginTop: 8,
  },
  text: {
    color: "#1f2937",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ff7900",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})