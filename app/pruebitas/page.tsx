// app/events/page.tsx (Ejemplo de una página que lista eventos en el servidor)
import { listEvents } from "@/lib/actions/calendar.actions";
import moment from "moment";

export default async function EventsPage() {
  const events = await listEvents(); // ✅ Llamada en un Server Component
  console.log(events);

  return (
    <div>
      <h1>Lista de Eventos</h1>
      <ul>
        {events.map((event: any) => (
          <li key={event.id}>
            {event.title} - {moment(event.start).format("DD/MM/YYYY")} -{" "}
            {moment(event.end).format("DD/MM/YYYY")}
          </li>
        ))}
      </ul>
    </div>
  );
}
