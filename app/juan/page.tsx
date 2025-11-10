import { AdminTaskManagement } from "@/components/admin-task-management";
import { CalendarView } from "@/components/calendar-view";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Esta página será la URL: /admin
const AdminDashboardPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Dashboard Principal</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal: Calendario */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendario de Eventos</CardTitle>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
              <CalendarView role="admin" />
            </CardContent>
          </Card>
        </div>

        {/* Columna Lateral: Tareas */}
      </div>
    </>
  );
};

export default AdminDashboardPage;
