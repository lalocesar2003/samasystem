"use client";

import { AdminCalendar } from "./admin-calendar";
import { EmployeeCalendar } from "./employee-calendar";
// Ya no se necesita 'useState' ni 'mockEvents'

interface CalendarViewProps {
  role: "admin" | "employee";
}

export function CalendarView({ role }: CalendarViewProps) {
  if (role === "admin") {
    // AdminCalendar ahora es "inteligente" y cargará sus propios datos
    return <AdminCalendar />;
  }

  // EmployeeCalendar (del paso anterior) ya es "inteligente"
  return <EmployeeCalendar />;
}
