import { AdminTaskManagement } from "@/components/admin-task-management";
import CreateMonthlyDataForm from "@/components/CreateMonthlyDataForm";
import MonthlyDataManager from "@/components/MonthlyDataManager";

import { listAllUsers } from "@/lib/actions/monthlydata.actions";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";

const Dashboard = async () => {
  const users = await listAllUsers(); // Trae todos los usuarios
  // Para verificar los datos en consola

  return (
    <>
      <div>
        <h1>Lista de Usuarios</h1>
        <ul>
          {users.map(
            (user: {
              $id: Key | null | undefined;
              fullName:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined;
              email:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined;
            }) => (
              <li key={user.$id}>
                {user.fullName} - {user.email}- {user.$id}
              </li>
            )
          )}
        </ul>
      </div>

      <CreateMonthlyDataForm />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Administrar Monthly Data</h1>
        <MonthlyDataManager />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">
            Gestiona todas las tareas del sistema
          </p>
        </div>
        <AdminTaskManagement />
      </div>
    </>
  );
};

export default Dashboard;
