import { Suspense } from "react";
import ResetPasswordForm from "../../../components/ResetPasswordForm";

export default function ResetPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Cargando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
