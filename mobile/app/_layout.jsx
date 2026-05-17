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
        <Stack.Screen name="posts/create" options={{ title: "Novo Post" }} />
        <Stack.Screen name="posts/[id]" options={{ title: "Post" }} />
        <Stack.Screen name="posts/[id]/edit" options={{ title: "Editar Post" }} />
        <Stack.Screen name="users/index" options={{ title: "Usuários" }} />
        <Stack.Screen name="users/create" options={{ title: "Novo Usuário" }} />
        <Stack.Screen name="users/[id]/edit" options={{ title: "Editar Usuário" }} />
        </Stack>
      </PostsProvider>
    </AuthProvider>
  )
}