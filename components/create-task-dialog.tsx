"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listAllUsers } from "@/lib/actions/monthlydata.actions";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: any) => void;
  children: ReactNode;
}

interface FormData {
  title: string;
  description: string;
  status: "pendiente" | "completada";
  deadline: string;
  assignee: string;
}
interface UserOption {
  $id: string;
  fullName: string;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onCreateTask,
  children,
}: CreateTaskDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    status: "pendiente",
    deadline: "",
    assignee: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const result = await listAllUsers();
        // Nos quedamos solo con lo que necesitamos
        const mapped = (result ?? []).map((u: any) => ({
          $id: u.$id,
          fullName: u.fullName,
        }));
        setUsers(mapped);
      } catch (err) {
        console.error("Error loading users", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.title.trim()) newErrors.title = "El título es requerido";
    if (!formData.description.trim())
      newErrors.description = "La descripción es requerida";
    if (!formData.deadline) newErrors.deadline = "La fecha es requerida";
    if (!formData.assignee.trim())
      newErrors.assignee = "Debes asignar la tarea a alguien";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const selectedUser = users.find((u) => u.$id === formData.assignee);
    onCreateTask({
      title: formData.title,
      description: formData.description,
      status: formData.status,
      deadline: formData.deadline,
      assigneeId: formData.assignee, // 🔹 userId real
      assignee: {
        name: selectedUser?.fullName || "Sin nombre",
      },
      createdBy: { name: "Admin" }, // puedes ajustar esto luego
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      status: "pendiente",
      deadline: "",
      assignee: "",
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div onClick={() => onOpenChange(true)}>{children}</div>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nueva Tarea</DialogTitle>
          <DialogDescription>
            Completa los datos para crear una nueva tarea en el sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Ej: Diseñar landing page"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              placeholder="Describe los detalles de la tarea"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description)
                  setErrors({ ...errors, description: undefined });
              }}
              className={errors.description ? "border-destructive" : ""}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="completeda">Completada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Fecha Límite *</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => {
                setFormData({ ...formData, deadline: e.target.value });
                if (errors.deadline)
                  setErrors({ ...errors, deadline: undefined });
              }}
              className={errors.deadline ? "border-destructive" : ""}
            />
            {errors.deadline && (
              <p className="text-sm text-destructive">{errors.deadline}</p>
            )}
          </div>

          {/* Asignado a (Select con usuarios) */}
          <div className="space-y-2">
            <Label htmlFor="assignee">Asignar a *</Label>
            <Select
              value={formData.assignee}
              onValueChange={(value) => {
                setFormData({ ...formData, assignee: value });
                if (errors.assignee)
                  setErrors({ ...errors, assignee: undefined });
              }}
              disabled={loadingUsers}
            >
              <SelectTrigger id="assignee">
                <SelectValue
                  placeholder={
                    loadingUsers ? "Cargando..." : "Selecciona un usuario"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.$id} value={user.$id}>
                    {user.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assignee && (
              <p className="text-sm text-destructive">{errors.assignee}</p>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Crear Tarea</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
