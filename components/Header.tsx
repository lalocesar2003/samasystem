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
    <header className="header">
      <Search />
      <div className="flex flex-col gap-4 p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-lg font-semibold">Descargas</h2>

        {/* Link para descargar el PDF */}
        <Link
          href="https://drive.google.com/file/d/1OJKlOc9PxgLgs0AAJAMI6VdL0elAzl-9/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          <FileText className="w-5 h-5" />
          ATS ESTACIÓN DE SERVICIOS RETA 2025
        </Link>

        {/* Link para abrir el Excel en Google Sheets */}
        <Link
          href="https://docs.google.com/spreadsheets/d/1hxeNzmJQWWi8FUAScYUgf6HQNuyAc3sD/edit?usp=sharing&ouid=109827516993898706253&rtpof=true&sd=true"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-green-600 hover:text-green-800 transition"
        >
          <FileSpreadsheet className="w-5 h-5" />
          REGISTRO DE ESTADÍSTICAS SST
        </Link>
      </div>
      <div className="header-wrapper flex items-center gap-4">
        {/* Calendario - enlace interno */}
        <Link href="/calendar">
          {/* Ícono de calendario */}
          <Calendar className="w-6 h-6 cursor-pointer" />
        </Link>

        {/* Suscripción - enlace externo */}
        <Link
          href="https://www.mercadopago.com.pe/subscriptions/checkout?preapproval_plan_id=2c9380848dc7c710018dedeaf67e1d46"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* Ícono de tarjeta de crédito */}
          <CreditCard className="w-6 h-6 cursor-pointer" />
        </Link>

        {/* Subir archivo */}
        <FileUploader ownerId={userId} accountId={accountId} />

        {/* Cerrar sesión */}
        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
          <Button type="submit" className="sign-out-button">
            <LogOut className="w-6 h-6" />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
