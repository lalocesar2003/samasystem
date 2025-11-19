"use client";

import { useState, useTransition, useEffect } from "react"; // 1. Importa useEffect
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
  getPendingTasksForCurrentUser, // 2. Importa la acción para LEER
} from "@/lib/actions/task.actions";

// Interfaz para la tarea (ajusta si es necesario)
interface Task {
  $id: string;
  title: string;
  description: string;
  status: "pendiente" | "completada";
  deadline: string;
  createdBy: { name: string };
  assignee: { name: string; id?: string };
}

export function AdminTaskManagement() {
  // 3. Empieza con un array VACÍO, no con datos mock
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 4. Carga los datos REALES cuando el componente se monta
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        // Tu acción `getPendingTasksForCurrentUser` ya formatea los datos
        // y (asumo) trae las tareas del admin.
        // Si necesitas TODAS las tareas (no solo pendientes),
        // debes crear una nueva 'action' como `getAllTasksForAdmin`.
        const result = await getPendingTasksForCurrentUser({});

        if (result && result.documents) {
          setTasks(result.documents);
        }
      } catch (error) {
        console.error("Error cargando tareas:", error);
        setTasks([]); // En caso de error, muestra la tabla vacía
      }
      setIsLoading(false);
    };

    loadTasks();
  }, []); // El array vacío [] asegura que se ejecuta 1 vez al montar

  const handleDeleteTask = (taskId: string) => {
    startTransition(async () => {
      try {
        // 5. ¡CORRIGE LA RUTA DE REVALIDACIÓN!
        await deleteTaskAction({ taskId, path: "/juan/tareas" });
        setTasks((prev) => prev.filter((task) => task.$id !== taskId));
        setTaskToDelete(null);
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    });
  };

  const handleCreateTask = (
    newTask: Omit<Task, "$id"> & { assigneeId: string }
  ) => {
    startTransition(async () => {
      try {
        const created: any = await createTaskAction({
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          deadline: newTask.deadline,
          assigneeUserId: newTask.assigneeId,
          // 5. ¡CORRIGE LA RUTA DE REVALIDACIÓN!
          path: "/juan/tareas",
        });

        if (!created) return;

        // Formateamos la tarea para añadirla al estado local
        // (La revalidación la cargará en el próximo refresh de otro usuario)
        const task: Task = {
          $id: created.$id,
          title: created.title,
          description: created.description,
          status: created.status,
          deadline: created.deadline ?? newTask.deadline,
          // Tu 'action' de crear no devuelve 'createdBy' ni 'assignee' formateado,
          // así que lo simulamos para la UI local.
          createdBy: { name: "Admin" },
          assignee: {
            id: created.assignee,
            name: newTask.assignee.name, // Usamos el nombre del formulario
          },
        };

        setTasks((prev) => [...prev, task]);
        setIsCreateDialogOpen(false);
      } catch (error) {
        console.error("Error al crear:", error);
      }
    });
  };

  const statusColors = {
    pendiente:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    completada:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 6. Muestra un estado de carga mientras se traen los datos
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* ... (Header) ... */}
        <div className="border rounded-lg p-8 flex justify-center items-center h-64 bg-card">
          <p className="text-muted-foreground">Cargando tareas...</p>
        </div>
      </div>
    );
  }

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
            {/* ... (Tu TableHeader no cambia) ... */}
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
              {isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
