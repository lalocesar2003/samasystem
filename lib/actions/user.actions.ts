"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

// export const sendEmailOTP = async ({ email }: { email: string }) => {
//   const { account } = await createAdminClient();

//   try {
//     const session = await account.createEmailToken(ID.unique(), email);

//     return session.userId;
//   } catch (error) {
//     handleError(error, "Failed to send email OTP");
//   }
// };

export const createAccount = async ({
  fullName,
  email,
  password, // nuevo
}: {
  fullName: string;
  email: string;
  password: string;
}) => {
  try {
    const { account, databases } = await createAdminClient();

    // 1) Crear el usuario en Appwrite usando email y password
    const createdUser = await account.create(
      ID.unique(),
      email,
      password,
      fullName
    );

    // 2) Guardar en tu colección "users" cualquier info extra
    //    (mismo flow que antes, pero sin OTP)
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlaceholderUrl,
        accountId: createdUser.$id, // donde guardas la referencia al usuario en Appwrite
      }
    );

    const session = await account.createEmailPasswordSession(email, password);
    /* 4. guardar cookie para SSR / API routes */
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to create user with email/password");
  }
};
// export const createAccount = async ({
//   fullName,
//   email,
// }: {
//   fullName: string;
//   email: string;
// }) => {
//   const existingUser = await getUserByEmail(email);

//   const accountId = await sendEmailOTP({ email });
//   console.log("Account ID:", accountId);

//   if (!accountId) throw new Error("Failed to send an OTP");

//   if (!existingUser) {
//     const { databases } = await createAdminClient();

//     await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.usersCollectionId,
//       ID.unique(),
//       {
//         fullName,
//         email,
//         avatar: avatarPlaceholderUrl,
//         accountId,
//       }
//     );
//   }

//   return parseStringify({ accountId });
// };

// export const verifySecret = async ({
//   accountId,
//   password,
// }: {
//   accountId: string;
//   password: string;
// }) => {
//   try {
//     const { account } = await createAdminClient();

//     const session = await account.createSession(accountId, password);

//     (await cookies()).set("appwrite-session", session.secret, {
//       path: "/",
//       httpOnly: true,
//       sameSite: "strict",
//       secure: true,
//     });

//     return parseStringify({ sessionId: session.$id });
//   } catch (error) {
//     handleError(error, "Failed to verify OTP");
//   }
// };

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)]
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/sign-in");
  }
};

// export const signInUser = async ({ email }: { email: string }) => {
//   try {
//     const existingUser = await getUserByEmail(email);

//     // User exists, send OTP
//     if (existingUser) {
//       await sendEmailOTP({ email });
//       return parseStringify({ accountId: existingUser.accountId });
//     }

//     return parseStringify({ accountId: null, error: "User not found" });
//   } catch (error) {
//     handleError(error, "Failed to sign in user");
//   }
// };

export const signInWithEmail = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    // 1) Iniciar sesión con email + password
    const session = await account.createEmailPasswordSession(email, password);

    // 2) Guardar la cookie, como hacías antes
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to sign in with email/password");
  }
};
export const sendResetEmail = async (email: string) => {
  try {
    const { account } = await createAdminClient();

    // URL donde aterrizará el enlace (debe existir en tu app)
    const redirectUrl = `${appwriteConfig.publicUrl}/reset`;

    // Envía el correo de recuperación
    await account.createRecovery(email, redirectUrl);
    return { ok: true };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to send recovery e‑mail");
  }
};
export const resetPassword = async ({
  userId,
  secret,
  newPassword,
}: {
  userId: string;
  secret: string;
  newPassword: string;
}) => {
  const { account } = await createAdminClient();

  // 1 · actualiza la contraseña
  await account.updateRecovery(userId, secret, newPassword);
  return { ok: true };
};
