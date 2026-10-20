import { ChevronLeft, ChevronRight, Eye, Plus, Save, WandSparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DocumentPreview, fillTemplate } from "./DocumentPreview";
import { VariableInput } from "./VariableInput";
import type { DocumentTemplate, DraftFormData, PartyData } from "./types";

const labels = ["Pihak Pertama", "Pihak Kedua", "Objek & Perihal", "Kronologi", "Review"];

function PartyForm({
  value,
  onChange,
  errors,
}: {
  value: PartyData;
  onChange: (value: PartyData) => void;
  errors: Record<string, string>;
}) {
  const set = (key: keyof PartyData, next: string) => onChange({ ...value, [key]: next });
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <VariableInput
        label="Nama lengkap"
        value={value.name}
        onChange={(v) => set("name", v)}
        required
        error={errors["name"]}
      />
      <VariableInput
        label="Nomor KTP"
        value={value.ktp}
        onChange={(v) => set("ktp", v.replace(/\D/g, "").slice(0, 16))}
        required
        placeholder="16 digit"
        error={errors["ktp"]}
      />
      <VariableInput
        label="Tempat lahir"
        value={value.birthPlace}
        onChange={(v) => set("birthPlace", v)}
        required
        error={errors["birthPlace"]}
      />
      <VariableInput
        label="Tanggal lahir"
        type="date"
        value={value.birthDate}
        onChange={(v) => set("birthDate", v)}
        required
        error={errors["birthDate"]}
      />
      <div className="md:col-span-2">
        <VariableInput
          label="Alamat"
          value={value.address}
          onChange={(v) => set("address", v)}
          required
          rows={3}
          error={errors["address"]}
        />
      </div>
      <VariableInput
        label="Nomor HP"
        value={value.phone}
        onChange={(v) => set("phone", v)}
        placeholder="Opsional"
      />
      <VariableInput
        label="Email"
        type="email"
        value={value.email}
        onChange={(v) => set("email", v)}
        placeholder="Opsional"
      />
      <VariableInput
        label="Pekerjaan"
        value={value.occupation}
        onChange={(v) => set("occupation", v)}
        placeholder="Opsional"
      />
    </div>
  );
}

export function FormWizard({
  template,
  initialData,
  initialStep = 1,
  onSave,
  onGenerate,
  saving,
  generating,
}: {
  template: DocumentTemplate;
  initialData: DraftFormData;
  initialStep?: number;
  onSave: (data: DraftFormData, step: number) => void;
  onGenerate: (data: DraftFormData, baseContent: string) => void;
  saving: boolean;
  generating: boolean;
}) {
  const [step, setStep] = useState(initialStep);
  const [data, setData] = useState({ ...initialData, documentType: template.name });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState(false);
  const baseContent = useMemo(() => fillTemplate(template, data), [template, data]);
  const validate = () => {
    const next: Record<string, string> = {};
    const party = step === 1 ? data.firstParty : data.secondParty;
    if (step <= 2) {
      if (!party.name.trim()) next["name"] = "Nama wajib diisi.";
      if (!/^\d{16}$/.test(party.ktp)) next["ktp"] = "Nomor KTP harus 16 digit.";
      if (!party.birthPlace.trim()) next["birthPlace"] = "Tempat lahir wajib diisi.";
      if (!party.birthDate) next["birthDate"] = "Tanggal lahir wajib diisi.";
      if (!party.address.trim()) next["address"] = "Alamat wajib diisi.";
    }
    if (step === 3) {
      if (!data.subject.trim()) next["subject"] = "Objek atau perihal wajib diisi.";
      if (!data.startDate) next["startDate"] = "Tanggal mulai wajib diisi.";
    }
    if (step === 4 && data.chronology.trim().length < 20)
      next["chronology"] = "Kronologi perlu sekurangnya 20 karakter.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const next = () => {
    if (validate()) setStep((current) => Math.min(5, current + 1));
  };
  return (
    <div className="mt-7">
      <div className="mb-7 overflow-x-auto">
        <div className="flex min-w-[580px] items-center">
          {labels.map((label, index) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => index + 1 < step && setStep(index + 1)}
                className="flex min-w-20 flex-col items-center gap-2 text-xs"
              >
                <span
                  className={`grid size-9 place-items-center rounded-full border-2 font-bold ${index + 1 <= step ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"}`}
                >
                  {index + 1}
                </span>
                <span
                  className={
                    index + 1 === step ? "font-semibold text-foreground" : "text-muted-foreground"
                  }
                >
                  {label}
                </span>
              </button>
              {index < 4 && (
                <div
                  className={`mb-6 h-0.5 flex-1 ${index + 1 < step ? "bg-primary" : "bg-border"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <Progress value={step * 20} className="mb-6" />
      <div className="rounded-lg border bg-card p-5 sm:p-7">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase text-secondary">Langkah {step} dari 5</p>
          <h2 className="mt-1 text-xl font-bold">{labels[step - 1]}</h2>
        </div>
        {step === 1 && (
          <PartyForm
            value={data.firstParty}
            onChange={(firstParty) => setData({ ...data, firstParty })}
            errors={errors}
          />
        )}
        {step === 2 && (
          <>
            <label className="mb-5 flex items-center gap-2 text-sm">
              <Checkbox
                checked={data.sameParty}
                onCheckedChange={(checked) =>
                  setData({
                    ...data,
                    sameParty: checked === true,
                    secondParty: checked ? data.firstParty : data.secondParty,
                  })
                }
              />
              Sama dengan Pihak Pertama
            </label>
            <PartyForm
              value={data.secondParty}
              onChange={(secondParty) => setData({ ...data, secondParty, sameParty: false })}
              errors={errors}
            />
          </>
        )}
        {step === 3 && (
          <div className="grid gap-4 md:grid-cols-2">
            <VariableInput
              label="Jenis dokumen"
              value={data.documentType}
              onChange={() => undefined}
            />
            <div className="md:col-span-2">
              <VariableInput
                label="Objek / perihal"
                value={data.subject}
                onChange={(subject) => setData({ ...data, subject })}
                required
                rows={3}
                error={errors["subject"]}
              />
            </div>
            <VariableInput
              label="Nilai"
              value={data.amount}
              onChange={(amount) =>
                setData({
                  ...data,
                  amount: amount.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                })
              }
              placeholder="Opsional"
            />
            <div className="space-y-1.5">
              <Label>Mata uang</Label>
              <Select
                value={data.currency}
                onValueChange={(currency: "IDR" | "USD" | "EUR") => setData({ ...data, currency })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">IDR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <VariableInput
              label="Tanggal mulai"
              type="date"
              value={data.startDate}
              onChange={(startDate) => setData({ ...data, startDate })}
              required
              error={errors["startDate"]}
            />
            <VariableInput
              label="Tanggal berakhir"
              type="date"
              value={data.endDate}
              onChange={(endDate) => setData({ ...data, endDate })}
            />
            <VariableInput
              label="Lokasi"
              value={data.location}
              onChange={(location) => setData({ ...data, location })}
              placeholder="Contoh: Jakarta"
            />
          </div>
        )}
        {step === 4 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="kronologi">
                Kronologi dan detail <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="kronologi"
                rows={10}
                maxLength={2000}
                value={data.chronology}
                onChange={(event) => setData({ ...data, chronology: event.target.value })}
                placeholder="Contoh: Pada tanggal 1 Januari 2026, pihak kedua menerima pinjaman dan berjanji melunasi..."
              />
              <div className="flex justify-between">
                <span className="text-xs text-destructive">{errors["chronology"]}</span>
                <span className="text-xs text-muted-foreground">{data.chronology.length}/2000</span>
              </div>
            </div>
            {data.customDetails.map((detail, index) => (
              <div
                key={detail.id}
                className="grid items-end gap-3 rounded-md border p-3 md:grid-cols-[1fr_140px_1fr_auto]"
              >
                <Input
                  value={detail.label}
                  onChange={(event) =>
                    setData({
                      ...data,
                      customDetails: data.customDetails.map((item, i) =>
                        i === index ? { ...item, label: event.target.value } : item,
                      ),
                    })
                  }
                  placeholder="Nama detail"
                />
                <Select
                  value={detail.type}
                  onValueChange={(type: "text" | "date" | "number") =>
                    setData({
                      ...data,
                      customDetails: data.customDetails.map((item, i) =>
                        i === index ? { ...item, type } : item,
                      ),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Teks</SelectItem>
                    <SelectItem value="date">Tanggal</SelectItem>
                    <SelectItem value="number">Angka</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type={detail.type}
                  value={detail.value}
                  onChange={(event) =>
                    setData({
                      ...data,
                      customDetails: data.customDetails.map((item, i) =>
                        i === index ? { ...item, value: event.target.value } : item,
                      ),
                    })
                  }
                  placeholder="Isi detail"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setData({
                      ...data,
                      customDetails: data.customDetails.filter((_, i) => i !== index),
                    })
                  }
                  aria-label="Hapus detail"
                >
                  <X />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() =>
                setData({
                  ...data,
                  customDetails: [
                    ...data.customDetails,
                    { id: crypto.randomUUID(), label: "", type: "text", value: "" },
                  ],
                })
              }
            >
              <Plus />
              Tambah Detail Lain
            </Button>
          </div>
        )}
        {step === 5 && (
          <div>
            <Accordion type="multiple" defaultValue={["pihak", "objek"]}>
              <AccordionItem value="pihak">
                <AccordionTrigger>Data para pihak</AccordionTrigger>
                <AccordionContent>
                  <p>
                    <strong>Pihak pertama:</strong> {data.firstParty.name} —{" "}
                    {data.firstParty.address}
                  </p>
                  <p>
                    <strong>Pihak kedua:</strong> {data.secondParty.name} —{" "}
                    {data.secondParty.address}
                  </p>
                  <Button variant="link" className="px-0" onClick={() => setStep(1)}>
                    Edit bagian ini
                  </Button>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="objek">
                <AccordionTrigger>Objek dan waktu</AccordionTrigger>
                <AccordionContent>
                  <p>{data.subject}</p>
                  <p className="text-muted-foreground">
                    {data.startDate}
                    {data.endDate ? ` — ${data.endDate}` : ""} ·{" "}
                    {data.location || "Lokasi belum diisi"}
                  </p>
                  <Button variant="link" className="px-0" onClick={() => setStep(3)}>
                    Edit bagian ini
                  </Button>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="kronologi">
                <AccordionTrigger>Kronologi</AccordionTrigger>
                <AccordionContent>
                  <p className="whitespace-pre-wrap">{data.chronology}</p>
                  <Button variant="link" className="px-0" onClick={() => setStep(4)}>
                    Edit bagian ini
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => setPreview((current) => !current)}
            >
              <Eye />
              {preview ? "Tutup Preview" : "Lihat Preview"}
            </Button>
            {preview && (
              <div className="mt-5 max-h-[600px] overflow-auto bg-muted p-3">
                <DocumentPreview template={template} data={data} />
              </div>
            )}
            <Button
              size="lg"
              className="mt-6 w-full"
              disabled={generating}
              onClick={() => onGenerate(data, baseContent)}
            >
              <WandSparkles />
              {generating ? "AI sedang generate dokumen..." : "Generate dengan AI"}
            </Button>
            {generating && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Sekitar 10 detik. Mohon jangan tutup halaman ini.
              </p>
            )}
          </div>
        )}
        <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t pt-5 sm:flex-row">
          <Button variant="outline" disabled={saving} onClick={() => onSave(data, step)}>
            <Save />
            {saving ? "Menyimpan..." : "Simpan Draft"}
          </Button>
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="ghost" onClick={() => setStep((current) => current - 1)}>
                <ChevronLeft />
                Kembali
              </Button>
            )}
            {step < 5 && (
              <Button onClick={next}>
                Selanjutnya
                <ChevronRight />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
