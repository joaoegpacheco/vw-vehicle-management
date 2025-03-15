import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();

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
          <button className="logout-button" onClick={logout}>
            Sair
          </button>
        </nav>
      </div>
    </div>
  );
}
