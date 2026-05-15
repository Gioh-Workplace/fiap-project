import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "./context/AuthContext"
import { PostsProvider } from "./context/PostsContext"
import App from './App.jsx'

import { ThemeProvider } from "styled-components"
import { GlobalStyle } from "./styles/global"
import { theme } from "./styles/theme"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <PostsProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
      </PostsProvider>
    </AuthProvider>
  </StrictMode>
)
