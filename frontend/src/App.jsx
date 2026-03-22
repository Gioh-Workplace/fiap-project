import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoute"

import Home from "./pages/Home"
import Post from "./pages/Post"
import CreatePost from "./pages/CreatePost"
import EditPost from "./pages/EditPost"
import Admin from "./pages/Admin"
import Login from "./pages/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<ProtectedRoute> <Home /></ProtectedRoute>}/>
        <Route path="/post/:id"  element={<ProtectedRoute> <Post /> </ProtectedRoute>} />

        <Route path="/create"  element={<ProtectedRoute> <CreatePost /> </ProtectedRoute>} />
        <Route path="/edit/:id"  element={<ProtectedRoute> <EditPost /> </ProtectedRoute>} />

        <Route path="/admin"  element={<ProtectedRoute> <Admin /> </ProtectedRoute>} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App