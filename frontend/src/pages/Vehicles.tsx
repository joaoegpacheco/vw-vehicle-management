import { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../api/api";
import CreateVehicleModal from "./CreateVehicleModal";
import EditVehicleModal, { Vehicle } from "./EditVehicleModal";
import "../styles/Vehicles.css";
import { useNavigate } from "react-router-dom";

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageLimit] = useState<number>(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [sortField, setSortField] = useState<string>("model");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
    API.put(`/vehicles/${updatedVehicle.uuid}`, updatedVehicle)
      .then(() => {
        setMessage("Veículo atualizado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar veículo", error);
        setMessage("Erro ao atualizar veículo");
      });
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

  const fetchVehicles = useCallback(async () => {
    try {
      const { data } = await API.get<VehicleResponse>(`/vehicles`, {
        params: {
          page: currentPage,
          limit: pageLimit,
          search: searchTerm,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data && Array.isArray(data.vehicles)) {
        let sortedVehicles = [...data.vehicles];

        if (sortField && sortOrder) {
          sortedVehicles = sortedVehicles.sort((a, b) => {
            const aValue = a[sortField as keyof Vehicle];
            const bValue = b[sortField as keyof Vehicle];

            if (aValue === undefined) return 1;
            if (bValue === undefined) return -1;

            if (sortOrder === "asc") {
              if (aValue < bValue) return -1;
              if (aValue > bValue) return 1;
              return 0;
            } else {
              if (aValue < bValue) return 1;
              if (aValue > bValue) return -1;
              return 0;
            }
          });
        }

        setVehicles(sortedVehicles);
        setTotalPages(Math.ceil(data.total / pageLimit));
      } else {
        console.error("Dados inválidos recebidos da API");
      }
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
    }
  }, [currentPage, pageLimit, searchTerm, sortField, sortOrder]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    fetchVehicles();
  }, [
    currentPage,
    pageLimit,
    sortField,
    sortOrder,
    searchTerm,
    navigate,
    fetchVehicles,
  ]);

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
      fetchVehicles();
      setShowCreateModal(false);
    } catch (error) {
      setMessage("Erro ao cadastrar veículo");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedField = e.target.value;
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortField(selectedField);
    setSortOrder(newSortOrder);
  };

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleDateString("pt-BR", options);
  };

  return (
    <div className="container">
      <h1>Lista de Veículos</h1>
      <button onClick={() => setShowCreateModal(true)}>
        Criar Novo Veículo
      </button>

      <div className="search-bar">
        <label htmlFor="Search">Pesquise:</label>
        <input
          type="text"
          placeholder="Buscar veículo por modelo ou cor"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="sort-bar">
        <label htmlFor="sortField">Ordenar por:</label>
        <select
          className="select-input"
          id="sortField"
          onChange={handleSortChange}
          value={sortField}
        >
          <option value="model">Modelo</option>
          <option value="color">Cor</option>
          <option value="year">Ano</option>
        </select>
      </div>

      {vehicles.length === 0 ? (
        <div className="no-vehicles">
          <p>Não há veículos cadastrados ainda.</p>
          {message && <p>{message}</p>}
        </div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Cor</th>
                <th>Ano</th>
                <th>Imagem</th>
                <th>Data de Criação</th>
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
                  <td>
                    {formatDate(v?.creationDate || "Data não disponível")}
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

          <div className="pagination-container">
            <button
              className="pagination-button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            <span>{currentPage}</span>

            <button
              className="pagination-button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próximo
            </button>
          </div>
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

      <button type="button" onClick={() => navigate("/dashboard")}>
        Voltar
      </button>
    </div>
  );
}
