"use client";

import { Card } from "@/components/ui/card";
import { CalendarView } from "@/components/calendar-view";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Mi Calendario
            </h1>
            <p className="text-muted-foreground mt-1">
              Eventos asignados para ti
            </p>
          </div>
          <Button variant="outline" asChild>
            <a href="/admin">
              <Settings className="w-4 h-4 mr-2" />
              Administración
            </a>
          </Button>
        </div>
        <Card className="p-6">
          <CalendarView role="employee" />
        </Card>
      </div>
    </div>
  );
}
