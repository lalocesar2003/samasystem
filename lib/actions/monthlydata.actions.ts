"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { getCurrentUser } from "./user.actions";

/**
 * Helper para manejar errores y mantener consistencia con tu user.actions.ts
 */
const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

/**
 * 1. Listar todos los registros de MonthlyData
 */
export const listMonthlyData = async () => {
  try {
    const { databases } = await createSessionClient();

    // Obtener el usuario autenticado
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("No authenticated user found.");
    }

    const userId = user.accountId; // ID del usuario autenticado

    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.monthlyDataCollectionId
    );

    // Filtrar datos para mostrar solo los del usuario autenticado
    const monthlyData = result.documents
      .filter((doc) => doc.users?.accountId === userId) // Filtrar por accountId
      .map((doc) => ({
        id: doc.$id,
        month: doc.month,
        inspectionsProgrammed: doc.inspectionsProgrammed,
        inspectionsCompleted: doc.inspectionsCompleted,
        trainingProgrammed: doc.trainingProgrammed,
        trainingCompleted: doc.trainingCompleted,
        users: doc.users,
      }));

    return parseStringify(monthlyData);
  } catch (error) {
    handleError(error, "Failed to list monthly data");
    return [];
  }
};

/**
 * 2. Crear un nuevo registro de MonthlyData
 */
export const createMonthlyData = async ({
  month,
  inspectionsProgrammed,
  inspectionsCompleted,
  trainingProgrammed,
  trainingCompleted,
}: {
  month: string;
  inspectionsProgrammed: number;
  inspectionsCompleted: number;
  trainingProgrammed: number;
  trainingCompleted: number;
}) => {
  try {
    const { databases } = await createSessionClient();

    const newDoc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.monthlyDataCollectionId,
      ID.unique(), // Dejas que Appwrite genere el ID o puedes pasarle uno
      {
        month,
        inspectionsProgrammed,
        inspectionsCompleted,
        trainingProgrammed,
        trainingCompleted,
      }
    );

    return parseStringify(newDoc);
  } catch (error) {
    handleError(error, "Failed to create monthly data");
  }
};

/**
 * 3. Actualizar un registro de MonthlyData existente
 */
export const updateMonthlyData = async ({
  id,
  month,
  inspectionsProgrammed,
  inspectionsCompleted,
  trainingProgrammed,
  trainingCompleted,
}: {
  id: string;
  month: string;
  inspectionsProgrammed: number;
  inspectionsCompleted: number;
  trainingProgrammed: number;
  trainingCompleted: number;
}) => {
  try {
    const { databases } = await createSessionClient();

    const updatedDoc = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.monthlyDataCollectionId,
      id,
      {
        month,
        inspectionsProgrammed,
        inspectionsCompleted,
        trainingProgrammed,
        trainingCompleted,
      }
    );

    return parseStringify(updatedDoc);
  } catch (error) {
    handleError(error, "Failed to update monthly data");
  }
};

/**
 * 4. Obtener un registro de MonthlyData por ID
 */
export const getMonthlyDataById = async (id: string) => {
  try {
    const { databases } = await createSessionClient();
    const doc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.monthlyDataCollectionId,
      id
    );

    return parseStringify(doc);
  } catch (error) {
    handleError(error, "Failed to get monthly data by ID");
  }
};

/**
 * 5. Eliminar un registro de MonthlyData
 */
export const deleteMonthlyData = async (id: string) => {
  try {
    const { databases } = await createSessionClient();
    const deleted = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.monthlyDataCollectionId,
      id
    );

    return parseStringify(deleted);
  } catch (error) {
    handleError(error, "Failed to delete monthly data");
  }
};
