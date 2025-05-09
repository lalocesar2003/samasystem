// app/(auth)/reset/ResetPasswordForm.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "@/lib/actions/user.actions";

export default function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const userId = params.get("userId") ?? "";
  const secret = params.get("secret") ?? "";

  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await resetPassword({ userId, secret, newPassword: pwd });
      router.replace("/");
    } catch {
      try {
        await resetPassword({ userId, secret, newPassword: pwd });
        router.replace("/sign-in?reset=success");
      } catch {
        setError("Link invalid or expired.");
      } finally {
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-semibold text-center">Set new password</h1>

      <input
        type="password"
        placeholder="New password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 bg-brand py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save password"}
      </button>

      {error && <p className="text-center text-red-500">{error}</p>}
    </form>
  );
}
