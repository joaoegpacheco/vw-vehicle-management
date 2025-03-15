import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../api/api";
import CreateVehicleModal from "./CreateVehicleModal";
import EditVehicleModal from "./EditVehicleModal";
import "../styles/Vehicles.css";
import { useNavigate } from "react-router-dom";

interface Vehicle {
  uuid: string;
  creationUserName: string;
  updatedUserName: string;
  model: string;
  color: string;
  year: number;
  imagePath: string;
}

interface VehicleResponse {
  total: number;
  page: number;
  limit: number;
  vehicles: Vehicle[];
}

export default function Vehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [message, setMessage] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const getToken = () => localStorage.getItem("token");

  const getUserFromToken = () => {
    const token = getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded;
    }
    return "";
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleCloseModal = () => {
    setSelectedVehicle(null);
  };

  const handleSaveVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(
      vehicles.map((v) => (v.uuid === updatedVehicle.uuid ? updatedVehicle : v))
    );

    API.put(`/vehicles/${updatedVehicle.uuid}`, updatedVehicle, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        setMessage("Veículo atualizado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar veículo", error);
        setMessage("Erro ao atualizar veículo");
      });
    handleCloseModal();
  };

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    try {
      await API.delete(`/vehicles/${vehicle.uuid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setVehicles(vehicles.filter((v) => v.uuid !== vehicle.uuid));
      setMessage("Veículo excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir veículo", error);
      setMessage("Erro ao excluir veículo");
    }
  };

  async function fetchVehicles() {
    try {
      const { data } = await API.get<VehicleResponse>("/vehicles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (data && Array.isArray(data.vehicles)) {
        setVehicles(data.vehicles);
      } else {
        console.error("Dados inválidos recebidos da API");
      }
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    fetchVehicles();
  }, [navigate]);

  const handleSaveNewVehicle = async (newVehicle: Vehicle) => {
    const userName = getUserFromToken().name;
    const uuid = getUserFromToken().uuid;

    if (userName) {
      newVehicle.creationUserName = userName;
    }
    if (uuid) {
      newVehicle.uuid = uuid;
    }

    try {
      const response = await API.post("/vehicles", newVehicle, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const newVehicleData = response.data as Vehicle;
      setMessage("Veículo cadastrado com sucesso!");
      setVehicles([...vehicles, newVehicleData]);
      fetchVehicles()
      setShowCreateModal(false);
    } catch (error) {
      setMessage("Erro ao cadastrar veículo");
    }
  };

  return (
    <div className="container">
      <h1>Lista de Veículos</h1>

      {vehicles.length === 0 ? (
        <div className="no-vehicles">
          <p>Não há veículos cadastrados ainda.</p>
          <button onClick={() => setShowCreateModal(true)}>
            Criar Novo Veículo
          </button>

          {message && <p>{message}</p>}
        </div>
      ) : (
        <>
          <button onClick={() => setShowCreateModal(true)}>
            Criar Novo Veículo
          </button>

          <table>
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Cor</th>
                <th>Ano</th>
                <th>Imagem</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.uuid}>
                  <td>{v.model}</td>
                  <td>{v.color}</td>
                  <td>{v.year}</td>
                  <td>
                    <img src={v.imagePath} alt={v.model} width="100" />
                  </td>
                  <td className="btn-gap">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditVehicle(v)}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteVehicle(v)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {selectedVehicle && (
        <EditVehicleModal
          vehicle={selectedVehicle}
          onClose={handleCloseModal}
          onSave={handleSaveVehicle}
        />
      )}

      {showCreateModal && (
        <CreateVehicleModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveNewVehicle}
        />
      )}
    </div>
  );
}
