// Contenido para: @/components/UserRecordsManager.tsx

"use client";

import { useState, useEffect } from "react";
import { listMonthlyDataByUserId } from "@/lib/actions/monthlydata.actions";
import { MonthlyDataTable } from "./monthly-data-table"; // Reutilizamos la tabla
import { type Monthlydata } from "@/lib/types";

// ¡Nuevo nombre para el componente!
export default function UserRecordsManager({ userId }: { userId: string }) {
  const [data, setData] = useState<Monthlydata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchDataForUser = async () => {
      setIsLoading(true);
      try {
        const monthlyData = await listMonthlyDataByUserId(userId);
        setData(monthlyData);
      } catch (error) {
        console.error("Error obteniendo monthlyData:", error);
        setData([]);
      }
      setIsLoading(false);
    };

    fetchDataForUser();
  }, [userId]);

  return (
    <div className="space-y-4">
      {isLoading ? (
        <p>Cargando registros...</p>
      ) : data.length > 0 ? (
        <MonthlyDataTable data={data} setData={setData} />
      ) : (
        <p className="text-sm text-gray-500">
          No hay registros para este usuario.
        </p>
      )}
    </div>
  );
}
