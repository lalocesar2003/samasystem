"use client";

import { useState, useEffect, useCallback } from "react"; // Importamos hooks
import { TaskCard } from "./task-card";
import { TaskModal } from "./task-modal";
import { getPendingTasksForCurrentUser } from "@/lib/actions/task.actions"; // Importamos la action
// Mock data - replace with real data from your database

interface Task {
  $id: string;
  title: string;
  description: string;
  status: "pendiente" | "completada";
  deadline: string;
  createdBy: { name: string };
  assignee: { name: string };
}
export function TasksSection({
  ownerId,
  accountId,
}: {
  ownerId: string;
  accountId: string;
}) {
  const [tasks, setTasks] = useState<Task[]>([]); // Estado para las tareas
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Usamos useCallback para definir la función de carga de datos
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      // Llamamos a la server action
      const result = await getPendingTasksForCurrentUser({ limit: 20 });
      if (result) {
        // ¡Importante! 'result.documents' ahora tiene el formato correcto
        setTasks(result.documents as Task[]);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setIsLoading(false);
    }
  }, []); // Sin dependencias, la función es estable

  // Usamos useEffect para llamar a fetchTasks() cuando el componente se monta
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Se ejecuta una vez

  const handleOpenModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);

    // 💡 ¡IMPORTANTE!
    // Volvemos a cargar las tareas cuando se cierra el modal.
    // Esto actualiza la lista si el usuario acaba de completar una tarea.
    fetchTasks();
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Cargando tareas...</p>
      </div>
    );
  }

  // Estado vacío
  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-card">
        <p className="text-muted-foreground">
          No tienes tareas pendientes asignadas.
        </p>
      </div>
    );
  }

  // Estado con datos
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mapeamos sobre las tareas reales del estado */}
        {tasks.map((task) => (
          <TaskCard
            key={task.$id}
            task={task}
            onClick={() => handleOpenModal(task)}
          />
        ))}
      </div>

      {isModalOpen && selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={handleCloseModal} // handleCloseModal ahora recarga los datos
          ownerId={ownerId}
          accountId={accountId}
        />
      )}
    </>
  );
}
