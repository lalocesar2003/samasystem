"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Event } from "@/types/event";

interface MonthCalendarProps {
  date: Date;
  events: Event[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onEventClick: (event: Event) => void;
}

export function MonthCalendar({
  date,
  events,
  onPreviousMonth,
  onNextMonth,
  onEventClick,
}: MonthCalendarProps) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  // Corregimos el 'getDay()' para que Domingo sea 0 (como debe ser)
  const startingDayOfWeek = firstDay.getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek }, () => null);
  const calendarDays = [...emptyDays, ...days];

  const getEventsForDay = (day: number) => {
    // Este filtro sigue funcionando porque 'events' ya contiene objetos Date
    return events.filter((e) => e.start.getDate() === day);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={onPreviousMonth}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="text-lg font-semibold text-foreground">
          {date.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
        </h3>
        <Button variant="ghost" size="icon" onClick={onNextMonth}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const dayEvents = day ? getEventsForDay(day) : [];

          return (
            <div
              key={index}
              className="min-h-24 p-2 border border-border rounded-lg bg-background hover:bg-accent/30 transition-colors"
            >
              {day && (
                <>
                  <p className="text-sm font-medium text-foreground mb-2">
                    {day}
                  </p>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs px-2 py-1 rounded bg-green-100/50 text-green-700 cursor-pointer hover:bg-green-100 truncate"
                        onClick={() => onEventClick(event)}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-xs text-muted-foreground px-2">
                        +{dayEvents.length - 2} más
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
