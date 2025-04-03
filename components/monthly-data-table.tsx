"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { type Monthlydata } from "@/lib/types";
import {
  updateMonthlyData,
  deleteMonthlyData,
} from "@/lib/actions/monthlydata.actions";
import { useState } from "react";
import { usePathname } from "next/navigation";
interface MonthlyDataTableProps {
  // Usamos "data" y la función setData
  data: Monthlydata[];
  setData: React.Dispatch<React.SetStateAction<Monthlydata[]>>;
}

export function MonthlyDataTable({ data, setData }: MonthlyDataTableProps) {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 4;

  // Calcular cuántas páginas hay en total
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  // Calcular el rango a mostrar
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = currentPage * ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  // Cuando el usuario modifica un campo:
  const handleChange = async (
    id: string,
    field: keyof Monthlydata,
    value: string
  ) => {
    const numericValue = parseInt(value) || 0;

    // 1) Actualizamos la data en el estado local
    const updatedData = data.map((item) => {
      if (item.id === id) {
        const newItem = { ...item, [field]: numericValue };

        // Validaciones para no exceder
        if (
          field === "inspectionsCompleted" &&
          numericValue > item.inspectionsProgrammed
        ) {
          newItem.inspectionsCompleted = item.inspectionsProgrammed;
        }
        if (
          field === "trainingCompleted" &&
          numericValue > item.trainingProgrammed
        ) {
          newItem.trainingCompleted = item.trainingProgrammed;
        }
        return newItem;
      }
      return item;
    });
    setData(updatedData);

    // 2) Persistimos el cambio en Appwrite
    const updatedItem = updatedData.find((d) => d.id === id);
    if (!updatedItem) return;

    try {
      await updateMonthlyData({
        id: updatedItem.id,
        month: updatedItem.month,
        inspectionsProgrammed: updatedItem.inspectionsProgrammed,
        inspectionsCompleted: updatedItem.inspectionsCompleted,
        trainingProgrammed: updatedItem.trainingProgrammed,
        trainingCompleted: updatedItem.trainingCompleted,
      });
      console.log("Dato actualizado correctamente en Appwrite");
    } catch (err) {
      console.error("Error al actualizar el documento en Appwrite:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Llamamos a la acción "deleteMonthlyData" para eliminar en Appwrite
      await deleteMonthlyData(id);
      // Eliminamos el registro de nuestro state local
      setData((prev) => prev.filter((item) => item.id !== id));
      console.log("Registro eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el documento en Appwrite:", error);
    }
  };
  // Para el porcentaje
  const calculatePercentage = (completed: number, programmed: number) => {
    if (programmed === 0) return 0;
    return ((completed / programmed) * 100).toFixed(1);
  };

  // Manejo de botones de paginación
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabla */}
      <div className="rounded-md border p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mes</TableHead>
              <TableHead>Inspecciones Programadas</TableHead>
              <TableHead>Inspecciones Realizadas</TableHead>
              <TableHead>% Avance</TableHead>
              <TableHead>Capacitaciones Programadas</TableHead>
              <TableHead>Capacitaciones Realizadas</TableHead>
              <TableHead>% Avance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.month}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.inspectionsProgrammed}
                    onChange={(e) =>
                      handleChange(
                        row.id,
                        "inspectionsProgrammed",
                        e.target.value
                      )
                    }
                    className="w-20"
                    min="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.inspectionsCompleted}
                    onChange={(e) =>
                      handleChange(
                        row.id,
                        "inspectionsCompleted",
                        e.target.value
                      )
                    }
                    className="w-20"
                    min="0"
                    max={row.inspectionsProgrammed}
                  />
                </TableCell>
                <TableCell>
                  {calculatePercentage(
                    row.inspectionsCompleted,
                    row.inspectionsProgrammed
                  )}
                  %
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.trainingProgrammed}
                    onChange={(e) =>
                      handleChange(row.id, "trainingProgrammed", e.target.value)
                    }
                    className="w-20"
                    min="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.trainingCompleted}
                    onChange={(e) =>
                      handleChange(row.id, "trainingCompleted", e.target.value)
                    }
                    className="w-20"
                    min="0"
                    max={row.trainingProgrammed}
                  />
                </TableCell>
                <TableCell>
                  {calculatePercentage(
                    row.trainingCompleted,
                    row.trainingProgrammed
                  )}
                  %
                </TableCell>
                <TableCell>
                  {/* Sólo mostramos el botón si estamos en la ruta "/juan" */}
                  {pathname === "/juan" && (
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="bg-red-600 hover:bg-red-700 text-red font-medium py-1 px-3 rounded-md transition-colors duration-200"
                    >
                      Eliminar
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Botones de paginación */}
      <div className="flex items-center justify-center gap-4">
        <button
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
