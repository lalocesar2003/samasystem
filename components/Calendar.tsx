"use client";

import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function MyCalendar() {
  const [date, setDate] = useState(new Date()); // Estado para manejar la fecha actual

  return (
    <Calendar
      localizer={localizer}
      events={[
        {
          title: "Evento de prueba",
          start: new Date(2025, 1, 21), // Recuerda que los meses en JS empiezan desde 0 (Febrero es 1)
          end: new Date(2025, 1, 21),
        },
      ]}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      date={date}
      onNavigate={(newDate) => setDate(newDate)} // Asegura que el calendario actualiza la fecha
    />
  );
}
