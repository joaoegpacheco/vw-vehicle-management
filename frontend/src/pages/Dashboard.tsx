import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Bem-vindo, {user?.name}!</h1>
      <nav>
        <Link to="/vehicles">Gerenciar Veículos</Link>
        <button onClick={logout}>Sair</button>
      </nav>
    </div>
  );
}
