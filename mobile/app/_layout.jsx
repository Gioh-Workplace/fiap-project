import { Stack } from "expo-router"
import { AuthProvider } from "../src/context/AuthContext"
import { PostsProvider } from "../src/context/PostsContext"

export default function RootLayout() {
  return (
    <AuthProvider>
      <PostsProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ title: "Fiap Blog" }} />
        </Stack>
      </PostsProvider>
    </AuthProvider>
  )
}