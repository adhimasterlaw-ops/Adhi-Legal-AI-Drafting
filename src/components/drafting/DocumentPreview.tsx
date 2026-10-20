import type { DocumentTemplate, DraftFormData } from "./types";

export function draftValues(data: DraftFormData) {
  const date = new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date());
  return {
    nama_pihak_1: data.firstParty.name,
    no_ktp_pihak_1: data.firstParty.ktp,
    alamat_pihak_1: data.firstParty.address,
    nama_pihak_2: data.secondParty.name,
    alamat_pihak_2: data.secondParty.address,
    objek: data.subject,
    jumlah_utang: data.amount ? `${data.currency} ${data.amount}` : "",
    tanggal_mulai: data.startDate,
    tanggal_berakhir: data.endDate,
    kronologi: data.chronology,
    kota: data.location,
    tanggal_surat: date,
    nomor_surat: "[Nomor surat]",
  };
}

export function fillTemplate(template: DocumentTemplate, data: DraftFormData) {
  const values = draftValues(data) as Record<string, string>;
  return template.templateContent.replace(
    /{{(.*?)}}/g,
    (_, key: string) => values[key.trim()] || `[${key.trim().replaceAll("_", " ")}]`,
  );
}

export function DocumentPreview({
  template,
  data,
  content,
}: {
  template: DocumentTemplate;
  data: DraftFormData;
  content?: string;
}) {
  const text = content || fillTemplate(template, data);
  return (
    <div
      className="mx-auto min-h-[640px] w-full max-w-[794px] bg-card px-8 py-10 text-sm leading-7 shadow-sm ring-1 ring-border sm:px-14"
      style={{ fontFamily: '"Times New Roman", serif' }}
    >
      {text.split("\n").map((line, index) => (
        <p
          key={`${index}-${line}`}
          className={
            line === line.toUpperCase() && line.length > 3 ? "text-center font-bold" : "min-h-4"
          }
        >
          {line.includes("[") ? <span className="bg-accent">{line}</span> : line}
        </p>
      ))}
    </div>
  );
}
