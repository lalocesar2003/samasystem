import Link from "next/link";
import { ReactNode } from "react";
// Importa íconos si quieres (ej: de lucide-react)
import { Home, Users, CalendarPlus } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 1. Sidebar (Navegación) */}
      <nav className="w-64 flex-shrink-0 bg-white border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-xl font-bold">Panel Admin</h2>
        </div>
        <ul className="p-4 space-y-2">
          <li>
            <Link
              href="/juan"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100"
            >
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/juan/usuarios"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100"
            >
              <Users className="w-5 h-5 mr-3" />
              Usuarios
            </Link>
          </li>
          <li>
            <Link
              href="/juan/programacion"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100"
            >
              <CalendarPlus className="w-5 h-5 mr-3" />
              Programar Eventos
            </Link>
          </li>
          <li>
            <Link
              href="/juan/tareas"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100"
            >
              <CalendarPlus className="w-5 h-5 mr-3" />
              Programar Tareas
            </Link>
          </li>
        </ul>
      </nav>

      {/* 2. Área de Contenido Principal */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {/* Aquí se renderizarán tus páginas (page.tsx) */}
        {children}
      </main>
    </div>
  );
}
