// app/api/test-relation/route.ts

import { Client, Databases, ID } from "node-appwrite";
import { NextResponse } from "next/server";

// --- TUS IDs ---
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const TASKS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TASK_COLLECTION!;
const SUBMISSIONS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_TASK_SUBMISSIONS_COLLECTION!;

// --- TUS NOMBRES DE ATRIBUTOS ---
const M_TO_1_FIELD = "task"; // O 'taskid'
const O_TO_M_FIELD = "tasksubmision"; // El que se creó en 'tasks'

// Esta función maneja peticiones GET
export async function GET() {
  // --- 1. Configuración (Server-side) ---
  // Se ejecuta solo en el servidor, necesita API Key
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!); // ¡API Key secreta!

  const databases = new Databases(client);

  let newTaskId = "";
  let newSubmissionId = "";

  try {
    console.log("Paso 1: Creando Tarea...");
    const newTask = await databases.createDocument(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      ID.unique(),
      {
        title: "Tarea de Prueba (Test App Router)",
        deadline: new Date().toISOString(),
        // ...otros campos requeridos...
      }
    );
    newTaskId = newTask.$id;

    console.log("Paso 2: Creando Entrega y vinculándola...");
    const newSubmission = await databases.createDocument(
      DATABASE_ID,
      SUBMISSIONS_COLLECTION_ID,
      ID.unique(),
      {
        [M_TO_1_FIELD]: newTaskId,
        type: "file",
        // ...otros campos...
      }
    );
    newSubmissionId = newSubmission.$id;

    console.log("Paso 3: Leyendo la Tarea para verificar...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedTask = await databases.getDocument(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      newTaskId
    );

    // --- 5. La Verificación Final ---
    // Asumimos que el campo 1:M es un array de documentos
    const submissionsArray = updatedTask[O_TO_M_FIELD] as { $id: string }[];

    if (submissionsArray && submissionsArray.length > 0) {
      const found = submissionsArray.find((sub) => sub.$id === newSubmissionId);

      if (found) {
        const successMsg = `✅ ¡ÉXITO! La Tarea ${newTaskId} ahora contiene la Entrega ${newSubmissionId}.`;
        console.log(successMsg);
        // Devolver éxito como JSON
        return NextResponse.json({
          status: "Éxito",
          message: successMsg,
          data: updatedTask,
        });
      } else {
        throw new Error(
          `El campo '${O_TO_M_FIELD}' existe, pero no contiene el ID de la entrega.`
        );
      }
    } else {
      throw new Error(`El campo '${O_TO_M_FIELD}' está vacío o no existe.`);
    }
  } catch (error: any) {
    console.error("Error durante la prueba:", error.message || error);
    // Devolver error como JSON
    return NextResponse.json(
      { status: "Error", message: error.message },
      { status: 500 }
    );
  }
}
