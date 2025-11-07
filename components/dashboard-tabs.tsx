"use client";

import { Monthlydata } from "@/lib/types";
import { MonthlyDataParent } from "@/components/monthly-data-parent";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TasksSection } from "./tasks-section";

type DashboardTabsProps = {
  initialData: Monthlydata[];
  ownerId: string;
  accountId: string;
};

export function DashboardTabs({
  initialData,
  ownerId,
  accountId,
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="charts" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="charts">Gráficos</TabsTrigger>
        <TabsTrigger value="tasks">Tareas</TabsTrigger>
      </TabsList>

      <TabsContent value="charts" className="space-y-4">
        <MonthlyDataParent initialData={initialData} />
      </TabsContent>

      <TabsContent value="tasks">
        <Card>
          <CardHeader>
            <CardTitle>Tareas pendientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <h1 className="text-3xl font-bold mb-8">My Tasks</h1>
            {/* 🔹 Aquí ya pasas el usuario real */}
            <TasksSection ownerId={ownerId} accountId={accountId} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
