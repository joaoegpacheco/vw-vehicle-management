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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (updatedVehicle) {
      setUpdatedVehicle({
        ...updatedVehicle,
        [name]: value,
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
        <label>
          Modelo:
          <input
            type="text"
            name="model"
            value={updatedVehicle?.model}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Cor:
          <input
            type="text"
            name="color"
            value={updatedVehicle?.color}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Ano:
          <input
            type="number"
            name="year"
            value={updatedVehicle?.year}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Imagem URL:
          <input
            type="text"
            name="imagePath"
            value={updatedVehicle?.imagePath}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={handleSubmit}>Salvar</button>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default EditVehicleModal;
