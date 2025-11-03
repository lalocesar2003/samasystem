// lib/actions/task.actions.ts
"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";

// ==================== Tipos ====================

type TaskStatus = "pending" | "completed" | "cancelled";

export interface Task extends Models.Document {
  title: string;
  description?: string;
  status: TaskStatus;
  deadline?: string;
  accountId: string;
  createdBy?: string;
  assignee?: string;
  metadatos?: Record<string, unknown>;
  taskSubmissions?: string[]; // relación two-way
}

export interface TaskSubmission extends Models.Document {
  taskid: string; // rel -> tasks
  type: "file"; // por ahora solo archivo
  file: string; // rel -> files
  submittedBy: string; // rel -> users
  accountId: string;
  submittedAt?: string;
}

// ==================== Helper errores / acceso ====================

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

const assertTaskAccess = (task: Task | null, user: any) => {
  if (!task) throw new Error("TASK_NOT_FOUND");
  if (task.accountId !== user.accountId) throw new Error("FORBIDDEN");
};

// ==================== READ: tareas pendientes para el panel ====================

export const getPendingTasksForCurrentUser = async ({
  limit = 20,
  sort = "deadline-asc",
}: {
  limit?: number;
  sort?: `${string}-${"asc" | "desc"}`;
}) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const queries: string[] = [
      Query.equal("accountId", [currentUser.accountId]),
      Query.equal("status", ["pending"]),
      Query.limit(limit),
    ];

    if (sort) {
      const [by, order] = sort.split("-");
      queries.push(order === "asc" ? Query.orderAsc(by) : Query.orderDesc(by));
    }

    const tasks = await databases.listDocuments<Task>(
      appwriteConfig.databaseId,
      appwriteConfig.taskCollectionId,
      queries
    );

    return parseStringify(tasks);
  } catch (error) {
    handleError(error, "Failed to get pending tasks");
  }
};

// ==================== WRITE: submit de la tarea (modal) ====================
// Flujo esperado del front:
// 1) Usas tu action `uploadFile` -> te devuelve fileId (documento en 'files')
// 2) Llamas a `submitTask({ taskId, fileId, path: "/dashboard" })` desde el modal
// 3) El modal se cierra y recargas la UI con las tareas actualizadas

export const submitTask = async ({
  taskId,
  fileId,
  path = "/dashboard",
}: {
  taskId: string;
  fileId: string;
  path?: string; // ruta a revalidar (ej: "/dashboard")
}) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    // 1) Obtener la tarea y validar acceso
    const task = await databases.getDocument<Task>(
      appwriteConfig.databaseId,
      appwriteConfig.taskCollectionId,
      taskId
    );

    assertTaskAccess(task, currentUser);

    if (task.status === "cancelled") {
      throw new Error("TASK_CANCELLED");
    }

    // Si ya está completada, simplemente devolvemos
    if (task.status === "completed") {
      revalidatePath(path);
      return parseStringify({ ok: true, task, alreadyCompleted: true });
    }

    // 2) Evitar duplicados burdos: ¿ya envió algo este usuario para esta tarea?
    const existing = await databases.listDocuments<TaskSubmission>(
      appwriteConfig.databaseId,
      appwriteConfig.taskSubmissionsCollectionId,
      [
        Query.equal("taskid", [task.$id]),
        Query.equal("submittedBy", [currentUser.$id]),
        Query.limit(1),
      ]
    );

    let submission: TaskSubmission;

    if (existing.total > 0) {
      // Ya había un submission, lo reutilizamos
      submission = existing.documents[0];
    } else {
      // 3) Crear el registro en task_submissions
      submission = await databases.createDocument<TaskSubmission>(
        appwriteConfig.databaseId,
        appwriteConfig.taskSubmissionsCollectionId,
        ID.unique(),
        {
          taskid: task.$id,
          type: "file",
          file: fileId,
          submittedBy: currentUser.$id,
          accountId: currentUser.accountId,
        }
      );
    }

    // 4) Marcar la tarea como completada
    const updatedTask = await databases.updateDocument<Task>(
      appwriteConfig.databaseId,
      appwriteConfig.taskCollectionId,
      task.$id,
      { status: "completed" as TaskStatus }
    );

    // revalidar la ruta donde dibujas las cards
    revalidatePath(path);

    // ⚠️ OJO: aquí NO devolvemos URL ni nada del archivo,
    // la card solo necesita saber que la tarea quedó "completed".
    return parseStringify({
      ok: true,
      task: updatedTask,
      submission,
    });
  } catch (error) {
    handleError(error, "Failed to submit task");
  }
};

// ==================== Extras opcionales para el dashboard ====================

// Contadores rápidos para mostrar en el panel (pendientes / completadas)
export const getTaskCounters = async () => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const base = [Query.equal("accountId", [currentUser.accountId])];

    const [pending, completed] = await Promise.all([
      databases.listDocuments<Task>(
        appwriteConfig.databaseId,
        appwriteConfig.taskCollectionId,
        [...base, Query.equal("status", ["pending"]), Query.limit(1)]
      ),
      databases.listDocuments<Task>(
        appwriteConfig.databaseId,
        appwriteConfig.taskCollectionId,
        [...base, Query.equal("status", ["completed"]), Query.limit(1)]
      ),
    ]);

    return parseStringify({
      pending: pending.total,
      completed: completed.total,
    });
  } catch (error) {
    handleError(error, "Failed to get task counters");
  }
};

// Para una vista solo de admin (no en la card del usuario):
export const listSubmissionsByTask = async (taskId: string, limit = 20) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const submissions = await databases.listDocuments<TaskSubmission>(
      appwriteConfig.databaseId,
      appwriteConfig.taskSubmissionsCollectionId,
      [
        Query.equal("taskid", [taskId]),
        Query.limit(limit),
        Query.orderDesc("$createdAt"),
      ]
    );

    return parseStringify(submissions);
  } catch (error) {
    handleError(error, "Failed to list submissions by task");
  }
};
