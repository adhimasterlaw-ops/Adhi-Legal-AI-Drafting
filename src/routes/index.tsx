import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  FileSearch,
  FileText,
  Instagram,
  Linkedin,
  Menu,
  MessageSquare,
  PenTool,
  Play,
  Scale,
  ShieldCheck,
  Sparkles,
  Star,
  UserPlus,
  X,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

import heroImage from "@/assets/legalai-hero.jpg";
import { Button } from "@/components/legal/Button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LegalAI Indonesia — Platform AI Hukum Indonesia" },
      {
        name: "description",
        content:
          "Konsultasi hukum, analisis kontrak, drafting dokumen, dan riset peraturan Indonesia berbasis AI.",
      },
      { property: "og:title", content: "LegalAI Indonesia — Platform AI Hukum Indonesia" },
      {
        property: "og:description",
        content: "Asisten AI untuk pekerjaan hukum yang lebih cepat, akurat, dan terukur.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features: { icon: LucideIcon; title: string; description: string; points: string[] }[] = [
  {
    icon: MessageSquare,
    title: "Chat Hukum AI",
    description:
      "Tanya hukum Indonesia dan dapatkan jawaban dengan referensi pasal serta yurisprudensi dalam hitungan detik.",
    points: ["Referensi pasal akurat", "270.000+ peraturan", "Jawaban dalam 3 detik"],
  },
  {
    icon: FileSearch,
    title: "Analisis Kontrak Otomatis",
    description:
      "Unggah kontrak PDF atau DOCX untuk mendeteksi klausul berisiko dan mendapat saran revisi profesional.",
    points: ["Deteksi 50+ jenis risiko", "Saran revisi otomatis", "Laporan PDF instan"],
  },
  {
    icon: PenTool,
    title: "Drafting Dokumen Hukum",
    description:
      "Buat somasi, gugatan, kontrak, dan dokumen hukum lainnya melalui panduan yang mudah digunakan.",
    points: ["50+ template profesional", "Ekspor DOCX & PDF", "Mudah disesuaikan"],
  },
  {
    icon: Scale,
    title: "Riset Peraturan & Yurisprudensi",
    description:
      "Cari UU, PP, Permen, dan putusan pengadilan dengan pencarian semantik berbasis AI.",
    points: ["Pencarian semantik AI", "Filter lanjutan", "Pencarian teks lengkap"],
  },
  {
    icon: FileText,
    title: "Ringkasan Otomatis",
    description:
      "Ringkas dokumen hukum panjang menjadi executive summary yang padat dan mudah ditindaklanjuti.",
    points: ["50 halaman jadi 1", "Sorotan poin penting", "Bahasa formal hukum"],
  },
  {
    icon: ShieldCheck,
    title: "Compliance Monitoring",
    description:
      "Pantau kepatuhan perusahaan terhadap regulasi terbaru dengan pemberitahuan perubahan otomatis.",
    points: ["Pemantauan real-time", "Peringatan regulasi", "Laporan kepatuhan"],
  },
];

const plans = [
  {
    name: "FREE",
    badge: "Starter",
    price: "Rp 0",
    period: "/selamanya",
    description: "Untuk individu yang baru mencoba",
    features: [
      "10 chat/hari",
      "2 analisis kontrak/bulan",
      "5 template drafting dasar",
      "Riset peraturan dasar",
    ],
    unavailable: ["Ekspor PDF", "Yurisprudensi", "Priority support"],
    cta: "Daftar Gratis",
  },
  {
    name: "PRO",
    badge: "Best Value",
    price: "Rp 299.000",
    period: "/bulan",
    description: "Untuk advokat dan konsultan profesional",
    features: [
      "Unlimited chat",
      "50 analisis kontrak/bulan",
      "Semua template (50+)",
      "Riset advanced + yurisprudensi",
      "Ekspor PDF & DOCX",
      "10 ringkasan/bulan",
      "Priority email support",
    ],
    unavailable: ["API access"],
    cta: "Pilih Pro",
    featured: true,
  },
  {
    name: "ENTERPRISE",
    badge: "Premium",
    price: "Hubungi Kami",
    period: "",
    description: "Untuk law firm dan korporasi",
    features: [
      "Semua fitur Pro unlimited",
      "API access 10k calls/bulan",
      "White-label option",
      "Custom templates",
      "Dedicated account manager",
      "SLA 99,9% uptime",
      "Training & onboarding",
    ],
    unavailable: [],
    cta: "Kontak Sales",
  },
];

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <a
      href="#top"
      className={`flex items-center gap-2.5 font-display text-lg font-extrabold ${inverse ? "text-hero-foreground" : "text-primary"}`}
      aria-label="LegalAI Indonesia, kembali ke atas"
    >
      <span
        className={`grid size-9 place-items-center rounded-md ${inverse ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`}
      >
        <Scale size={20} />
      </span>
      LegalAI Indonesia
    </a>
  );
}

function SectionHeading({
  badge,
  title,
  text,
  inverse = false,
}: {
  badge?: string;
  title: string;
  text?: string;
  inverse?: boolean;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <div
        className={`mb-3 text-xs font-bold uppercase tracking-[0.18em] ${inverse ? "text-secondary" : "text-primary"}`}
      >
        {badge}
      </div>
      <h2
        className={`text-3xl font-extrabold md:text-4xl ${inverse ? "text-hero-foreground" : "text-foreground"}`}
      >
        {title}
      </h2>
      {text && (
        <p
          className={`mt-4 text-lg leading-relaxed ${inverse ? "text-hero-foreground/70" : "text-muted-foreground"}`}
        >
          {text}
        </p>
      )}
    </div>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = [
    { label: "Fitur", href: "#fitur" },
    { label: "Harga", href: "#harga" },
    { label: "Tentang", href: "#cara-kerja" },
    { label: "Kontak", href: "#kontak" },
  ];
  return (
    <div id="top" className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi utama">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="outline">
              <a href="/login">Login</a>
            </Button>
            <Button asChild>
              <a href="/register">Daftar Gratis</a>
            </Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
        {menuOpen && (
          <div className="border-t border-border bg-background px-5 py-5 md:hidden">
            <nav className="flex flex-col gap-1">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-3 font-medium hover:bg-muted"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="outline">Login</Button>
                <Button>Daftar Gratis</Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        <section className="relative min-h-[86vh] bg-hero pt-18 text-hero-foreground">
          <div className="absolute inset-0 bg-linear-to-br from-hero via-hero to-hero-deep" />
          <div className="relative mx-auto grid min-h-[calc(86vh-4.5rem)] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
            <div className="animate-fade-up max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
                <Sparkles size={15} /> Platform AI Hukum #1 di Indonesia
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
                AI Advokat & Konsultan Hukum Indonesia
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-hero-foreground/75 md:text-xl">
                Konsultasi hukum instan 24/7 dengan referensi pasal, analisis kontrak otomatis, dan
                drafting dokumen hukum profesional.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" variant="gold">
                  Mulai Konsultasi Gratis <ArrowRight size={18} />
                </Button>
                <Button size="lg" variant="outline-inverse">
                  <Play size={17} fill="currentColor" /> Lihat Demo
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-hero-foreground/70">
                {["Dipercaya 1.000+ advokat", "270.000+ peraturan", "Akurasi 95%+"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="text-secondary" size={17} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative overflow-hidden rounded-lg border border-hero-foreground/15 bg-hero-deep shadow-2xl">
                <img
                  src={heroImage}
                  width={1280}
                  height={1280}
                  alt="Advokat Indonesia bekerja dengan asisten AI hukum"
                  className="aspect-[4/4.35] w-full object-cover"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-linear-to-t from-hero-deep/55 via-transparent to-transparent" />
              </div>
              <div className="animate-float absolute -left-4 bottom-14 flex items-center gap-3 rounded-md border border-hero-foreground/15 bg-background px-4 py-3 text-foreground shadow-xl">
                <MessageSquare className="text-primary" size={20} />
                <div>
                  <div className="text-xs text-muted-foreground">Asisten AI</div>
                  <div className="text-sm font-bold">Chat Hukum</div>
                </div>
              </div>
              <div className="animate-float absolute -right-3 top-14 flex items-center gap-3 rounded-md border border-secondary/30 bg-background px-4 py-3 text-foreground shadow-xl [animation-delay:1s]">
                <FileCheck2 className="text-secondary" size={21} />
                <div>
                  <div className="text-xs text-muted-foreground">Risiko terdeteksi</div>
                  <div className="text-sm font-bold">Analisis Kontrak</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="fitur" className="scroll-mt-18 px-5 py-24 lg:px-8">
          <SectionHeading
            badge="Fitur Unggulan"
            title="Semua yang Anda Butuhkan untuk Pekerjaan Hukum"
            text="Satu platform terintegrasi untuk praktik hukum yang lebih cepat dan presisi."
          />
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description, points }) => (
              <article
                key={title}
                className="group rounded-lg border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                <div className="mb-5 grid size-12 place-items-center rounded-md bg-primary/8 text-primary">
                  <Icon size={25} />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 min-h-20 leading-relaxed text-muted-foreground">{description}</p>
                <ul className="mt-5 space-y-2 border-t border-border pt-5">
                  {points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm font-medium">
                      <Check size={16} className="text-secondary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="cara-kerja" className="scroll-mt-18 bg-muted px-5 py-24 lg:px-8">
          <SectionHeading
            badge="Cara Kerja"
            title="Mulai dalam Tiga Langkah"
            text="Tanpa instalasi, tanpa kartu kredit, dan langsung siap digunakan."
          />
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {[
              [
                UserPlus,
                "Buat Akun dalam 30 Detik",
                "Daftar gratis dan langsung dapatkan 10 chat per hari serta 2 analisis kontrak per bulan.",
              ],
              [
                MessageSquare,
                "Tanya atau Unggah Dokumen",
                "Ajukan pertanyaan hukum, unggah kontrak, atau pilih template dokumen yang Anda perlukan.",
              ],
              [
                CheckCircle2,
                "Dapatkan Jawaban Lengkap",
                "Terima jawaban dengan referensi pasal, analisis risiko, atau dokumen siap pakai.",
              ],
            ].map(([Icon, title, desc], i) => {
              const StepIcon = Icon as LucideIcon;
              return (
                <div key={String(title)} className="relative text-center">
                  <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-secondary text-2xl font-extrabold text-secondary-foreground shadow-gold">
                    {i + 1}
                  </div>
                  <StepIcon className="mx-auto text-primary" size={38} />
                  <h3 className="mt-5 text-xl font-bold">{String(title)}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{String(desc)}</p>
                  {i < 2 && (
                    <ChevronRight
                      className="absolute -right-7 top-6 hidden text-border md:block"
                      size={26}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-5 py-24 lg:px-8">
          <SectionHeading
            badge="Demo Langsung"
            title="Jawaban Hukum yang Bisa Anda Telusuri"
            text="Bukan sekadar jawaban—setiap analisis disertai dasar hukum yang relevan."
          />
          <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border bg-muted px-5 py-4">
              <div className="flex items-center gap-2 font-bold text-primary">
                <Bot size={20} /> LegalAI Assistant
              </div>
              <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="size-2 rounded-full bg-green-500" /> Online
              </span>
            </div>
            <div className="space-y-5 p-5 md:p-8">
              <div className="ml-auto max-w-2xl rounded-lg bg-primary p-4 text-sm leading-relaxed text-primary-foreground">
                Apa ancaman pidana bagi penyebar hoaks menurut UU ITE?
              </div>
              <div className="max-w-3xl rounded-lg border border-border bg-muted p-5 text-sm leading-relaxed">
                <div className="mb-3 flex items-center gap-2 font-bold text-primary">
                  <Scale size={17} /> Berdasarkan UU No. 1 Tahun 2024
                </div>
                <p>
                  Pasal 28 Ayat (1) mengatur perbuatan menyebarkan berita bohong dan menyesatkan
                  yang mengakibatkan kerugian konsumen dalam Transaksi Elektronik.
                </p>
                <blockquote className="my-4 border-l-2 border-secondary pl-4 text-muted-foreground">
                  Ketentuan pidana terkait diatur dalam Pasal 45A Ayat (1), dengan ancaman pidana
                  dan/atau denda sesuai unsur yang terpenuhi.
                </blockquote>
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <BookOpen size={15} /> Sumber: UU ITE Pasal 28 dan Pasal 45A
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button size="lg">
              Coba Sendiri Gratis <ArrowRight size={18} />
            </Button>
          </div>
        </section>

        <section className="border-y border-border bg-muted/50 px-5 py-24 lg:px-8">
          <SectionHeading badge="Dipercaya Profesional" title="Apa Kata Pengguna LegalAI" />
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {[
              [
                "R",
                "Riko Pratama, S.H.",
                "Advokat, Jakarta",
                "Riset yang biasanya dua jam sekarang selesai dalam sepuluh menit. Saya bekerja lebih cepat tanpa takut salah pasal.",
              ],
              [
                "I",
                "Indri Wijaya, S.H., M.H.",
                "Konsultan Hukum Korporasi",
                "Analisis kontraknya membantu menemukan klausul berisiko tinggi sebelum kontrak klien ditandatangani.",
              ],
              [
                "A",
                "Andi Saputra",
                "Mahasiswa Hukum UI",
                "Riset pasal dan yurisprudensi jadi jauh lebih mudah. Template drafting-nya juga sangat profesional.",
              ],
            ].map(([initial, name, role, quote]) => (
              <article key={name} className="rounded-lg border border-border bg-card p-7">
                <div className="mb-5 flex gap-1 text-secondary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={17} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="leading-relaxed">“{quote}”</blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <div className="grid size-10 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
                    {initial}
                  </div>
                  <div>
                    <div className="font-bold">{name}</div>
                    <div className="text-sm text-muted-foreground">{role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="harga" className="scroll-mt-18 bg-hero px-5 py-24 lg:px-8">
          <SectionHeading
            badge="Harga Transparan"
            title="Pilih Paket yang Sesuai Kebutuhan Anda"
            text="Tanpa biaya tersembunyi. Batalkan kapan saja."
            inverse
          />
          <div className="mx-auto grid max-w-7xl items-stretch gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-lg bg-background p-7 shadow-xl transition-transform duration-300 ${plan.featured ? "border-2 border-secondary lg:-translate-y-3 lg:hover:-translate-y-5" : "border border-border hover:-translate-y-1"}`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground">
                    BEST VALUE
                  </div>
                )}
                <div className="text-xs font-bold tracking-[0.18em] text-primary">{plan.badge}</div>
                <h3 className="mt-2 text-xl font-extrabold">{plan.name}</h3>
                <div className="mt-5 flex min-h-14 items-end gap-1">
                  <span className="text-3xl font-extrabold text-primary">{plan.price}</span>
                  <span className="pb-1 text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
                <ul className="my-7 flex-1 space-y-3 border-t border-border pt-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm">
                      <CheckCircle2 size={17} className="shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                  {plan.unavailable.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                      <X size={17} className="shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.featured ? "gold" : "outline-dark"} size="lg">
                  {plan.cta}
                </Button>
                <div className="mt-3 text-center text-xs text-muted-foreground">
                  {plan.featured
                    ? "Hemat 50% dengan pembayaran tahunan"
                    : plan.name === "FREE"
                      ? "Tanpa kartu kredit"
                      : "Harga khusus tersedia"}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-secondary px-5 py-20 text-center">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-extrabold text-secondary-foreground md:text-4xl">
              Siap Transformasi Pekerjaan Hukum Anda?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-secondary-foreground/75">
              Bergabung dengan 1.000+ advokat dan konsultan yang sudah menggunakan LegalAI
              Indonesia.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg">
                Mulai Gratis Sekarang <ArrowRight size={18} />
              </Button>
              <Button size="lg" variant="outline-dark">
                Jadwalkan Demo
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-semibold text-secondary-foreground/75">
              <span>🔒 Keamanan tingkat bank</span>
              <span>⚡ Siap dalam 5 menit</span>
              <span>💳 Batalkan kapan saja</span>
            </div>
          </div>
        </section>
      </main>

      <footer id="kontak" className="bg-hero-deep px-5 pb-8 pt-16 text-hero-foreground lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 border-b border-hero-foreground/15 pb-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo inverse />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-hero-foreground/60">
              Platform AI hukum Indonesia untuk praktisi, bisnis, dan generasi hukum masa depan.
            </p>
            <div className="mt-5 flex gap-2">
              {[Linkedin, Instagram, X, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#top"
                  aria-label={["LinkedIn", "Instagram", "X", "YouTube"][i]}
                  className="grid size-9 place-items-center rounded-md border border-hero-foreground/20 text-hero-foreground/70 transition-colors hover:border-secondary hover:text-secondary"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
          {[
            ["Produk", "Fitur", "Harga", "Demo", "API", "Changelog"],
            ["Perusahaan", "Tentang Kami", "Kontak", "Karir", "Blog", "Partners"],
            ["Legal", "Privacy Policy", "Terms of Service", "Disclaimer", "Security"],
          ].map(([title, ...links]) => (
            <div key={title}>
              <h3 className="font-bold">{title}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-sm text-hero-foreground/60 transition-colors hover:text-secondary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 pt-7 text-xs text-hero-foreground/45 sm:flex-row sm:justify-between">
          <span>© 2026 LegalAI Indonesia. Hak cipta dilindungi.</span>
          <span>Dibuat dengan sepenuh hati di Indonesia</span>
        </div>
      </footer>
    </div>
  );
}
