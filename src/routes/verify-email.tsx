import { Link, createFileRoute } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthLayout } from "@/components/auth/AuthLayout";
export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verifikasi Email — LegalAI Indonesia" },
      { name: "description", content: "Verifikasi alamat email akun LegalAI Indonesia." },
      { property: "og:title", content: "Verifikasi Email — LegalAI Indonesia" },
      { property: "og:description", content: "Selesaikan verifikasi akun LegalAI Indonesia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VerifyEmail,
});
function VerifyEmail() {
  return (
    <AuthLayout>
      <div className="text-center">
        <MailCheck className="mx-auto text-primary" size={56} />
        <h1 className="mt-5 text-2xl font-extrabold">Verifikasi Email Anda</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Kami telah mengirim email verifikasi. Cek inbox dan klik link verifikasi.
        </p>
        <div className="mt-7">
          <AuthButton variant="outline">Kirim Ulang Email</AuthButton>
        </div>
        <p className="mt-5 text-sm">
          <Link to="/login" className="font-bold text-primary hover:underline">
            Kembali ke Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
