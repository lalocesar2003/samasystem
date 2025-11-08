"use server";

import { Query, ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { parseStringify } from "@/lib/utils";
import { getCurrentUser } from "./user.actions"; // Asumimos que está en el mismo directorio
import { revalidatePath } from "next/cache";

// Definimos los tipos para los parámetros de las funciones
// Esto es lo que envían tus formularios (CreateEventModal, EditEventModal)
export interface CreateEventParams {
  title: string;
  category: string;
  userId: string; // ID del empleado asignado
  userName: string; // Nombre del empleado asignado
  start: Date;
  end: Date;
}

export interface UpdateEventParams extends CreateEventParams {
  eventId: string; // $id del documento del evento
}

// Pequeña función de manejo de errores (similar a la tuya)
const handleError = (error: unknown, message: string) => {
  console.error(error, message);
  throw new Error(message);
};

// --- ACCIONES CRUD ---

/**
 * 1. CREAR un nuevo evento
 * Usado por: AdminCalendar -> CreateEventModal
 */
export const createEvent = async (params: CreateEventParams) => {
  const { title, category, userId, userName, start, end } = params;

  try {
    const { databases } = await createAdminClient();

    // Obtenemos el usuario (admin) que está creando el evento
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Usuario no autenticado");

    const newEvent = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId,
      ID.unique(),
      {
        title,
        category,
        // Convertimos las fechas a string ISO 8601 para guardarlas en Appwrite
        start: start.toISOString(),
        end: end.toISOString(),
        userId, // El ID del empleado asignado
        userName, // El nombre del empleado asignado
        accountId: currentUser.accountId, // El ID de la cuenta del admin/creador
      }
    );

    // Revalidamos la ruta del calendario para que se actualice la UI
    revalidatePath("/calendar"); // Ajusta esta ruta si es diferente

    return parseStringify(newEvent);
  } catch (error) {
    handleError(error, "Error al crear el evento");
  }
};

/**
 * 2. ACTUALIZAR un evento existente
 * Usado por: AdminCalendar -> EditEventModal
 */
export const updateEvent = async (params: UpdateEventParams) => {
  const { eventId, title, category, userId, userName, start, end } = params;

  try {
    const { databases } = await createAdminClient();

    const updatedEvent = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId,
      eventId,
      {
        title,
        category,
        start: start.toISOString(),
        end: end.toISOString(),
        userId,
        userName,
      }
    );

    revalidatePath("/calendar");

    return parseStringify(updatedEvent);
  } catch (error) {
    handleError(error, "Error al actualizar el evento");
  }
};

/**
 * 3. ELIMINAR un evento
 * Usado por: AdminCalendar -> EventDetailsModal
 */
export const deleteEvent = async (eventId: string) => {
  try {
    const { databases } = await createAdminClient();

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId,
      eventId
    );

    revalidatePath("/calendar");

    return { message: "Evento eliminado" };
  } catch (error) {
    handleError(error, "Error al eliminar el evento");
  }
};

// --- ACCIONES DE LECTURA (GET) ---

/**
 * 4. OBTENER todos los eventos para un mes específico (Vista de Admin)
 * Usado por: AdminCalendar
 */
export const getEventsByMonth = async (year: number, month: number) => {
  // 'month' en JS es 0-indexado (Ene=0, Dic=11)
  try {
    const { databases } = await createAdminClient();

    // Calcula el primer y último día del mes en formato ISO
    const firstDayOfMonth = new Date(year, month, 1).toISOString();
    const lastDayOfMonth = new Date(
      year,
      month + 1,
      0,
      23,
      59,
      59
    ).toISOString();

    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId,
      [
        Query.between("start", firstDayOfMonth, lastDayOfMonth),
        Query.orderAsc("start"),
        Query.limit(100), // Siempre es buena idea limitar
      ]
    );

    // Importante: parseStringify convierte todo a JSON.
    // El componente cliente deberá hacer `new Date(event.start)`
    return parseStringify(result.documents);
  } catch (error) {
    handleError(error, "Error al obtener los eventos del mes");
  }
};

/**
 * 5. OBTENER los eventos del usuario actual para un mes específico (Vista de Empleado)
 * Usado por: EmployeeCalendar
 */
export const getCurrentUserEventsByMonth = async (
  year: number,
  month: number
) => {
  try {
    // Usamos createSessionClient para seguridad a nivel de usuario
    const { databases } = await createSessionClient();
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("Usuario no autenticado");

    const firstDayOfMonth = new Date(year, month, 1).toISOString();
    const lastDayOfMonth = new Date(
      year,
      month + 1,
      0,
      23,
      59,
      59
    ).toISOString();

    // Buscamos eventos donde el 'userId' (campo del evento) coincida
    // con el '$id' del documento del usuario (de la colección 'users')
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId,
      [
        Query.equal("userId", currentUser.$id),
        Query.between("start", firstDayOfMonth, lastDayOfMonth),
        Query.orderAsc("start"),
        Query.limit(100),
      ]
    );

    return parseStringify(result.documents);
  } catch (error) {
    handleError(error, "Error al obtener los eventos del usuario");
  }
};

/**
 * 6. OBTENER lista de empleados (para los <Select> en los modales)
 * Usado por: CreateEventModal y EditEventModal
 */
export const getEmployeeList = async () => {
  try {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId, // Usamos tu colección de usuarios
      [
        Query.orderAsc("fullName"),
        Query.limit(100),
        // Aquí podrías agregar un Query.equal("role", "employee") si tienes ese campo
      ]
    );

    // Mapeamos solo los datos que el modal necesita
    const employees = result.documents.map((user) => ({
      id: user.$id, // El ID del documento de usuario
      name: user.fullName,
    }));

    return parseStringify(employees);
  } catch (error) {
    handleError(error, "Error al obtener la lista de empleados");
  }
};
