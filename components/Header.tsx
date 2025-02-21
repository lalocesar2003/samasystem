import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

// Importamos los íconos de lucide-react
import { Calendar, CreditCard, LogOut } from "lucide-react";

interface HeaderProps {
  userId: string;
  accountId: string;
}

const Header = ({ userId, accountId }: HeaderProps) => {
  return (
    <header className="header">
      <Search />
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
