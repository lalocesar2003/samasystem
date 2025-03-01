// app/page.js
"use client";

import Link from "next/link";
import MyCalendar from "@/components/Calendar";
import { Home as HomeIcon } from "lucide-react";
import { listEvents } from "@/lib/actions/calendar.actions";

export default async function HomePage() {
  return (
    <div className="container mx-auto mt-5">
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity mb-4"
      >
        <HomeIcon className="w-6 h-6" />
        <p>Inicio</p>
      </Link>

      <h1 className="text-2xl font-bold mb-4">Calendario de Eventos</h1>
      <MyCalendar />
    </div>
  );
}
