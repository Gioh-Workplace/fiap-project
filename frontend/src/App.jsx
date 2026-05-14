import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoute"
import AppLayout from "./components/AppLayout"

import Home from "./pages/Home"
import Post from "./pages/Post"
import CreatePost from "./pages/CreatePost"
import EditPost from "./pages/EditPost"
import Admin from "./pages/Admin"
import Login from "./pages/Login"
import UsersAdmin from "./pages/UsersAdmin";
import UserForm from "./pages/UsersForm"


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<ProtectedRoute><AppLayout> <Home /></AppLayout></ProtectedRoute>}/>
        <Route path="/post/:id"  element={<ProtectedRoute><AppLayout> <Post /></AppLayout> </ProtectedRoute>} />

        <Route path="/create"  element={<ProtectedRoute><AppLayout> <CreatePost /> </AppLayout></ProtectedRoute>} />
        <Route path="/edit/:id"  element={<ProtectedRoute><AppLayout> <EditPost /> </AppLayout></ProtectedRoute>} />

        <Route path="/admin"  element={<ProtectedRoute><AppLayout> <Admin /> </AppLayout></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />

       
        <Route path="/admin/users" element={<ProtectedRoute><AppLayout> <UsersAdmin /> </AppLayout></ProtectedRoute>} />
        <Route path="/admin/users/new" element={<ProtectedRoute><AppLayout><UserForm /></AppLayout></ProtectedRoute>} />
        <Route path="/admin/users/edit/:id" element={<ProtectedRoute><AppLayout><UserForm /></AppLayout></ProtectedRoute>} /> 



      </Routes>
    </BrowserRouter>
  )
}

export default App