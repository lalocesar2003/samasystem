Reforma Tambo

Una aplicación web full-stack construida con Next.js, TypeScript y Appwrite, diseñada para [AÑADE AQUÍ UNA BREVE DESCRIPCIÓN DE TU PROYECTO, EJ: "gestionar eventos y datos mensuales..."].

✨ Características

Autenticación Completa: Registro de usuarios, inicio de sesión, recuperación de contraseña.

Gestión de Datos: Interacción con múltiples colecciones de Appwrite (usuarios, archivos, eventos, etc.).

Almacenamiento de Archivos: Integración con Appwrite Buckets para la subida y gestión de archivos.

Interfaz Moderna: Estilizado con Tailwind CSS y Shadcn/ui (inferido de components.json).

Tipado Estricto: Código robusto y mantenible gracias a TypeScript.

🚀 Stack Tecnológico

Framework: Next.js (con App Router)

Backend (BaaS): Appwrite (Autenticación, Base de Datos, Storage)

Lenguaje: TypeScript

Estilos: Tailwind CSS

Componentes: Shadcn/ui

🏁 Primeros Pasos

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

Prerrequisitos

Node.js (v18 o superior)

npm, yarn o pnpm

Una cuenta de Appwrite Cloud con un proyecto configurado.

Instalación

Clona el repositorio:

git clone [https://github.com/tu-usuario/reforma-tambo.git](https://github.com/tu-usuario/reforma-tambo.git)
cd reforma-tambo

Instala las dependencias:

npm install

# o

yarn install

# o

pnpm install

Configura las variables de entorno:
Copia el archivo .env.example (si no existe, créalo) a .env.local y rellena las variables necesarias.

cp .env.example .env.local

(Ver la sección de Variables de Entorno más abajo).

Ejecuta el servidor de desarrollo:

npm run dev

Abre http://localhost:3000 en tu navegador para ver la aplicación.

🔑 Variables de Entorno

Para que el proyecto funcione, necesitas crear un archivo .env.local en la raíz del proyecto con las siguientes variables.

¡Importante! El archivo .env.local nunca debe ser subido a tu repositorio de Git.

# URL de tu instancia de Appwrite

NEXT_PUBLIC_APPWRITE_ENDPOINT="[https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)"

# ID de tu proyecto en Appwrite

NEXT_PUBLIC_APPWRITE_PROJECT="TU_ID_DE_PROYECTO"

# ID de la Base de Datos

NEXT_PUBLIC_APPWRITE_DATABASE="TU_ID_DE_DATABASE"

# IDs de las Colecciones

NEXT_PUBLIC_APPWRITE_USERS_COLLECTION="TU_ID_COLECCION_USUARIOS"
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION="TU_ID_COLECCION_ARCHIVOS"
NEXT_PUBLIC_APPWRITE_MONTHLY_DATA_COLLECTION="TU_ID_COLECCION_DATOS_MENSUALES"
NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION="TU_ID_COLECCION_EVENTOS"

# ID del Bucket de Storage

NEXT_PUBLIC_APPWRITE_BUCKET="TU_ID_BUCKET_STORAGE"

# URL base de la aplicación (para desarrollo)

NEXT_PUBLIC_APP_URL="http://localhost:3000"

# --- CLAVE SECRETA ---

# Esta clave SÓLO se usa en el backend (Server Actions / API Routes)

# NUNCA la expongas en el lado del cliente.

NEXT_APPWRITE_KEY="TU_API_KEY_SECRETA_DE_APPWRITE"

📂 Estructura de Carpetas

La estructura del proyecto sigue las convenciones del App Router de Next.js.

reforma-tambo/
├── app/
│ ├── (auth)/ # Rutas y layouts para autenticación (sign-in, sign-up)
│ ├── (root)/ # Rutas y layouts para la app principal (protegidas)
│ ├── calendar/ # Ejemplo de ruta de la app
│ ├── juan/ # Ejemplo de ruta de la app
│ ├── layout.tsx # Layout raíz
│ └── globals.css # Estilos globales
├── components/ # Componentes reutilizables de React (ej: Shadcn/ui)
├── constants/ # Constantes globales (ej: textos, IDs)
├── hooks/ # Hooks personalizados de React
├── lib/ # Funciones de utilidad (ej: cliente Appwrite, utils)
├── public/ # Archivos estáticos (imágenes, fuentes)
├── types/ # Definiciones de tipos e interfaces de TypeScript
├── .env.local # Variables de entorno (¡Ignorado por Git!)
├── next.config.ts # Configuración de Next.js
├── tailwind.config.ts # Configuración de Tailwind CSS
└── tsconfig.json # Configuración de TypeScript

📜 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles (puedes añadir uno si lo deseas).
