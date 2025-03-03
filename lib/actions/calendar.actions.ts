"use server";

import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { getCurrentUser } from "./user.actions";
import moment from "moment";

export const listEvents = async () => {
  try {
    const client = await createAdminClient();
    const databases = client.databases;

    const user = await getCurrentUser();
    if (!user) {
      throw new Error("No authenticated user found.");
    }

    const userId = user.accountId;

    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId
    );

    // Solo devuelve datos simples
    return result.documents
      .filter((doc) => doc.users?.accountId === userId)
      .map((doc) => ({
        id: doc.$id,
        title: doc.title,
        start: moment(doc.start).format("YYYY-MM-DD"), // Formato simple
        end: moment(doc.end).format("YYYY-MM-DD"), // Formato simple
      }));
  } catch (error) {
    console.error("Failed to list calendar events:", error);
    return [];
  }
};
