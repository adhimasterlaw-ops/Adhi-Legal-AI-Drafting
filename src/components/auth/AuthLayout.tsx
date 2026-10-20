import { Link } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero px-4 py-10 text-foreground">
      <div className="absolute inset-0 bg-linear-to-br from-hero via-hero to-hero-deep" />
      <div className="relative w-full max-w-md animate-fade-up rounded-lg border border-border bg-background p-6 shadow-2xl sm:p-10">
        <Link
          to="/"
          className="mx-auto mb-7 flex w-fit items-center gap-2.5 font-display text-lg font-extrabold text-primary"
        >
          <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <Scale size={20} />
          </span>
          LegalAI Indonesia
        </Link>
        {children}
      </div>
    </main>
  );
}
