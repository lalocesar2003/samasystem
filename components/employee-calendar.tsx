"use client";

import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { EventDetailsModal } from "./event-details-modal";
import { MonthCalendar } from "./month-calendar";
import type { Event } from "@/types/event";
import { getCurrentUserEventsByMonth } from "@/lib/actions/events.actions";
import { Skeleton } from "@/components/ui/skeleton";

interface EmployeeCalendarProps {}

export function EmployeeCalendar({}: EmployeeCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1));
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  // Estado para guardar los eventos del mes cargados desde el backend
  const [monthEvents, setMonthEvents] = useState<Event[]>([]);
  // Estado de carga
  const [isLoading, setIsLoading] = useState(true);

  // Este Effect se disparará al montar el componente y cada vez que 'currentDate' cambie
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-indexado (Ene=0, Dic=11)

        // 1. Llamamos a la Server Action
        const eventsFromApi = await getCurrentUserEventsByMonth(year, month);

        // 2. ¡MUY IMPORTANTE! Convertimos los strings ISO de Appwrite a objetos Date
        //    Tu interfaz 'Event' espera 'start: Date', pero la API devuelve 'start: string'
        const processedEvents: Event[] = eventsFromApi.map((e: any) => ({
          ...e,
          id: e.$id, // Mapeamos $id a id
          start: new Date(e.start),
          end: new Date(e.end),
        }));

        setMonthEvents(processedEvents);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
        // Aquí podrías mostrar un toast de error al usuario
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [currentDate]); // Dependencia: se vuelve a ejecutar si 'currentDate' cambia

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Mi Calendario
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Mis eventos asignados para{" "}
          {currentDate.toLocaleDateString("es-ES", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* El calendario ahora recibe los eventos del estado 'monthEvents' */}
          <MonthCalendar
            date={currentDate}
            events={monthEvents}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onEventClick={setSelectedEvent}
          />
          {/* Podríamos poner un esqueleto de carga aquí si 'isLoading' es true */}
        </div>

        {/* Sidebar - My Tasks */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Mis Tareas
          </h3>
          {isLoading ? (
            // Estado de Carga (Skeleton)
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          ) : monthEvents.length === 0 ? (
            // Estado Vacío
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                No hay tareas asignadas para este mes
              </p>
            </Card>
          ) : (
            // Estado con Datos
            <div className="space-y-3">
              {monthEvents.map((event) => (
                <Card
                  key={event.id}
                  className="p-4 cursor-pointer hover:bg-accent/50 transition-colors border-l-4"
                  style={{
                    borderLeftColor: getCategoryColor(event.category),
                  }}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div>
                    <p className="font-semibold text-foreground">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {event.start.toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.start.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {event.end.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <div className="mt-3">
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {event.category}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {/* El 'isAdmin' se omite, por lo que es 'false' por defecto */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Inspección: "#22c55e",
    Auditoría: "#f59e0b",
    Capacitación: "#3b82f6",
  };
  return colors[category] || "#6b7280";
}
