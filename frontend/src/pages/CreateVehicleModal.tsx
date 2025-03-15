import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/Modal.css";

interface Vehicle {
  uuid: string;
  creationUserName: string;
  updatedUserName: string;
  model: string;
  color: string;
  year: number;
  imagePath: string;
}

interface CreateVehicleModalProps {
  onClose: () => void;
  onSave: (newVehicle: Vehicle) => void;
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

const CreateVehicleModal: React.FC<CreateVehicleModalProps> = ({
  onClose,
  onSave,
}) => {
  const [newVehicle, setNewVehicle] = useState<Vehicle>({
    uuid: "",
    creationUserName: "",
    updatedUserName: "",
    model: "",
    color: "",
    year: 0,
    imagePath: "",
  });
  const [globalColors, setColors] = useState<Color[]>([]);
  const [globalModels, setModels] = useState<Model[]>([]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement; 
    setNewVehicle({
      ...newVehicle,
      [name]: value,
    });
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newVehicle);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Criar Novo Veículo</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="color">Cor:</label>
          <select id="color" name="color" className="select-input" value={newVehicle.color} onChange={handleInputChange}>
          <option value=""></option> 
            {globalColors.map((color) => (
              <option key={color.uuid} value={color.colorName}>
                {color.colorName}
              </option>
            ))}
          </select>

          <label htmlFor="model">Modelo:</label>
          <select id="model" name="model" className="select-input" value={newVehicle.model} onChange={handleInputChange}>
          <option value=""></option> 
            {globalModels.map((model) => (
              <option key={model.uuid} value={model.modelName}>
                {model.modelName}
              </option>
            ))}
          </select>
          <label>
            Ano:
            <input
              type="number"
              name="year"
              min={2000}
              value={newVehicle.year}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Imagem URL:
            <input
              type="text"
              name="imagePath"
              value={newVehicle.imagePath}
              onChange={handleInputChange}
              required
            />
          </label>
          <div>
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVehicleModal;
