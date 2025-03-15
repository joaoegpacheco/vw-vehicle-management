import React, { useEffect, useState } from "react";
import "../styles/Modal.css";
import API from "../api/api";

export interface Vehicle {
  uuid: string;
  creationUserName: string;
  updatedUserName: string;
  model: string;
  color: string;
  year: number;
  imagePath: string;
  creationDate?: string;
}

interface Color {
  uuid: string;
  colorName: string;
}

interface Model {
  uuid: string;
  modelName: string;
}

interface ApiResponse {
  colors: Color[];
  models: Model[];
}

interface EditVehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSave: (updatedVehicle: Vehicle) => void;
}

const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  vehicle,
  onClose,
  onSave,
}) => {
  const [updatedVehicle, setUpdatedVehicle] = useState<Vehicle | null>(vehicle);
  const [globalColors, setColors] = useState<Color[]>([]);
  const [globalModels, setModels] = useState<Model[]>([]);

  useEffect(() => {
    if (vehicle) {
      setUpdatedVehicle(vehicle);
    }
  }, [vehicle]);

  useEffect(() => {
    API.get<ApiResponse>("/colors-and-models", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        const { colors, models } = response.data;
        if (colors && Array.isArray(colors)) {
          setColors(colors);
        }
        if (models && Array.isArray(models)) {
          setModels(models);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar cores e modelos:", error);
      });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (updatedVehicle) {
      setUpdatedVehicle({
        ...updatedVehicle,
        [name]: name === "year" ? parseInt(value) : value, 
      });
    }
  };

  const handleSubmit = () => {
    if (updatedVehicle) {
      onSave(updatedVehicle);
      onClose();
    }
  };

  if (!vehicle) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Veículo</h2>
        <label htmlFor="color">Cor:</label>
        <select
          id="color"
          name="color"
          className="select-input"
          value={updatedVehicle?.color}
          onChange={handleInputChange}
        >
          {globalColors.map((color) => (
            <option key={color.uuid} value={color.colorName}>
              {color.colorName}
            </option>
          ))}
        </select>

        <label htmlFor="model">Modelo:</label>
        <select
          id="model"
          name="model"
          className="select-input"
          value={updatedVehicle?.model}
          onChange={handleInputChange}
        >
          {globalModels.map((model) => (
            <option key={model.uuid} value={model.modelName}>
              {model.modelName}
            </option>
          ))}
        </select>

        <label htmlFor="year">
          Ano:
          <input
            type="number"
            name="year"
            value={updatedVehicle?.year || ""}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Imagem URL:
          <input
            type="text"
            name="imagePath"
            value={updatedVehicle?.imagePath || ""}
            onChange={handleInputChange}
          />
        </label>
        <div>
        <button onClick={handleSubmit}>Salvar</button>
        <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default EditVehicleModal;
