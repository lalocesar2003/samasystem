"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateEventParams } from "@/lib/actions/events.actions"; // Importamos el tipo
import { Loader2 } from "lucide-react"; // Para el spinner

type Employee = { id: string; name: string };

interface CreateEventModalProps {
  onClose: () => void;
  onSubmit: (data: CreateEventParams) => Promise<void>; // Espera la server action
  employeeList: Employee[]; // Recibe la lista como prop
  isSubmitting: boolean; // Recibe el estado de carga
}

const CATEGORIES = ["Inspección", "Auditoría", "Capacitación"];
export function CreateEventModal({
  onClose,
  onSubmit,
  employeeList,
  isSubmitting,
}: CreateEventModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Inspección");
  const [employeeId, setEmployeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [error, setError] = useState<string | null>(null); // Para validación

  const handleSubmit = async () => {
    setError(null);
    if (!title || !startDate || !employeeId || !category) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }
    const selectedEmployee = employeeList.find((e) => e.id === employeeId);
    if (!selectedEmployee) {
      setError("Empleado seleccionado no es válido.");
      return;
    }

    const startDateTimeString = `${startDate}T${startTime}`;
    const endDateTimeString = `${startDate}T${endTime}`;

    const start = new Date(startDateTimeString);
    const end = new Date(endDateTimeString);

    if (end <= start) {
      setError("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    const eventData: CreateEventParams = {
      title,
      category,
      start,
      end,
      userId: selectedEmployee.id,
      userName: selectedEmployee.name,
    };

    await onSubmit(eventData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Evento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Título del Evento *
            </Label>
            <Input
              id="title"
              placeholder="Ej: Inspección de extintores"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium">
              Categoría *
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="employee" className="text-sm font-medium">
              Empleado Asignado *
            </Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona un empleado" />
              </SelectTrigger>
              <SelectContent>
                {employeeList.length === 0 ? (
                  <SelectItem value="loading" disabled>
                    Cargando empleados...
                  </SelectItem>
                ) : (
                  employeeList.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date" className="text-sm font-medium">
              Fecha *
            </Label>
            <Input
              id="date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-time" className="text-sm font-medium">
                Hora de Inicio
              </Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="end-time" className="text-sm font-medium">
                Hora de Fin
              </Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear Evento"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
