import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/UserList.css";

interface User {
  uuid: string;
  name: string;
  password: string;
  isRoot: boolean;
  isActived: boolean;
}

interface ApiResponse {
  users: User[];
  message: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get<ApiResponse>("/users");
        setUsers(response.data.users);
      } catch (error: any) {
        setMessage(error.response?.data?.error || "Erro ao carregar usuários");
      }
    };
    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingUser(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      try {
        const response = await API.put<ApiResponse>(
          `/users/${editingUser.uuid}`,
          editingUser
        );
        setMessage(response.data.message);
        setModalVisible(false);
        setEditingUser(null);

        const updatedUsers = users.map((user) =>
          user.uuid === editingUser.uuid ? editingUser : user
        );
        setUsers(updatedUsers);
      } catch (error: any) {
        setMessage(error.response?.data?.error || "Erro ao editar o usuário");
      }
    }
  };

  return (
    <div className="container">
      <h1>Lista de Usuários</h1>

      {message && <p>{message}</p>}

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uuid}>
              <td>{user.name}</td>
              <td>
                <button onClick={() => handleEditClick(user)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" onClick={() => navigate('/dashboard')}>Voltar</button>

      {modalVisible && editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Usuário</h2>
            <form onSubmit={handleSubmitEdit}>
              <div>
                <label htmlFor="name">Nome:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editingUser.name}
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
                  value={editingUser.password}
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
                  checked={editingUser.isRoot}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="isActived">Ativo:</label>
                <input
                  type="checkbox"
                  id="isActived"
                  name="isActived"
                  checked={editingUser.isActived}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit">Salvar Alterações</button>
              <button type="button" onClick={handleModalClose}>
                Fechar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
