"use client";

import { useState } from "react";
import { Monthlydata } from "@/lib/types";
import { MonthlyDataTable } from "./monthly-data-table";
import { MonthlyDataChart } from "./monthly-data-chart";

// Interfaz de props
interface MonthlyDataParentProps {
  initialData: Monthlydata[];
}

// Exportamos el componente padre
export function MonthlyDataParent({ initialData }: MonthlyDataParentProps) {
  // 1) Manejamos el estado compartido para ambos: tabla y gráfico.
  const [data, setData] = useState<Monthlydata[]>(initialData);

  // 2) Renderizamos tabla y gráfico, pasándoles el mismo 'data'
  // La tabla recibe setData para poder modificar el estado
  // El chart solo requiere leer la data (no la cambia)
  return (
    <div className="space-y-6">
      <MonthlyDataChart data={data} />
      <MonthlyDataTable data={data} setData={setData} />
    </div>
  );
}
