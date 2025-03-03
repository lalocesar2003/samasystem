"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { listEvents } from "../lib/actions/calendar.actions";

const localizer = momentLocalizer(moment);

export default function MyCalendar() {
  const [eventos, setEventos] = useState<
    { id: string; title: string; start: Date; end: Date }[]
  >([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventosDesdeAppwrite = await listEvents();
        const eventosConvertidos = eventosDesdeAppwrite.map(
          (evento: { id: any; title: any; start: string; end: string }) => ({
            id: evento.id,
            title: evento.title,
            start: moment(evento.start, "YYYY-MM-DD").toDate(),
            end: moment(evento.end, "YYYY-MM-DD").toDate(),
          })
        );
        setEventos(eventosConvertidos);
      } catch (error) {
        console.error("Error obteniendo eventos:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Calendar
      localizer={localizer}
      events={eventos}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  );
}
