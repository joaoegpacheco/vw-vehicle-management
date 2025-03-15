import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import CreateUser from "./pages/CreateUser";
import UserList from "./pages/UserList";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/veiculos" element={<Vehicles />} />
          <Route path="/registrar" element={<CreateUser />} />
          <Route path="/usuarios" element={<UserList />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
