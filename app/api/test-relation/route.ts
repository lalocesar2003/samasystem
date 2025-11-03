// app/api/test-relation/route.ts
import { Client, Databases, ID } from "node-appwrite";
import { NextResponse } from "next/server";

// --- ENV REQUERIDOS (DB / Colecciones) ---
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const TASKS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TASK_COLLECTION!;
const SUBMISSIONS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_TASK_SUBMISSIONS_COLLECTION!;

// --- ENV OPCIONALES PARA LA PRUEBA ---
const TEST_ACCOUNT_ID = process.env.NEXT_PUBLIC_TEST_ACCOUNT_ID!; // string (OBLIGATORIO para este test)
const TEST_USER_ID = process.env.NEXT_PUBLIC_TEST_USER_ID || ""; // id en colección "users" (relación)
const TEST_FILE_DOC_ID = process.env.NEXT_PUBLIC_TEST_FILE_DOC_ID || ""; // id en colección "files" (relación)

// --- NOMBRES EXACTOS DE ATRIBUTOS ---
const M_TO_1_FIELD = "taskid"; // taskSubmissions -> tasks (many-to-one)
const O_TO_M_FIELD = "taskSubmissions"; // back-reference en tasks (array)
const SUBMITTED_AT_FIELD = "submittedat"; // requerido por tu esquema (todo minúsculas)

export async function GET() {
  try {
    if (!TEST_ACCOUNT_ID) {
      throw new Error(
        'Falta NEXT_PUBLIC_TEST_ACCOUNT_ID. "accountid" es requerido en tasks y taskSubmissions.'
      );
    }

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
      .setKey(process.env.NEXT_APPWRITE_KEY!); // API Key de servidor

    const databases = new Databases(client);

    // 1) Crear Task (mínimos: title, deadline, accountid)
    const taskPayload: Record<string, any> = {
      title: "Tarea de Prueba (App Router)",
      description: "añadir descripción",
      deadline: new Date().toISOString(),
      status: "pendiente",
      accountid: TEST_ACCOUNT_ID, // REQUERIDO en tu tasks
      ...(TEST_USER_ID ? { createdBy: TEST_USER_ID } : {}),
    };

    const newTask = await databases.createDocument(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      ID.unique(),
      taskPayload
    );
    const newTaskId = newTask.$id;

    // 2) Crear Submission y vincular al Task
    // Nota: tu enum "type" tiene default "file", no lo enviamos.
    const submissionPayload: Record<string, any> = {
      [M_TO_1_FIELD]: newTaskId, // relación hacia la tarea
      [SUBMITTED_AT_FIELD]: new Date().toISOString(), // <-- requerido por tu esquema
      accountid: TEST_ACCOUNT_ID, // REQUERIDO en tu taskSubmissions
      ...(TEST_USER_ID ? { submittedBy: TEST_USER_ID } : {}), // si tu atributo se llama submittedby, cambia la clave aquí
      ...(TEST_FILE_DOC_ID ? { file: TEST_FILE_DOC_ID } : {}),
    };

    const newSubmission = await databases.createDocument(
      DATABASE_ID,
      SUBMISSIONS_COLLECTION_ID,
      ID.unique(),
      submissionPayload
    );
    const newSubmissionId = newSubmission.$id;

    // 3) Verificar back-reference en la Task
    await new Promise((r) => setTimeout(r, 800));
    const updatedTask = await databases.getDocument(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      newTaskId
    );

    const submissionsArray = updatedTask[O_TO_M_FIELD] as
      | { $id: string }[]
      | undefined;

    if (!Array.isArray(submissionsArray) || submissionsArray.length === 0) {
      throw new Error(
        `El campo '${O_TO_M_FIELD}' está vacío o no existe (revisa que la relación sea two-way y el nombre del inverso).`
      );
    }

    const found = submissionsArray.find((s) => s.$id === newSubmissionId);
    if (!found) {
      throw new Error(
        `El campo '${O_TO_M_FIELD}' no contiene la entrega creada (${newSubmissionId}).`
      );
    }

    return NextResponse.json({
      status: "ok",
      message: `✅ ÉXITO: La tarea ${newTaskId} contiene la entrega ${newSubmissionId}.`,
      taskId: newTaskId,
      submissionId: newSubmissionId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
