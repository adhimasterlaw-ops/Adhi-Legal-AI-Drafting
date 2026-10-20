import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  FileClock,
  FileSearch,
  FileSignature,
  MessageSquareText,
  Scale,
  Sparkles,
  Star,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  head: () => ({
    meta: [
      { title: "Dashboard — LegalAI Indonesia" },
      { name: "description", content: "Ruang kerja AI hukum LegalAI Indonesia." },
      { property: "og:title", content: "Dashboard — LegalAI Indonesia" },
      { property: "og:description", content: "Ruang kerja AI hukum LegalAI Indonesia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardHome,
});

const actions = [
  {
    title: "Chat Hukum",
    description: "Tanyakan persoalan hukum dengan referensi pasal.",
    to: "/dashboard/chat",
    icon: MessageSquareText,
    accent: "bg-primary text-primary-foreground",
  },
  {
    title: "Analisis Kontrak",
    description: "Temukan risiko dan klausul penting lebih cepat.",
    to: "/dashboard/analisis-kontrak",
    icon: FileSearch,
    accent: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Draft Dokumen",
    description: "Susun dokumen hukum dari template terpercaya.",
    to: "/dashboard/draft-dokumen",
    icon: FileSignature,
    accent: "bg-accent text-accent-foreground",
  },
  {
    title: "Riset Hukum",
    description: "Telusuri peraturan dan yurisprudensi Indonesia.",
    to: "/dashboard/riset-hukum",
    icon: BookOpenCheck,
    accent: "bg-muted text-primary",
  },
] as const;

function DashboardHome() {
  const { user } = useAuth();
  const name = String(
    user?.user_metadata?.["full_name"] || user?.email?.split("@")[0] || "Pengguna",
  ).split(" ")[0];
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">Ruang kerja hukum Anda</p>
          <h1 className="mt-1 truncate font-display text-2xl font-extrabold text-foreground sm:text-3xl">
            Selamat datang, {name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Apa yang ingin Anda kerjakan hari ini?
          </p>
        </div>
        <div className="hidden size-12 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground sm:grid">
          <Scale size={23} />
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="group rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
          >
            <div className={`grid size-10 place-items-center rounded-md ${action.accent}`}>
              <action.icon size={20} />
            </div>
            <h2 className="mt-5 font-display text-base font-bold">{action.title}</h2>
            <p className="mt-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
              {action.description}
            </p>
            <span className="mt-5 flex items-center gap-1.5 text-sm font-bold text-primary">
              Mulai{" "}
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-display font-bold">Aktivitas Terbaru</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Pekerjaan hukum yang terakhir Anda buka
              </p>
            </div>
            <Link
              to="/dashboard/riwayat"
              className="text-sm font-bold text-primary hover:underline"
            >
              Lihat semua
            </Link>
          </div>
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-4">
            <div className="grid size-9 shrink-0 place-items-center rounded-md bg-muted text-primary">
              <FileClock size={17} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Aktivitas Anda akan tampil di sini</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                Mulai konsultasi atau unggah dokumen
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">Baru</span>
          </div>
        </div>
        <aside className="rounded-lg border border-primary/20 bg-primary p-6 text-primary-foreground">
          <Sparkles size={24} />
          <h2 className="mt-5 font-display text-xl font-extrabold">Tips LegalAI</h2>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">
            Sertakan konteks, tujuan, dan wilayah hukum agar jawaban AI lebih relevan.
          </p>
          <Link
            to="/dashboard/bantuan"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-secondary"
          >
            Pelajari cara bertanya <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Konsultasi bulan ini", value: "2", icon: MessageSquareText },
          { label: "Dokumen dianalisis", value: "0", icon: FileSearch },
          { label: "Item favorit", value: "0", icon: Star },
        ].map((stat) => (
          <div
            key={stat.label}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center rounded-lg border border-border bg-card p-5"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-muted-foreground">{stat.label}</p>
              <p className="mt-2 font-display text-2xl font-extrabold">{stat.value}</p>
            </div>
            <stat.icon className="shrink-0 text-primary/45" size={24} />
          </div>
        ))}
      </div>
    </section>
  );
}
