import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, LockKeyhole } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthFormInput } from "@/components/auth/AuthFormInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { getPasswordScore, PasswordStrength } from "@/components/auth/PasswordStrength";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/update-password")({
  head: () => ({
    meta: [
      { title: "Update Password — LegalAI Indonesia" },
      { name: "description", content: "Buat password baru untuk akun LegalAI Indonesia." },
      { property: "og:title", content: "Update Password — LegalAI Indonesia" },
      { property: "og:description", content: "Amankan kembali akun LegalAI Indonesia Anda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UpdatePassword,
});
function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const confirm = String(new FormData(e.currentTarget).get("confirm") ?? "");
    if (getPasswordScore(password) < 3)
      return setError("Gunakan minimal 8 karakter dengan huruf besar, huruf kecil, dan angka.");
    if (password !== confirm) return setError("Konfirmasi password tidak cocok.");
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError)
      return setError("Link tidak valid atau telah kedaluwarsa. Minta link reset baru.");
    await navigate({ to: "/login", replace: true });
  }
  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-2xl font-extrabold">Update Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Masukkan password baru Anda</p>
      </div>
      <form onSubmit={submit} className="mt-7 space-y-5">
        <div>
          <AuthFormInput
            id="new-password"
            type="password"
            label="Password Baru"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordStrength password={password} />
        </div>
        <AuthFormInput
          id="new-confirm"
          name="confirm"
          type="password"
          label="Konfirmasi Password Baru"
          icon={LockKeyhole}
          required
        />
        {error && (
          <div role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <AuthButton type="submit" loading={loading}>
          Update Password
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
