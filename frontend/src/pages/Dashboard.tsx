import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isRoot, setIsRoot] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    try {
      const decodedToken: { isRoot: boolean } = jwtDecode(String(token));
      setIsRoot(decodedToken.isRoot);
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1>Bem-vindo, {user?.name}!</h1>
        <nav>
          <Link to="/veiculos" className="nav-link">
            Gerenciar Veículos
          </Link>
          {isRoot && (
            <Link to="/registrar" className="nav-link">
              Criar Usuários
            </Link>
          )}
          <button className="logout-button" onClick={handleLogout}>
            Sair
          </button>
        </nav>
      </div>
    </div>
  );
}
