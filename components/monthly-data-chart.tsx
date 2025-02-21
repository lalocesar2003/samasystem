"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { type Monthlydata } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface MonthlyDataChartProps {
  data: Monthlydata[];
}

export function MonthlyDataChart({ data }: MonthlyDataChartProps) {
  // 1) Definir un estado inicial basado en el primer mes disponible (si existe)
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    if (data.length > 0 && !selectedMonth) {
      // Inicializa 'selectedMonth' con el primer mes de la lista si no hay ninguno seleccionado
      setSelectedMonth(data[0].month);
    }
  }, [data, selectedMonth]);

  // 2) Filtrar data con el selectedMonth (si no hay, devolvemos array vacío)
  const filteredData = data.filter((item) => item.month === selectedMonth);

  const calculatePercentage = (completed: number, programmed: number) => {
    if (programmed === 0) return 0;
    return (completed / programmed) * 100;
  };

  // Generar data para inspecciones
  const inspectionsData = filteredData
    .map((month) => {
      const completionPercentage = calculatePercentage(
        month.inspectionsCompleted,
        month.inspectionsProgrammed
      );
      return [
        {
          name: "Por Realizar",
          value: 100 - completionPercentage,
          actualValue: month.inspectionsProgrammed - month.inspectionsCompleted,
        },
        {
          name: "Realizadas",
          value: completionPercentage,
          actualValue: month.inspectionsCompleted,
        },
      ];
    })
    .flat();

  // Generar data para capacitaciones
  const trainingData = filteredData
    .map((month) => {
      const completionPercentage = calculatePercentage(
        month.trainingCompleted,
        month.trainingProgrammed
      );
      return [
        {
          name: "Por Realizar",
          value: 100 - completionPercentage,
          actualValue: month.trainingProgrammed - month.trainingCompleted,
        },
        {
          name: "Realizadas",
          value: completionPercentage,
          actualValue: month.trainingCompleted,
        },
      ];
    })
    .flat();

  // Colores para las celdas
  const COLORS = {
    inspections: ["hsl(var(--chart-2))", "hsl(var(--chart-1))"],
    training: ["hsl(var(--chart-4))", "hsl(var(--chart-3))"],
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{`${payload[0].name}`}</p>
          <p>{`${payload[0].value.toFixed(1)}%`}</p>
          <p className="text-sm text-gray-600">{`(${payload[0].payload.actualValue} actividades)`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom Label
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {`${value.toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-4">
      {/* Selector de meses (sin la opción "all") */}
      <div className="w-[200px] mx-auto">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar mes" />
          </SelectTrigger>
          <SelectContent>
            {data.map((month) => (
              <SelectItem key={month.id} value={month.month}>
                {month.month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gráfica de inspecciones */}
        <div className="w-full h-[300px]">
          <h3 className="text-lg font-medium text-center mb-2">
            Inspecciones - {selectedMonth}
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={inspectionsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomLabel}
              >
                {inspectionsData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS.inspections[index % COLORS.inspections.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de capacitaciones */}
        <div className="w-full h-[300px]">
          <h3 className="text-lg font-medium text-center mb-2">
            Capacitaciones - {selectedMonth}
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trainingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomLabel}
              >
                {trainingData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS.training[index % COLORS.training.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
