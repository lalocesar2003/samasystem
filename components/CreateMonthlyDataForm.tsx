"use client";
import { useState } from "react";
import { createMonthlyData } from "@/lib/actions/monthlydata.actions";

export default function CreateMonthlyDataForm() {
  const [formData, setFormData] = useState({
    month: "",
    inspectionsProgrammed: 0,
    inspectionsCompleted: 0,
    trainingProgrammed: 0, // Corregí el nombre a trainingProgrammed
    trainingCompleted: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newRecord = await createMonthlyData({
        month: formData.month,
        inspectionsProgrammed: formData.inspectionsProgrammed,
        inspectionsCompleted: formData.inspectionsCompleted,
        trainingProgrammed: formData.trainingProgrammed, // Asegurar nombres coincidentes
        trainingCompleted: formData.trainingCompleted,
      });

      if (newRecord) {
        alert("Registro creado exitosamente!");
        console.log("Registro creado:", newRecord); // Ver estructura completa
        setFormData({
          // Resetear formulario
          month: "",
          inspectionsProgrammed: 0,
          inspectionsCompleted: 0,
          trainingProgrammed: 0,
          trainingCompleted: 0,
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Inspecciones Programadas
          </label>
          <input
            type="number"
            value={formData.inspectionsProgrammed}
            onChange={(e) =>
              setFormData({
                ...formData,
                inspectionsProgrammed: Number(e.target.value),
              })
            }
            className="w-full p-2 border rounded-md"
            min="0"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Inspecciones Completadas
          </label>
          <input
            type="number"
            value={formData.inspectionsCompleted}
            onChange={(e) =>
              setFormData({
                ...formData,
                inspectionsCompleted: Number(e.target.value),
              })
            }
            className="w-full p-2 border rounded-md"
            min="0"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Capacitaciones Programadas
          </label>
          <input
            type="number"
            value={formData.trainingProgrammed}
            onChange={(e) =>
              setFormData({
                ...formData,
                trainingProgrammed: Number(e.target.value),
              })
            }
            className="w-full p-2 border rounded-md"
            min="0"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Capacitaciones Completadas
          </label>
          <input
            type="number"
            value={formData.trainingCompleted}
            onChange={(e) =>
              setFormData({
                ...formData,
                trainingCompleted: Number(e.target.value),
              })
            }
            className="w-full p-2 border rounded-md"
            min="0"
            required
          />
        </div>
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
