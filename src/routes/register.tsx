import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Briefcase, Building2, Lock, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthFormInput } from "@/components/auth/AuthFormInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { getPasswordScore, PasswordStrength } from "@/components/auth/PasswordStrength";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/auth-errors";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Daftar Gratis — LegalAI Indonesia" },
      { name: "description", content: "Buat akun LegalAI Indonesia untuk mulai konsultasi hukum." },
      { property: "og:title", content: "Daftar Gratis — LegalAI Indonesia" },
      {
        property: "og:description",
        content: "Daftar dalam 30 detik dan mulai gunakan LegalAI Indonesia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegisterPage,
});

const accountSchema = z
  .object({
    fullName: z.string().trim().min(2, "Nama lengkap minimal 2 karakter.").max(100),
    email: z.string().trim().email("Masukkan email yang valid."),
    password: z.string().min(8, "Password minimal 8 karakter."),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Konfirmasi password tidak cocok.",
    path: ["confirm"],
  })
  .refine((v) => getPasswordScore(v.password) >= 3, {
    message: "Gunakan huruf besar, huruf kecil, dan angka.",
    path: ["password"],
  });

function RegisterPage() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState({ fullName: "", email: "", password: "" });
  function next() {
    const form = new FormData(formRef.current ?? undefined);
    const parsed = accountSchema.safeParse({
      fullName: form.get("fullName"),
      email: form.get("email"),
      password: form.get("password"),
      confirm: form.get("confirm"),
    });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Periksa data Anda.");
    setAccount({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setError("");
    setStep(2);
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step === 1) return next();
    const form = new FormData(e.currentTarget);
    if (form.get("terms") !== "on")
      return setError("Anda harus menyetujui ketentuan layanan dan kebijakan privasi.");
    const phone = String(form.get("phone") ?? "").trim();
    if (phone && !/^08\d{8,13}$/.test(phone))
      return setError("Gunakan format nomor Indonesia, misalnya 08123456789.");
    setLoading(true);
    setError("");
    const { data, error: signupError } = await supabase.auth.signUp({
      email: String(form.get("email")),
      password: String(form.get("password")),
      options: {
        data: { full_name: String(form.get("fullName")) },
        emailRedirectTo: window.location.origin,
      },
    });
    if (signupError || !data.user) {
      setLoading(false);
      return setError(friendlyAuthError(signupError?.message ?? ""));
    }
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: String(form.get("fullName")),
      phone: phone || null,
      profession: String(form.get("profession") || "Lainnya") as
        "Advokat" | "Konsultan Hukum" | "In-House Counsel" | "Mahasiswa Hukum" | "Lainnya",
      institution: String(form.get("institution") || "") || null,
    });
    setLoading(false);
    if (profileError)
      return setError("Akun dibuat, tetapi profil belum tersimpan. Silakan hubungi dukungan.");
    await navigate({ to: "/dashboard/onboarding" });
  }
  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-2xl font-extrabold">Buat Akun Gratis</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Daftar dalam 30 detik, langsung bisa konsultasi
        </p>
      </div>
      <div className="mt-6">
        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
          <span>Langkah {step} dari 2</span>
          <span>{step === 1 ? "Informasi akun" : "Profil"}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full bg-secondary transition-all ${step === 1 ? "w-1/2" : "w-full"}`}
          />
        </div>
      </div>
      <form ref={formRef} onSubmit={submit} className="mt-6 space-y-4">
        {step === 1 ? (
          <>
            <AuthFormInput
              id="fullName"
              name="fullName"
              label="Nama Lengkap"
              placeholder="John Doe"
              icon={User}
              defaultValue={account.fullName}
              required
            />
            <AuthFormInput
              id="register-email"
              name="email"
              type="email"
              label="Email"
              placeholder="nama@email.com"
              icon={Mail}
              defaultValue={account.email}
              required
            />
            <div>
              <AuthFormInput
                id="register-password"
                name="password"
                type="password"
                label="Password"
                placeholder="Minimal 8 karakter"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordStrength password={password} />
            </div>
            <AuthFormInput
              id="confirm"
              name="confirm"
              type="password"
              label="Konfirmasi Password"
              placeholder="Ulangi password"
              icon={LockKeyhole}
              defaultValue={account.password}
              required
            />
          </>
        ) : (
          <>
            <input type="hidden" name="fullName" value={account.fullName} readOnly />
            <input type="hidden" name="email" value={account.email} readOnly />
            <input type="hidden" name="password" value={account.password} readOnly />
            <AuthFormInput
              id="phone"
              name="phone"
              type="tel"
              label="No. HP (opsional)"
              placeholder="08123456789"
              icon={Phone}
            />
            <label className="block text-sm font-semibold" htmlFor="profession">
              Profesi
            </label>
            <div className="relative">
              <Briefcase
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <select
                id="profession"
                name="profession"
                className="h-12 w-full appearance-none rounded-md border border-input bg-background pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                <option>Advokat</option>
                <option>Konsultan Hukum</option>
                <option>In-House Counsel</option>
                <option>Mahasiswa Hukum</option>
                <option>Lainnya</option>
              </select>
            </div>
            <AuthFormInput
              id="institution"
              name="institution"
              label="Instansi/Kantor (opsional)"
              placeholder="Nama kantor atau universitas"
              icon={Building2}
            />
            <label className="flex items-start gap-3 text-xs leading-relaxed">
              <input type="checkbox" name="terms" className="mt-0.5 size-4 accent-primary" />
              <span>
                Saya setuju dengan{" "}
                <a href="#terms" className="font-semibold text-primary underline">
                  Terms of Service
                </a>{" "}
                dan{" "}
                <a href="#privacy" className="font-semibold text-primary underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </>
        )}
        {error && (
          <div role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          {step === 2 && (
            <AuthButton
              type="button"
              variant="outline"
              onClick={() => {
                setError("");
                setStep(1);
              }}
            >
              Kembali
            </AuthButton>
          )}
          <AuthButton
            type={step === 1 ? "button" : "submit"}
            onClick={step === 1 ? next : undefined}
            loading={loading}
          >
            {step === 1 ? "Lanjutkan" : "Daftar Gratis"}
          </AuthButton>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link to="/login" className="font-bold text-primary hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
