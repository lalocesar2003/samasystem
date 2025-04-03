"use client";

import { useState, useEffect } from "react";
import {
  listAllUsers,
  listMonthlyDataByUserId,
} from "@/lib/actions/monthlydata.actions";
import { MonthlyDataTable } from "./monthly-data-table";
import { type Monthlydata } from "@/lib/types";

export default function MonthlyDataManager() {
  // Estado para el usuario seleccionado
  const [selectedUser, setSelectedUser] = useState("");
  // Lista de usuarios
  const [users, setUsers] = useState<{ $id: string; fullName: string }[]>([]);
  // Data (MonthlyData) para el usuario seleccionado
  const [data, setData] = useState<Monthlydata[]>([]);

  // Al montar, cargamos todos los usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await listAllUsers();
        setUsers(userList);
      } catch (error) {
        console.error("Error listando usuarios:", error);
      }
    };
    fetchUsers();
  }, []);

  // Cuando cambia el userId seleccionado, cargamos la data para ese user
  const handleUserChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUser(userId);

    if (userId) {
      try {
        const monthlyData = await listMonthlyDataByUserId(userId);
        setData(monthlyData);
      } catch (error) {
        console.error("Error obteniendo monthlyData:", error);
      }
    } else {
      // Si se deselecciona, limpiamos la tabla
      setData([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* SELECT para elegir usuario */}
      <div>
        <label className="block mb-2 font-semibold">Seleccionar Usuario</label>
        <select
          className="border rounded-md p-2 w-64"
          value={selectedUser}
          onChange={handleUserChange}
        >
          <option value="">-- Selecciona un usuario --</option>
          {users.map((user) => (
            <option key={user.$id} value={user.$id}>
              {user.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Si hay usuario seleccionado y data, muestra la tabla */}
      {selectedUser && data.length > 0 && (
        <MonthlyDataTable data={data} setData={setData} />
      )}

      {/* Si no hay data, podrías mostrar un mensaje, opcional */}
      {selectedUser && data.length === 0 && (
        <p className="text-sm text-gray-500">
          No hay registros para este usuario.
        </p>
      )}
    </div>
  );
}
