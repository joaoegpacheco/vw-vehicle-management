import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
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
          <Link to="/registrar" className="nav-link">
            Criar Usuários
          </Link>
          <button className="logout-button" onClick={handleLogout}>
            Sair
          </button>
        </nav>
      </div>
    </div>
  );
}
