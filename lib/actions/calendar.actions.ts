import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
export const listEvents = async () => {
  try {
    const client = await createAdminClient();
    const result = await client.databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId
    );

    return JSON.parse(
      JSON.stringify(
        result.documents.map((event: any) => ({
          id: event.$id,
          title: event.title,
          start: event.start,
          end: event.end,
        }))
      )
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return []; // 🔹 Devolver siempre un array
  }
};
