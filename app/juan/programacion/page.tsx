import CreateMonthlyDataForm from "@/components/CreateMonthlyDataForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Esta página será la URL: /admin/programacion
const ProgramacionPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Programar Nuevos Eventos</h1>
      <p className="text-muted-foreground mb-4">
        Añade inspecciones, capacitaciones y auditorías para el mes.
      </p>

      <Card className="max-w-4xl">
        {" "}
        {/* Opcional: limita el ancho del formulario */}
        <CardHeader>
          <CardTitle>Formulario de Carga Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Aquí va tu componente de formulario */}
          <CreateMonthlyDataForm />
        </CardContent>
      </Card>
    </>
  );
};

export default ProgramacionPage;
