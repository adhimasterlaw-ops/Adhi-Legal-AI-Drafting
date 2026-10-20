import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthFormInput } from "@/components/auth/AuthFormInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Lupa Password — LegalAI Indonesia" },
      { name: "description", content: "Minta tautan pemulihan akun LegalAI Indonesia." },
      { property: "og:title", content: "Lupa Password — LegalAI Indonesia" },
      { property: "og:description", content: "Pulihkan akses ke akun LegalAI Indonesia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});
function ResetPassword() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    const parsed = z.string().email().safeParse(email);
    if (!parsed.success) return setError("Masukkan alamat email yang valid.");
    setLoading(true);
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setLoading(false);
    if (result.error)
      return setError("Link belum dapat dikirim. Tunggu beberapa menit dan coba lagi.");
    setSent(true);
  }
  return (
    <AuthLayout>
      {sent ? (
        <div className="text-center">
          <CheckCircle2 className="mx-auto text-primary" size={56} />
          <h1 className="mt-5 text-2xl font-extrabold">Email Terkirim!</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Cek inbox Anda dan klik link reset password. Link berlaku 24 jam.
          </p>
          <div className="mt-7">
            <AuthButton>
              <Link to="/login" className="w-full">
                Kembali ke Login
              </Link>
            </AuthButton>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold">Lupa Password?</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Kami akan mengirim link reset ke email Anda
            </p>
          </div>
          <form onSubmit={submit} className="mt-7 space-y-5">
            <AuthFormInput
              id="reset-email"
              name="email"
              type="email"
              label="Email"
              placeholder="nama@email.com"
              icon={Mail}
              helperText="Masukkan email yang terdaftar"
              required
            />
            {error && (
              <div
                role="alert"
                className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
              >
                {error}
              </div>
            )}
            <AuthButton type="submit" loading={loading}>
              Kirim Link Reset
            </AuthButton>
          </form>
          <p className="mt-7 text-center text-sm">
            <Link to="/login" className="font-bold text-primary hover:underline">
              Kembali ke Login
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
