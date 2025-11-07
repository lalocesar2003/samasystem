// lib/actions/task.actions.ts
"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";

// ==================== Tipos ====================

type TaskStatus = "pendiente" | "completada";

interface NestedUser {
  $id: string;
  fullName: string;
  // puedes añadir email, avatar, etc. si los necesitas
}

export interface Task extends Models.Document {
  title: string;
  description?: string;
  status: TaskStatus;
  deadline?: string;
  accountid: string; // ✅ CORREGIDO: minúsculas
  createdBy?: NestedUser | null; // Es un objeto, no un string
  assignee?: NestedUser | null; // Es un objeto, no un string
  // 'metadatos' eliminado porque no está en la DB
  taskSubmissions?: string[];
}

export interface TaskSubmission extends Models.Document {
  taskid: string;
  type: "file";
  file: string;
  submittedBy: string;
  accountid: string; // ✅ CORREGIDO: minúsculas
  submittedat: string; // ✅ CORREGIDO: añadido (basado en tu test)
}

// ==================== Helper errores / acceso ====================

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

const assertTaskAccess = (task: Task | null, user: any) => {
  if (!task) throw new Error("TASK_NOT_FOUND");
  // ✅ CORREGIDO: 'accountid' en minúsculas
  if (task.accountid !== user.accountId) throw new Error("FORBIDDEN");
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
      Query.equal("accountid", [currentUser.accountId]), // ✅
      Query.equal("status", ["pendiente"]), // ✅
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

    // --- ⬇️ NUEVA LÓGICA PARA "EXPANDIR" USUARIOS ⬇️ ---
    const formattedTasks = tasks.documents.map((task) => {
      return {
        ...task, // Mantiene $id, title, description, status, etc.

        // Transforma el objeto 'assignee' al formato que espera la Card
        assignee: {
          name: task.assignee?.fullName || "Sin asignar",
        },

        // Transforma el objeto 'createdBy'
        createdBy: {
          name: task.createdBy?.fullName || "Admin",
        },
      };
    });

    // Devolvemos la lista de tareas con los nombres ya resueltos
    return parseStringify({ ...tasks, documents: formattedTasks });

    // --- ⬆️ FIN DE LA NUEVA LÓGICA ⬆️ ---
  } catch (error) {
    handleError(error, "Failed to get pending tasks");
  }
};

// ==================== WRITE: submit de la tarea (modal) ====================

export const submitTask = async ({
  taskId,
  fileId,
  path = "/dashboard",
}: {
  taskId: string;
  fileId: string;
  path?: string;
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

    // 'assertTaskAccess' ya está corregido
    assertTaskAccess(task, currentUser);

    // ✅ CORREGIDO: Lógica simplificada
    // Si ya está completada, no hacer nada
    if (task.status === "completada") {
      revalidatePath(path);
      return parseStringify({ ok: true, task, alreadyCompleted: true });
    }
    // Si no está 'completada', debe estar 'pendiente', así que continuamos.

    // 2) Evitar duplicados (esta lógica está bien)
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
          accountid: currentUser.accountId, // ✅ CORREGIDO: minúsculas
          submittedat: new Date().toISOString(), // ✅ CORREGIDO: añadido
        }
      );
    }

    // 4) Marcar la tarea como completada
    const updatedTask = await databases.updateDocument<Task>(
      appwriteConfig.databaseId,
      appwriteConfig.taskCollectionId,
      task.$id,
      { status: "completada" as TaskStatus } // ✅ CORREGIDO: español
    );

    revalidatePath(path);

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

export const getTaskCounters = async () => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const base = [Query.equal("accountid", [currentUser.accountId])]; // ✅ CORREGIDO: minúsculas

    const [pending, completed] = await Promise.all([
      databases.listDocuments<Task>(
        appwriteConfig.databaseId,
        appwriteConfig.taskCollectionId,
        [...base, Query.equal("status", ["pendiente"]), Query.limit(1)] // ✅ CORREGIDO: español
      ),
      databases.listDocuments<Task>(
        appwriteConfig.databaseId,
        appwriteConfig.taskCollectionId,
        [...base, Query.equal("status", ["completada"]), Query.limit(1)] // ✅ CORREGIDO: español
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
    // Esta función no usa 'accountid' o 'status', por lo que estaba bien.
    // Solo validamos que el usuario pueda ver esto.
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    // Opcional: validar que el admin/usuario pertenece a la misma cuenta que la tarea
    // const task = await databases.getDocument...
    // assertTaskAccess(task, currentUser);

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

// ==================== CREAR TAREA (admin) ====================
// (Esta función ya estaba corregida)
export const createTask = async ({
  title,
  description,
  status,
  deadline,
  assigneeUserId,
  path = "/dashboard",
}: {
  title: string;
  description: string;
  status: TaskStatus;
  deadline: string;
  assigneeUserId: string;
  path?: string;
}) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const deadlineIso = deadline ? new Date(deadline).toISOString() : undefined;

    const assigneeDoc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      assigneeUserId
    );

    const payload = {
      title,
      description,
      status,
      deadline: deadlineIso,
      accountid: currentUser.accountId,
      createdBy: currentUser.$id,
      assignee: assigneeDoc.$id,
    };

    const newTask = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.taskCollectionId,
      ID.unique(),
      payload
    );

    revalidatePath(path);
    return parseStringify(newTask);
  } catch (error) {
    console.log(error, "Failed to create task");
    throw error;
  }
};

// ==================== ACTUALIZAR TAREA (admin) ====================
// ✅ NUEVA FUNCIÓN AÑADIDA
export const updateTask = async ({
  taskId,
  title,
  description,
  status,
  deadline,
  assigneeUserId,
  path = "/dashboard",
}: {
  taskId: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  deadline?: string;
  assigneeUserId?: string;
  path?: string;
}) => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    // 1. Validar acceso
    const task = await databases.getDocument<Task>(
      appwriteConfig.databaseId,
      appwriteConfig.taskCollectionId,
      taskId
    );
    assertTaskAccess(task, currentUser);

    // 2. Construir payload dinámico
    const payloadToUpdate: Record<string, any> = {};
    if (title) payloadToUpdate.title = title;
    if (description) payloadToUpdate.description = description;
    if (status) payloadToUpdate.status = status;
    if (deadline) payloadToUpdate.deadline = new Date(deadline).toISOString();
    if (assigneeUserId) payloadToUpdate.assignee = assigneeUserId;

    if (Object.keys(payloadToUpdate).length === 0) {
      return parseStringify(task); // No hay nada que actualizar
    }

    // 3. Actualizar
    const updatedTask = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.taskCollectionId,
      taskId,
      payloadToUpdate
    );

    revalidatePath(path);
    return parseStringify(updatedTask);
  } catch (error) {
    handleError(error, "Failed to update task");
  }
};

// ==================== ELIMINAR TAREA (admin) ====================

export const deleteTask = async ({
  taskId,
  path = "/dashboard",
}: {
  taskId: string;
  path?: string;
}) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    // 1. Validar acceso
    const task = await databases.getDocument<Task>(
      appwriteConfig.databaseId,
      appwriteConfig.taskCollectionId,
      taskId
    );
    // 'assertTaskAccess' ya está corregido
    assertTaskAccess(task, currentUser);

    // 2. Eliminar
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.taskCollectionId,
      taskId
    );

    revalidatePath(path);
    return parseStringify({ ok: true });
  } catch (error) {
    handleError(error, "Failed to delete task");
  }
};
