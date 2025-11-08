import { AdminTaskManagement } from "@/components/admin-task-management";
import CreateMonthlyDataForm from "@/components/CreateMonthlyDataForm";
import MonthlyDataManager from "@/components/MonthlyDataManager";
import { CalendarView } from "@/components/calendar-view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LinkIcon } from "lucide-react";

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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Panel de Administración
              </h1>
              <p className="text-muted-foreground mt-1">
                Gestión completa de eventos e inspecciones
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="/">
                <LinkIcon className="w-4 h-4 mr-2" />
                Ver Calendario
              </a>
            </Button>
          </div>
          <Card className="p-6">
            <CalendarView role="admin" />
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
