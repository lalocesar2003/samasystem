import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

// Importamos los íconos de lucide-react
import {
  Calendar,
  CreditCard,
  FileSpreadsheet,
  FileText,
  LogOut,
} from "lucide-react";

interface HeaderProps {
  userId: string;
  accountId: string;
}

const Header = ({ userId, accountId }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md rounded-lg">
      {/* Barra de búsqueda */}
      <Search />

      {/* Contenedor de descargas */}
      <div className="flex flex-col gap-3 p-4 border rounded-lg shadow-lg bg-white w-72">
        <h2 className="text-lg font-semibold">Descargas</h2>

        {/* Link para descargar el PDF */}
        <Link
          href="https://drive.google.com/file/d/1OJKlOc9PxgLgs0AAJAMI6VdL0elAzl-9/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
        >
          <FileText className="w-5 h-5 text-gray-500" />
          <span className="truncate">ATS ESTACIÓN DE SERVICIOS RETA 2025</span>
        </Link>

        {/* Link para abrir el Excel en Google Sheets */}
        <Link
          href="https://docs.google.com/spreadsheets/d/1hxeNzmJQWWi8FUAScYUgf6HQNuyAc3sD/edit?usp=sharing&ouid=109827516993898706253&rtpof=true&sd=true"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
        >
          <FileSpreadsheet className="w-5 h-5 text-gray-500" />
          <span className="truncate">REGISTRO DE ESTADÍSTICAS SST</span>
        </Link>
      </div>

      {/* Sección de iconos y botones */}
      <div className="flex items-center gap-6">
        {/* Calendario */}
        <Link href="/calendar">
          <Calendar className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer transition" />
        </Link>

        {/* Suscripción */}
        <Link
          href="https://www.mercadopago.com.pe/subscriptions/checkout?preapproval_plan_id=2c9380848dc7c710018dedeaf67e1d46"
          target="_blank"
          rel="noopener noreferrer"
        >
          <CreditCard className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer transition" />
        </Link>

        {/* Botón de subir archivo */}
        <FileUploader ownerId={userId} accountId={accountId} />

        {/* Cerrar sesión */}
        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Salir</span>
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
