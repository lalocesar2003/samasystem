"use client";

import { useState } from "react"; // Importar useState
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
// Importamos los componentes de AlertDialog
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar, Clock, User, Tag, Edit2, Trash2 } from "lucide-react";
import type { Event } from "@/types/event";

interface EventDetailsModalProps {
  event: Event;
  onClose: () => void;
  isAdmin?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  Inspección: { bg: "bg-green-100", text: "text-green-800" },
  Auditoría: { bg: "bg-amber-100", text: "text-amber-800" },
  Capacitación: { bg: "bg-blue-100", text: "text-blue-800" },
};

export function EventDetailsModal({
  event,
  onClose,
  isAdmin = false,
  onEdit,
  onDelete,
}: EventDetailsModalProps) {
  const colors = categoryColors[event.category] || categoryColors["Inspección"];
  // Estado para controlar el diálogo de confirmación de borrado
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleDeleteClick = () => {
    // En lugar de llamar a 'confirm'
    // if (confirm("¿Estás seguro de que deseas eliminar este evento?")) { ... }

    // Mostramos nuestro modal de alerta
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.(event.id);
    setShowDeleteAlert(false); // Oculta la alerta
    onClose(); // Cierra el modal de detalles
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* ... (Contenido del modal - sin cambios) ... */}
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Categoría
                </p>
                <div
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}
                >
                  {event.category}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Asignado a
                </p>
                <p className="mt-1">{event.userName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Fecha
                </p>
                <p className="mt-1">
                  {event.start.toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Horario
                </p>
                <p className="mt-1">
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
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    onEdit?.(event);
                    onClose();
                  }}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteClick} // <- Usamos el nuevo handler
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </Button>
              </>
            )}
            <Button onClick={onClose}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Alerta para Confirmar Borrado */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el evento:
              <br />
              <strong className="font-medium text-foreground">
                {event.title}
              </strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, eliminar evento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
