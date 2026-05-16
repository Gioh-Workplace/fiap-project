import { View, Text, Pressable, StyleSheet } from "react-native"
import { router } from "expo-router"

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fiap Blog</Text>
      <Text style={styles.subtitle}>Login Mobile</Text>

      <Pressable style={styles.button} onPress={() => router.push("/home")}>
        <Text style={styles.buttonText}>Entrar</Text>
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
  button: {
    backgroundColor: "#ff7900",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})