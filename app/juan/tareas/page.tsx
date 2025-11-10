import { AdminTaskManagement } from "@/components/admin-task-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TaskPage = () => {
  return (
    <div className="lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Tareas</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminTaskManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskPage;
