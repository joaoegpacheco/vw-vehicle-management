import React, { useState } from "react";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
          <label>
            Modelo:
            <input
              type="text"
              name="model"
              value={newVehicle.model}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Cor:
            <input
              type="text"
              name="color"
              value={newVehicle.color}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Ano:
            <input
              type="number"
              name="year"
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
        </form>
        <button type="submit">Salvar</button>
        <button type="button" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default CreateVehicleModal;
