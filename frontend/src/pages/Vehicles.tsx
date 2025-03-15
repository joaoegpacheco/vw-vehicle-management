import { useEffect, useState } from "react";
import API from "../api/api";

interface Vehicle {
  uuid: string;
  creationUserName: string;
  updatedUserName: string;
  model: { modeName: string };
  color: { colorName: string };
  year: number;
  imagePath: string;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    async function fetchVehicles() {
      const { data } = await API.get("/vehicles");
      setVehicles(data as Vehicle[]);
    }
    fetchVehicles();
  }, []);

  return (
    <div>
      <h1>Lista de Veículos</h1>
      <table>
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Cor</th>
            <th>Ano</th>
            <th>Imagem</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.uuid}>
              <td>{v.model.modeName}</td>
              <td>{v.color.colorName}</td>
              <td>{v.year}</td>
              <td>
                <img src={v.imagePath} alt={v.model.modeName} width="100" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
