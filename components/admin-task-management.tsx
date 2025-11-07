"use client";

import { useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { Trash2, Plus, Calendar, User } from "lucide-react";
import {
  createTask as createTaskAction,
  deleteTask as deleteTaskAction,
} from "@/lib/actions/task.actions";

// Mock data - replace with real data from your backend
const initialTasks = [
  {
    $id: "1",
    title: "Diseñar interfaz de usuario",
    description: "Crear mockups para la nueva plataforma",
    status: "pendiente" as const,
    deadline: "2025-01-15",
    createdBy: { name: "Admin" },
    assignee: { name: "Juan García" },
  },
];

interface Task {
  $id: string;
  title: string;
  description: string;
  status: "pendiente" | "completada";
  deadline: string;
  createdBy: { name: string };
  assignee: { name: string; id?: string }; // 🔹 opcional id
}

export function AdminTaskManagement() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteTask = (taskId: string) => {
    startTransition(async () => {
      await deleteTaskAction({ taskId, path: "/juan" }); // ajusta path
      setTasks((prev) => prev.filter((task) => task.$id !== taskId));
      setTaskToDelete(null);
    });
  };
  const handleCreateTask = (
    newTask: Omit<Task, "$id"> & { assigneeId: string }
  ) => {
    startTransition(async () => {
      const created: any = await createTaskAction({
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        deadline: newTask.deadline,
        assigneeUserId: newTask.assigneeId, // 🔹 usamos el ID real
        path: "/dashboard",
      });

      if (!created) return;

      const task: Task = {
        $id: created.$id,
        title: created.title,
        description: created.description,
        status: created.status,
        deadline: created.deadline ?? newTask.deadline,
        createdBy: { name: "Admin" }, // o usa createdBy.fullName después
        assignee: {
          id: created.assignee,
          name: created.metadatos?.assigneeName ?? newTask.assignee.name,
        },
      };

      setTasks((prev) => [...prev, task]);
      setIsCreateDialogOpen(false);
    });
  };

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
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header con botón de crear */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-1">
            Tareas ({tasks.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Visualiza y gestiona todas las tareas del sistema
          </p>
        </div>
        <CreateTaskDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateTask={handleCreateTask}
        >
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva Tarea
          </Button>
        </CreateTaskDialog>
      </div>

      {/* Tabla de tareas */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Título</TableHead>
              <TableHead className="font-semibold">Descripción</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Deadline
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Asignado a
                </div>
              </TableHead>
              <TableHead className="font-semibold w-12">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay tareas. Crea una nueva para empezar.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.$id} className="hover:bg-muted/50">
                  <TableCell className="font-medium max-w-xs truncate">
                    {task.title}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {task.description}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[task.status]}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(task.deadline)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {task.assignee?.name || "Sin asignar"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTaskToDelete(task.$id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog
        open={!!taskToDelete}
        onOpenChange={(open) => !open && setTaskToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Tarea</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se
              puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => taskToDelete && handleDeleteTask(taskToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
