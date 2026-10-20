import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { documentTemplates } from "./templates";
import { TemplateCard } from "./TemplateCard";
import type { DocumentTemplate } from "./types";

const categories = [
  "Semua",
  "Somasi",
  "Gugatan",
  "Kontrak",
  "Surat Kuasa",
  "Perjanjian",
  "Lainnya",
];

export function TemplateGrid({ onSelect }: { onSelect: (template: DocumentTemplate) => void }) {
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");
  const items = useMemo(
    () =>
      documentTemplates.filter(
        (item) =>
          (category === "Semua" || item.category === category) &&
          `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [category, query],
  );
  return (
    <section aria-labelledby="template-heading" className="mt-9">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 id="template-heading" className="text-xl font-bold">
            Pilih template
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Mulai dari format yang tepat untuk kebutuhan hukum Anda.
          </p>
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
            placeholder="Cari template..."
            aria-label="Cari template"
          />
        </div>
      </div>
      <Tabs value={category} onValueChange={setCategory} className="mt-5">
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto min-w-max">
            {categories.map((item) => (
              <TabsTrigger key={item} value={item}>
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <TemplateCard key={item.id} template={item} onSelect={onSelect} />
        ))}
      </div>
      {items.length === 0 && (
        <div className="mt-5 rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
          Template tidak ditemukan.
        </div>
      )}
    </section>
  );
}
