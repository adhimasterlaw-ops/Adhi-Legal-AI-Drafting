import type { LucideIcon } from "lucide-react";

type DashboardSectionPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function DashboardSectionPage({
  title,
  description,
  icon: Icon,
}: DashboardSectionPageProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
          <Icon size={21} />
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-extrabold text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-8 rounded-lg border border-dashed border-border bg-card px-6 py-14 text-center">
        <Icon className="mx-auto text-primary/35" size={36} />
        <p className="mt-4 font-semibold text-foreground">
          Ruang kerja {title.toLowerCase()} siap digunakan
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Fitur utama akan ditambahkan pada tahap pengembangan berikutnya.
        </p>
      </div>
    </section>
  );
}
