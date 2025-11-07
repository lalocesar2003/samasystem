"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, User, FileText } from "lucide-react";
import { submitTask } from "@/lib/actions/task.actions";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import FileUploader from "./FileUploader";

interface TaskModalProps {
  task: {
    $id: string;
    title: string;
    description: string;
    status: "pendiente" | "completada";
    deadline: string;
    createdBy: { name: string };
    assignee: { name: string };
  };
  isOpen: boolean;
  onClose: () => void;
  ownerId: string;
  accountId: string;
}

export function TaskModal({
  task,
  isOpen,
  onClose,
  ownerId,
  accountId,
}: TaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const path = usePathname();
  const { toast } = useToast();

  const statusColors = {
    // ✅
    pendiente:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    // ✅
    completada:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    // Puedes dejar "cancelled" si tienes datos antiguos, pero ya no se usará
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmitUpload = async (uploadedFile: any) => {
    if (task.status !== "pendiente") return;

    setIsSubmitting(true);
    try {
      // 1) El archivo YA ESTÁ subido. Solo obtenemos el fileId.
      const fileId = uploadedFile?.$id;
      if (!fileId) throw new Error("No fileId returned from uploader");

      // 2) Registrar entrega + marcar tarea como completed
      await submitTask({
        taskId: task.$id,
        fileId,
        path,
      });

      toast({
        description: "Tarea entregada correctamente.",
      });

      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Task submission failed:", error);
      toast({
        variant: "destructive",
        description: "No se pudo entregar la tarea. Intenta de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{task.title}</DialogTitle>
              <Badge className={statusColors[task.status]}>{task.status}</Badge>
            </div>
          </div>
        </DialogHeader>

        <DialogDescription className="text-base text-foreground">
          {task.description}
        </DialogDescription>

        <div className="grid grid-cols-2 gap-4 my-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              <span>Deadline</span>
            </div>
            <p className="font-semibold">{formatDate(task.deadline)}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <User className="w-4 h-4" />
              <span>Assigned to</span>
            </div>
            <p className="font-semibold">
              {task.assignee?.name || "Unassigned"}
            </p>
          </Card>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Upload Submission
          </h3>

          {/* Si quieres, puedes ocultar esto cuando la tarea ya está completada */}
          {task.status === "pendiente" ? (
            isSubmitting ? (
              // Muestra un loader mientras se registra la entrega (después de subir)
              <div className="flex items-center justify-center p-8">
                <p className="text-sm text-muted-foreground">
                  Registrando entrega...
                </p>
              </div>
            ) : (
              // Pasa las props correctas a TU FileUploader
              <FileUploader
                ownerId={ownerId}
                accountId={accountId}
                onUploadComplete={handleSubmitUpload}
              />
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              Esta tarea ya está completada. No puedes subir nuevos archivos.
            </p>
          )}
          {/* --- ------------------------------------ --- */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
