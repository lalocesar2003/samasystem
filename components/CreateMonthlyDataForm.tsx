"use client";

import { useState, useEffect } from "react";
import {
  createMonthlyData,
  listAllUsers,
} from "@/lib/actions/monthlydata.actions";

export default function CreateMonthlyDataForm() {
  const [formData, setFormData] = useState({
    month: "",
    inspectionsProgrammed: 0,
    inspectionsCompleted: 0,
    trainingProgrammed: 0,
    trainingCompleted: 0,
    selectedUser: "", // Nuevo campo para usuario seleccionado
  });

  const [users, setUsers] = useState<{ $id: string; fullName: string }[]>([]);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      const userList = await listAllUsers();
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.selectedUser) {
      alert("Por favor selecciona un usuario.");
      return;
    }

    try {
      const newRecord = await createMonthlyData({
        month: formData.month,
        inspectionsProgrammed: formData.inspectionsProgrammed,
        inspectionsCompleted: formData.inspectionsCompleted,
        trainingProgrammed: formData.trainingProgrammed,
        trainingCompleted: formData.trainingCompleted,
        userId: formData.selectedUser, // Enviar usuario seleccionado
      });

      if (newRecord) {
        alert("Registro creado exitosamente!");
        console.log("Registro creado:", newRecord);
        setFormData({
          month: "",
          inspectionsProgrammed: 0,
          inspectionsCompleted: 0,
          trainingProgrammed: 0,
          trainingCompleted: 0,
          selectedUser: "",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear el registro");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-4 bg-white rounded-lg shadow-md"
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Mes</label>
        <input
          type="text"
          placeholder="Ej: Enero 2024"
          value={formData.month}
          onChange={(e) => setFormData({ ...formData, month: e.target.value })}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* ComboBox para seleccionar usuario */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Seleccionar Usuario
        </label>
        <select
          value={formData.selectedUser}
          onChange={(e) =>
            setFormData({ ...formData, selectedUser: e.target.value })
          }
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">-- Selecciona un usuario --</option>
          {users.map((user) => (
            <option key={user.$id} value={user.$id}>
              {user.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Campos restantes */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Inspecciones Programadas", key: "inspectionsProgrammed" },
          { label: "Inspecciones Completadas", key: "inspectionsCompleted" },
          { label: "Capacitaciones Programadas", key: "trainingProgrammed" },
          { label: "Capacitaciones Completadas", key: "trainingCompleted" },
        ].map(({ label, key }) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              type="number"
              value={formData[key as keyof typeof formData] as number}
              onChange={(e) =>
                setFormData({ ...formData, [key]: Number(e.target.value) })
              }
              className="w-full p-2 border rounded-md"
              min="0"
              required
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Crear Registro Mensual
      </button>
    </form>
  );
}
