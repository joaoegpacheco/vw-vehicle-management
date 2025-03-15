import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/CreateUser.css";

interface User {
  name: string;
  password: string;
  isRoot: boolean;
  isActived: boolean;
}

interface ApiResponse {
  message: string;
}

export default function CreateUser() {
  const [userData, setUserData] = useState<User>({
    name: "",
    password: "",
    isRoot: false,
    isActived: true,
  });

  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await API.post<ApiResponse>("/users", userData);
      setMessage(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      setMessage("Erro ao criar o usuário");
    }
  };

  return (
    <div className="container">
      <h1>Criar Novo Usuário</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="isRoot">Admin (Root):</label>
          <input
            type="checkbox"
            id="isRoot"
            name="isRoot"
            checked={userData.isRoot}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="isActived">Ativo:</label>
          <input
            type="checkbox"
            id="isActived"
            name="isActived"
            checked={userData.isActived}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Criar Usuário</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
