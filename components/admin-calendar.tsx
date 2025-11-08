"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { CreateEventModal } from "./create-event-modal";
import { EditEventModal } from "./edit-event-modal";
import { EventDetailsModal } from "./event-details-modal";
import { MonthCalendar } from "./month-calendar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@/types/event";

// --- Importar Server Actions ---
import {
  getEventsByMonth,
  getEmployeeList,
  createEvent,
  updateEvent,
  deleteEvent,
  CreateEventParams, // Importamos el tipo
} from "@/lib/actions/events.actions";

type Employee = { id: string; name: string };

interface AdminCalendarProps {
  events: Event[];
  onAddEvent: (event: Event) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [monthEvents, setMonthEvents] = useState<Event[]>([]);
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [isPending, startTransition] = useTransition();

  const processApiEvents = (apiEvents: any[]): Event[] => {
    return apiEvents.map((e: any) => ({
      ...e,
      id: e.$id, // Mapear $id a id
      start: new Date(e.start), // Convertir string a Date
      end: new Date(e.end), // Convertir string a Date
    }));
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoadingEmployees(true);
      try {
        const employees = await getEmployeeList();
        setEmployeeList(employees);
      } catch (error) {
        console.error("Error al cargar empleados:", error);
        // Aquí deberías mostrar un toast de error
      } finally {
        setIsLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const eventsFromApi = await getEventsByMonth(year, month);
        setMonthEvents(processApiEvents(eventsFromApi));
      } catch (error) {
        console.error("Error al cargar eventos:", error);
        // Aquí deberías mostrar un toast de error
      } finally {
        setIsLoadingEvents(false);
      }
    };
    fetchEvents();
  }, [currentDate]);

  const handleAddEvent = async (data: CreateEventParams) => {
    startTransition(async () => {
      try {
        const newEventApi = await createEvent(data);
        const newEvent = processApiEvents([newEventApi])[0];

        // Actualizar estado local (solo si el evento es del mes actual)
        if (newEvent.start.getMonth() === currentDate.getMonth()) {
          setMonthEvents((prev) =>
            [...prev, newEvent].sort(
              (a, b) => a.start.getTime() - b.start.getTime()
            )
          );
        }
        setShowCreateModal(false);
        // Mostrar toast de éxito
      } catch (error) {
        console.error("Error al crear evento:", error);
        // Mostrar toast de error
      }
    });
  };

  const handleEditEvent = async (updatedEventData: Event) => {
    startTransition(async () => {
      try {
        const { id: eventId, ...dataToUpdate } = updatedEventData;

        // La action espera 'eventId' y el resto de datos
        const updatedEventApi = await updateEvent({
          eventId,
          ...dataToUpdate,
        });
        const updatedEvent = processApiEvents([updatedEventApi])[0];

        // Actualizar estado local: reemplazar el evento antiguo
        setMonthEvents((prev) =>
          prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        );

        setShowEditModal(false);
        setEditingEvent(null);
        setSelectedEvent(null); // Cerrar modal de detalles si estaba abierto
        // Mostrar toast de éxito
      } catch (error) {
        console.error("Error al actualizar evento:", error);
        // Mostrar toast de error
      }
    });
  };

  const handleDeleteEvent = async (eventId: string) => {
    startTransition(async () => {
      try {
        await deleteEvent(eventId);
        // Actualizar estado local: filtrar el evento eliminado
        setMonthEvents((prev) => prev.filter((e) => e.id !== eventId));
        setSelectedEvent(null); // Cerrar modal de detalles
        // Mostrar toast de éxito
      } catch (error) {
        console.error("Error al eliminar evento:", error);
        // Mostrar toast de error
      }
    });
  };

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

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {currentDate.toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="text-sm text-muted-foreground mt-1 h-5">
            {isLoadingEvents ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <>
                {`${monthEvents.length} evento${monthEvents.length !== 1 ? "s" : ""} programado${monthEvents.length !== 1 ? "s" : ""}`}
              </>
            )}
          </div>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="gap-2"
          disabled={isLoadingEmployees}
        >
          {isLoadingEmployees ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Nuevo Evento
        </Button>
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative">
          {/* Overlay de carga para el calendario */}
          {isLoadingEvents && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          <MonthCalendar
            date={currentDate}
            events={monthEvents}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onEventClick={setSelectedEvent}
          />
        </div>

        {/* Sidebar - Upcoming Events */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Próximos Eventos
          </h3>
          <div className="space-y-3">
            {isLoadingEvents ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ) : monthEvents.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">
                  No hay eventos programados para este mes
                </p>
              </Card>
            ) : (
              // Mostramos los eventos ordenados por fecha, no solo los 5 primeros
              monthEvents.map((event) => (
                <Card
                  key={event.id}
                  className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                      style={{
                        backgroundColor: getCategoryColor(event.category),
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.userName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.start.toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateEventModal
          employeeList={employeeList} // Pasamos la lista de empleados
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleAddEvent} // Pasamos el handler de la action
          isSubmitting={isPending} // Pasamos el estado de carga
        />
      )}

      {showEditModal && editingEvent && (
        <EditEventModal
          event={editingEvent}
          employeeList={employeeList} // Pasamos la lista de empleados
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditEvent} // Pasamos el handler de la action
          isSubmitting={isPending} // Pasamos el estado de carga
        />
      )}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          isAdmin={true}
          onEdit={handleEditClick} // Abre el modal de edición
          onDelete={handleDeleteEvent} // Llama al handler de la action
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
