import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/legal/Button";
export const Route = createFileRoute("/_authenticated/dashboard/onboarding")({
  head: () => ({
    meta: [
      { title: "Selamat Datang — LegalAI Indonesia" },
      { name: "description", content: "Mulai menggunakan akun LegalAI Indonesia." },
      { property: "og:title", content: "Selamat Datang — LegalAI Indonesia" },
      { property: "og:description", content: "Akun LegalAI Indonesia Anda sudah siap." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Onboarding,
});
function Onboarding() {
  return (
    <main className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-lg rounded-lg border border-border bg-background p-8 text-center shadow-lg">
        <CheckCircle2 className="mx-auto text-secondary" size={52} />
        <h1 className="mt-5 text-3xl font-extrabold">Selamat datang di LegalAI</h1>
        <p className="mt-3 text-muted-foreground">
          Profil Anda sudah dibuat. Mari siapkan ruang kerja hukum digital Anda.
        </p>
        <div className="mt-7">
          <Button asChild className="w-full">
            <Link to="/dashboard">Masuk ke Dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
