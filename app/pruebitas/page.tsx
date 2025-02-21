import MyCalendar from "@/components/Calendar";

export default function Home() {
  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-2xl font-bold mb-4">Calendario de Eventos</h1>
      <MyCalendar />
    </div>
  );
}
