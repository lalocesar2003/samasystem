"use client";

import { Button } from "@/components/ui/button";
import { Users, UserCheck } from "lucide-react";

interface RoleSelectorProps {
  role: "admin" | "employee";
  onRoleChange: (role: "admin" | "employee") => void;
}

export function RoleSelector({ role, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={role === "admin" ? "default" : "outline"}
        onClick={() => onRoleChange("admin")}
        className="gap-2"
      >
        <Users className="w-4 h-4" />
        Administrador
      </Button>
      <Button
        variant={role === "employee" ? "default" : "outline"}
        onClick={() => onRoleChange("employee")}
        className="gap-2"
      >
        <UserCheck className="w-4 h-4" />
        Empleado
      </Button>
    </div>
  );
}
