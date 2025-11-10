// ¡Importante! Esto le dice a Next.js que es un componente interactivo.
"use client";

import { useState } from "react";
import MonthlyDataManager from "@/components/MonthlyDataManager"; // Tu editor
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // O usa un <li> simple
import UserRecordsManager from "@/components/UserRecordsManager";

// Tipado para los usuarios (ajusta según tu tipo 'user')
type User = {
  $id: string;
  fullName: string;
  email: string;
  // ...otros campos si los tienes
};

export function UserClientPage({ users }: { users: User[] }) {
  // 1. Estado para guardar el ID del usuario seleccionado
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* COLUMNA IZQUIERDA: Lista de Usuarios */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {users.map((user) => (
              <Button
                key={user.$id}
                variant={selectedUserId === user.$id ? "secondary" : "ghost"} // Resalta el activo
                className="w-full justify-start h-auto text-left"
                onClick={() => setSelectedUserId(user.$id)}
              >
                <div>
                  <div className="font-semibold">{user.fullName}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                  <div className="text-xs text-gray-400">{user.$id}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* COLUMNA DERECHA: Editor de Registros */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Editor de Registros</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 2. Lógica de visualización */}
            {selectedUserId ? (
              // 3. Si hay un usuario, muestra el editor PARA ESE USUARIO
              // ¡IMPORTANTE! Tu componente MonthlyDataManager debe
              // aceptar 'userId' y cargar los datos de ese usuario.
              <UserRecordsManager userId={selectedUserId} />
            ) : (
              // Si no hay usuario, muestra un mensaje
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">
                  Selecciona un usuario de la lista para editar sus registros.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
