import { vi } from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render } from "@testing-library/react";
import ProtectedRoute from "../routes/ProtectedRoute";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    role: "aluno",
  }),
}));

describe("ProtectedRoute", () => {
  it("bloqueia acesso de aluno à rota admin", () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="professor">
                <div>Admin Page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Home</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("Admin Page")).not.toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});