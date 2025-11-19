"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInWithEmail } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; // Importa íconos

type FormType = "sign-in" | "sign-up";

// 1. Schema movido fuera del componente
// 1. Schema movido fuera del componente
const authFormSchema = (formType: FormType) => {
  // --- INICIO DE CAMBIOS ---

  // Creamos una base para la contraseña
  let passwordSchema = z.string();

  // Añadimos reglas fuertes SOLO para el registro (sign-up)
  if (formType === "sign-up") {
    passwordSchema = passwordSchema
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[a-zA-Z]/, "La contraseña debe contener al menos una letra") // <-- Debe tener letras
      .regex(/[0-9]/, "La contraseña debe contener al menos un número"); // <-- Debe tener números
  } else {
    // Para sign-in, mantenemos una regla simple
    passwordSchema = passwordSchema.min(1, "Por favor, ingresa tu contraseña");
  }

  return z.object({
    email: z.string().email("Debe ser un correo electrónico válido"), // <-- Mensaje en español
    fullName:
      formType === "sign-up"
        ? z
            .string()
            .min(2, "El nombre debe tener al menos 2 caracteres") // <-- Mensaje en español
            .max(50, "El nombre no puede tener más de 50 caracteres") // <-- Mensaje en español
        : z.string().optional(),

    // Asignamos el schema de contraseña que construimos
    password: passwordSchema,
  });
  // --- FIN DE CAMBIOS ---
};
// 4. Objeto de configuración para textos y lógica
const formConfig = {
  "sign-in": {
    title: "Sign In",
    buttonText: "Sign In",
    linkText: "Sign Up",
    linkHref: "/sign-up",
    promptText: "Don't have an account?",
    showForgot: true,
  },
  "sign-up": {
    title: "Sign Up",
    buttonText: "Sign Up",
    linkText: "Sign In",
    linkHref: "/sign-in",
    promptText: "Already have an account?",
    showForgot: false,
  },
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 5. Estado para ver/ocultar pw
  const config = formConfig[type]; // 4. Usando el config
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  // 2. Usando isSubmitting de formState
  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setErrorMessage(""); // Limpiar errores previos

    try {
      if (type === "sign-up") {
        await createAccount({
          fullName: values.fullName ?? "",
          email: values.email,
          password: values.password,
        });
      } else {
        const res = await signInWithEmail({
          email: values.email,
          password: values.password,
        });
        if (!res?.ok) {
          setErrorMessage(res?.error || "Error al iniciar sesión.");
          return; // No redirijas si hubo error
        }
      }
      router.replace("/");
    } catch (error) {
      // 3. Manejo de errores mejorado
      let message = "Failed to authenticate. Please try again.";
      if (error instanceof Error) {
        message = error.message; // Mostrar error real de la server action
      }
      setErrorMessage(message);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">{config.title}</h1> {/* 4. */}
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="shad-input"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          {/* 5. Campo de contraseña mejorado */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                  </div>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="form-submit-button"
            disabled={isSubmitting} // 2.
          >
            {config.buttonText} {/* 4. */}
            {isSubmitting && ( // 2.
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>
          {errorMessage && (
            <p className="error-message text-red-500 text-sm mt-2">
              *{errorMessage}
            </p>
          )}
          <div className="flex flex-col items-center text-sm mt-4 space-y-1">
            <div className="flex">
              <p className="text-light-100">{config.promptText}</p> {/* 4. */}
              <Link
                href={config.linkHref} // 4.
                className="ml-1 font-medium text-brand hover:underline"
              >
                {config.linkText} {/* 4. */}
              </Link>
            </div>
          </div>
        </form>
      </Form>

      {/* 4. Mostrar "Forgot password" condicionalmente */}
      {config.showForgot && (
        <Link
          href="/forgot"
          className="text-brand hover:underline text-sm mt-2"
        >
          Forgot password?
        </Link>
      )}
    </>
  );
};

export default AuthForm;
