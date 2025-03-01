// app/events/page.tsx (Ejemplo de una página que lista eventos en el servidor)
import { listEvents } from "@/lib/actions/calendar.actions";

export default async function EventsPage() {
  const events = await listEvents(); // ✅ Llamada en un Server Component

  return (
    <div>
      <h1>Lista de Eventos</h1>
      <ul>
        {events.map((event: any) => (
          <li key={event.$id}>
            {event.title} - {new Date(event.start).toLocaleString()} -{" "}
            {new Date(event.end).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
