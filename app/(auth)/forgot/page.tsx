// app/(auth)/forgot/page.tsx
"use client";
import { useState } from "react";
import { sendResetEmail } from "@/lib/actions/user.actions";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendResetEmail(email);
      setSent(true);
    } catch {
      setError("Could not send recovery e-mail");
    }
  };

  if (sent) return <p className="text-center mt-20">Check your inbox 📧</p>;

  return (
    <form onSubmit={handleSubmit} className="w-80 mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-semibold text-center">Forgot password</h1>
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button className="w-full bg-blue-600  bg-brand py-2 rounded">
        Send reset link
      </button>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </form>
  );
}
