import { Stack } from "expo-router"
import { AuthProvider } from "../src/context/AuthContext"
import { PostsProvider } from "../src/context/PostsContext"
import { ViewModeProvider } from "../src/context/ViewModeContext"

export default function RootLayout() {
  return (
    <AuthProvider>
      <ViewModeProvider>
        <PostsProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen name="posts/create" options={{ headerShown: false }} />
            <Stack.Screen name="posts/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="posts/[id]/edit" options={{ headerShown: false }} />
            <Stack.Screen name="users/index" options={{ headerShown: false }} />
            <Stack.Screen name="users/create" options={{ headerShown: false }} />
            <Stack.Screen name="users/[id]/edit" options={{ headerShown: false }} />
          </Stack>
        </PostsProvider>
      </ViewModeProvider>
    </AuthProvider>
  )
}