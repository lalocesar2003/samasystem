"use client";

import { Monthlydata } from "@/lib/types";
import { MonthlyDataParent } from "@/components/monthly-data-parent";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type DashboardTabsProps = {
  initialData: Monthlydata[];
};

export function DashboardTabs({ initialData }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="charts" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="charts">Gráficos</TabsTrigger>
        <TabsTrigger value="tasks">Tareas</TabsTrigger>
      </TabsList>

      <TabsContent value="charts" className="space-y-4">
        {/* Aquí va todo tu dashboard actual de gráficos */}
        <MonthlyDataParent initialData={initialData} />
      </TabsContent>

      <TabsContent value="tasks">
        {/* Aquí luego metes tus cards de tareas */}
        <Card>
          <CardHeader>
            <CardTitle>Tareas pendientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Aquí irán las cards de tareas (incompletas / completadas).
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
