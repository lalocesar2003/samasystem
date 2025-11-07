"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

interface TaskCardProps {
  task: {
    $id: string;
    title: string;
    description: string;
    status: "pendiente" | "completada";
    deadline: string;
    createdBy: { name: string };
    assignee: { name: string };
  };
  onClick: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const statusColors = {
    // ✅
    pendiente:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    // ✅
    completada:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    // Puedes dejar "cancelled" si tienes datos antiguos, pero ya no se usará
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
          <Badge className={statusColors[task.status]}>{task.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-2">
          {task.description}
        </CardDescription>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(task.deadline)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{task.assignee?.name || "Unassigned"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
