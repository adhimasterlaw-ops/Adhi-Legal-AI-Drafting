import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthFormInput } from "@/components/auth/AuthFormInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { lovable } from "@/integrations/lovable";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/auth-errors";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — LegalAI Indonesia" },
      { name: "description", content: "Masuk ke akun LegalAI Indonesia Anda." },
      { property: "og:title", content: "Login — LegalAI Indonesia" },
      {
        property: "og:description",
        content: "Masuk untuk melanjutkan ke dashboard LegalAI Indonesia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Masukkan alamat email yang valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const parsed = schema.safeParse({ email: form.get("email"), password: form.get("password") });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Periksa data Anda.");
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (authError) return setError(friendlyAuthError(authError.message));
    await navigate({ to: "/dashboard" });
  }
  async function social(provider: "google" | "microsoft") {
    setError("");
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Login sosial belum berhasil. Silakan coba lagi.");
      setLoading(false);
      return;
    }
    if (!result.redirected) await navigate({ to: "/dashboard" });
  }
  const configured = isSupabaseConfigured();
  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-2xl font-extrabold">Selamat Datang Kembali</h1>
        <p className="mt-2 text-sm text-muted-foreground">Login untuk lanjut ke dashboard</p>
      </div>
      {!configured && (
        <div
          role="status"
          className="mt-5 rounded-md border border-amber-500/25 bg-amber-500/10 p-3 text-left text-xs leading-relaxed text-amber-800 dark:text-amber-200"
        >
          <span className="font-semibold">Layanan Belum Dikonfigurasi:</span> Database dan
          autentikasi Supabase saat ini belum terhubung. Silakan setel{" "}
          <code className="font-mono text-[11px] font-bold">SUPABASE_URL</code> dan{" "}
          <code className="font-mono text-[11px] font-bold">SUPABASE_PUBLISHABLE_KEY</code> di
          environment untuk mengaktifkan akun.
        </div>
      )}
      <form onSubmit={submit} className="mt-7 space-y-5">
        <AuthFormInput
          id="login-email"
          name="email"
          type="email"
          label="Email"
          placeholder="nama@email.com"
          icon={Mail}
          required
        />
        <div>
          <AuthFormInput
            id="login-password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            icon={Lock}
            required
          />
          <div className="mt-2 text-right">
            <Link
              to="/reset-password"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Lupa password?
            </Link>
          </div>
        </div>
        {error && (
          <div role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <AuthButton type="submit" loading={loading}>
          Login
        </AuthButton>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        atau
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="space-y-3">
        <AuthButton variant="outline" onClick={() => void social("google")}>
          <span className="font-bold text-primary">G</span> Login dengan Google
        </AuthButton>
        <AuthButton variant="outline" onClick={() => void social("microsoft")}>
          <span className="grid grid-cols-2 gap-0.5">
            <i className="size-1.5 bg-primary" />
            <i className="size-1.5 bg-secondary" />
            <i className="size-1.5 bg-secondary" />
            <i className="size-1.5 bg-primary" />
          </span>{" "}
          Login dengan Microsoft
        </AuthButton>
      </div>
      <p className="mt-7 text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link to="/register" className="font-bold text-primary hover:underline">
          Daftar
        </Link>
      </p>
    </AuthLayout>
  );
}
