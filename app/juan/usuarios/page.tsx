import { listAllUsers } from "@/lib/actions/monthlydata.actions";
import { UserClientPage } from "./UserClientPage"; // Importamos el cliente

// Esta página será la URL: /admin/usuarios
const UsuariosPage = async () => {
  // 1. Obtenemos los usuarios en el servidor
  const users = await listAllUsers();

  // 2. Pasamos los usuarios al componente cliente para la interactividad
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">
        Gestión de Usuarios y Registros
      </h1>
      <UserClientPage users={users} />
    </>
  );
};

export default UsuariosPage;
