"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function MyCalendar({ events }: { events?: any[] }) {
  if (!events || !Array.isArray(events)) {
    return <p>Cargando eventos...</p>; // 🔹 Evita el error de `undefined.map`
  }

  const formattedEvents = events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  return (
    <Calendar
      localizer={localizer}
      events={formattedEvents}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  );
}
