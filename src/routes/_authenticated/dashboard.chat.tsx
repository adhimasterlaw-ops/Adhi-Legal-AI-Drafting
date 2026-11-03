import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Send,
  Plus,
  Scale,
  Paperclip,
  X,
  Bot,
  User,
  BookOpen,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/dashboard/chat")({
  head: () => ({
    meta: [
      { title: "Asisten Riset Hukum — LegalAI Indonesia" },
      {
        name: "description",
        content: "Asisten riset hukum AI profesional dengan analisis normatif dan sitasi formal.",
      },
      { property: "og:title", content: "Asisten Riset Hukum — LegalAI Indonesia" },
      { property: "og:description", content: "Riset hukum berbasis dokumen regulasi dan yurisprudensi Indonesia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfessionalLegalChatPage,
});

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  attachment?: string;
  createdAt: string;
};

const samplePrompts = [
  "Bagaimana prosedur pemutusan hubungan kerja (PHK) menurut UU Cipta Kerja?",
  "Apa syarat sah pendirian PT perorangan di Indonesia?",
  "Bagaimana klausul force majeure dalam kontrak komersial menurut KUHPerdata?",
  "Jelaskan hak-hak pekerja kontrak (PKWT) berdasarkan regulasi ketenagakerjaan.",
];

function ProfessionalLegalChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  function handleSend(textToSend?: string) {
    const query = (textToSend ?? input).trim();
    if (!query && !attachment) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: query || `Melampirkan dokumen: ${attachment?.name}`,
      attachment: attachment ? attachment.name : undefined,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachment(null);
    setLoading(true);

    setTimeout(() => {
      let responseContent = "";
      const lower = query.toLowerCase();

      if (lower.includes("phk") || lower.includes("cipta kerja") || lower.includes("pekerja")) {
        responseContent = `## Ringkasan
Pemutusan Hubungan Kerja (PHK) diatur secara ketat untuk mencegah tindakan sepihak dan menjamin hak-hak normatif pekerja/buruh [Sumber 1].

## Dasar Hukum
- UU No. 6 Tahun 2023 tentang Penetapan Perppu Cipta Kerja menjadi Undang-Undang Pasal 151 [Sumber 1].
- PP No. 35 Tahun 2021 Pasal 37 tentang Perjanjian Kerja Waktu Tertentu, Alih Daya, Waktu Kerja dan Waktu Istirahat, dan Pemutusan Hubungan Kerja [Sumber 2].

## Penjelasan
Pengusaha, pekerja/buruh, Serikat Pekerja/Serikat Buruh, dan pemerintah harus segala upaya untuk menghindari terjadinya PHK. Dalam hal PHK tidak dapat dihindari, maksud dan alasan PHK wajib diberitahukan oleh pengusaha kepada pekerja/buruh secara tertulis [UU 6/2023 Pasal 151 ayat (2)]. Apabila pekerja/buruh telah diberitahu dan tidak menolak, PHK dapat dilakukan sesuai dengan mekanisme hukum yang berlaku.

## Poin Penting
- Kewajiban perundingan bipartit antara pengusaha dan pekerja/buruh.
- Kewajiban pembayaran hak akibat PHK berupa uang pesangon, uang penghargaan masa kerja, dan uang penggantian hak [PP 35/2021 Pasal 40].
- Larangan melakukan PHK dengan alasan tertentu seperti pekerja berhalangan masuk kerja karena sakit menurut keterangan dokter selama tidak melampaui 12 bulan terus-menerus.

## Sumber
1. Undang-Undang Nomor 6 Tahun 2023 tentang Penetapan Perppu Cipta Kerja menjadi Undang-Undang.
2. Peraturan Pemerintah Nomor 35 Tahun 2021.`;
      } else if (lower.includes("pt") || lower.includes("pendirian") || lower.includes("perseroan")) {
        responseContent = `## Ringkasan
Pendirian Perseroan Terbatas (PT) di Indonesia kini dipermudah melalui pembentukan PT Perorangan bagi usaha mikro dan kecil [Sumber 1].

## Dasar Hukum
- Undang-Undang Nomor 40 Tahun 2007 tentang Perseroan Terbatas Pasal 7 [Sumber 1].
- Undang-Undang Nomor 6 Tahun 2023 (UU Cipta Kerja) [Sumber 2].

## Penjelasan
Perseroan terbatas didirikan oleh 2 (dua) orang atau lebih dengan akta notaris yang dibuat dalam bahasa Indonesia. Namun, berdasarkan ketentuan UU Cipta Kerja, perseroan untuk usaha mikro dan kecil dapat didirikan oleh 1 (satu) orang saja dengan keputusan pendirian yang didaftarkan secara elektronik tanpa memerlukan akta notaris [UU 40/2007 jo. UU 6/2023 Pasal 7 ayat (5)].

## Poin Penting
- Tanggung jawab pemegang saham PT Perorangan terbatas pada modal disetor.
- Pembuatan status badan hukum dilakukan secara elektronik melalui Kementerian Hukum dan HAM.
- Wajib memenuhi kriteria modal usaha mikro dan kecil sesuai peraturan perundang-undangan.

## Sumber
1. Undang-Undang Nomor 40 Tahun 2007 tentang Perseroan Terbatas.
2. Undang-Undang Nomor 6 Tahun 2023 tentang Penetapan Perppu Cipta Kerja menjadi Undang-Undang.`;
      } else if (lower.includes("force majeure") || lower.includes("keadaan memaksa")) {
        responseContent = `## Ringkasan
Klausul Keadaan Memaksa (*Force Majeure*) memberikan pembebasan dari tuntutan ganti rugi apabila debitur terhalang melaksanakan prestasi akibat peristiwa di luar kekuasaannya [Sumber 1].

## Dasar Hukum
- Kitab Undang-Undang Hukum Perdata (KUHPerdata) Pasal 1244 [Sumber 1].
- Kitab Undang-Undang Hukum Perdata (KUHPerdata) Pasal 1245 [Sumber 2].

## Penjelasan
Debitur harus dihukum untuk membayar ganti rugi, apabila ia tidak dapat membuktikan bahwa hal tidak dilaksanakan perikatan itu disebabkan oleh suatu hal yang tak tak terduga, pun tak dapat dipersalahkan kepadanya, walaupun tidak ada itikad buruk padanya [KUHPerdata Pasal 1244]. Keadaan memaksa terjadi jika karena keadaan tersebut debitur terhalang memberikan atau berbuat sesuatu yang diwajibkan, atau melakukan perbuatan yang terlarang [KUHPerdata Pasal 1245].

## Poin Penting
- Beban pembuktian berada di pihak debitur yang menyatakan terjadinya *force majeure*.
- Peristiwa harus bersifat di luar kendali (*beyond control*), tidak terduga, dan tidak dapat dielakkan.
- Pengaturan kontraktual wajib merinci jenis kejadian yang dikategorikan sebagai keadaan memaksa.

## Sumber
1. Kitab Undang-Undang Hukum Perdata (KUHPerdata), Buku III tentang Perikatan.`;
      } else {
        responseContent = `## Ringkasan
Berdasarkan analisis yuridis terhadap pertanyaan "${query}", ketentuan hukum positif Indonesia mengatur prinsip-prinsip normatif yang berlaku umum bagi para subjek hukum [Sumber 1].

## Dasar Hukum
- Ketentuan Umum Peraturan Perundang-undangan yang berlaku [Sumber 1].

## Penjelasan
Kajian normatif menunjukkan bahwa penerapan hukum mengedepankan asas legalitas, kepastian hukum, dan keadilan substantif. Setiap tindakan hukum wajib berpijak pada kewenangan atributif atau delegatif yang sah menurut hukum administrasi dan keperdataan.

## Poin Penting
- Kepatuhan terhadap asas pacta sunt servanda dalam hubungan perikatan.
- Harmonisasi ketentuan hukum formil dan materiil.

## Sumber
1. Dokumen sumber regulasi nasional yang tersedia.

Apakah yang Anda maksud adalah aspek keperdataan atau aspek hukum administratif?`;
      }

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: responseContent,
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 800);
  }

  const hasStarted = messages.length > 0;

  return (
    <div className="relative mx-auto flex h-[calc(100vh-5rem)] max-w-5xl flex-col px-4 py-4 sm:px-6">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.docx,.txt"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setAttachment(file);
            toast.success(`File ${file.name} dilampirkan.`);
          }
        }}
      />

      {!hasStarted ? (
        <div className="my-auto flex flex-col items-center justify-center text-center">
          <div className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary shadow-sm">
            <Scale size={32} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-extrabold sm:text-3xl">Asisten Riset Hukum AI</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Konsultasikan analisis normatif, peraturan perundang-undangan, dan yurisprudensi Indonesia secara akademis dan objektif.
          </p>

          {/* Centered Chatbox on Landing */}
          <div className="mt-8 w-full max-w-2xl rounded-xl border border-border bg-card p-3 shadow-lg">
            {attachment && (
              <div className="mb-3 flex items-center justify-between rounded bg-muted px-3 py-1.5 text-xs">
                <span className="flex items-center gap-2 truncate font-medium">
                  <Paperclip size={14} className="text-primary" />
                  {attachment.name}
                </span>
                <button
                  onClick={() => setAttachment(null)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Lampirkan file"
                title="Lampirkan file dokumen"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 rounded-lg"
              >
                <Plus size={18} />
              </Button>
              <Textarea
                rows={1}
                className="min-h-[40px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
                placeholder="Ajukan pertanyaan riset hukum atau ketik /..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                size="icon"
                aria-label="Kirim pertanyaan"
                onClick={() => handleSend()}
                disabled={!input.trim() && !attachment}
                className="shrink-0 rounded-lg"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>

          <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-2">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="rounded-lg border border-border bg-card p-3 text-left text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pb-28 pt-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "ai" && (
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Bot size={18} />
                  </span>
                )}
                <div
                  className={`max-w-[85%] rounded-lg p-4 text-sm sm:max-w-2xl ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card"
                  }`}
                >
                  {m.attachment && (
                    <div className="mb-2 flex items-center gap-2 rounded bg-black/10 px-2.5 py-1 text-xs font-medium">
                      <Paperclip size={13} />
                      {m.attachment}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed space-y-2">{m.text}</div>
                  <span className="mt-3 block text-right text-[10px] opacity-70">{m.createdAt}</span>
                </div>
                {m.sender === "user" && (
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground font-bold">
                    <User size={16} />
                  </span>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Bot size={18} />
                </span>
                <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                  <span className="animate-pulse">Melakukan analisis normatif dan verifikasi dokumen sumber...</span>
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
            <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-3 shadow-lg">
              {attachment && (
                <div className="mb-3 flex items-center justify-between rounded bg-muted px-3 py-1.5 text-xs">
                  <span className="flex items-center gap-2 truncate font-medium">
                    <Paperclip size={14} className="text-primary" />
                    {attachment.name}
                  </span>
                  <button
                    onClick={() => setAttachment(null)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Lampirkan file"
                  title="Lampirkan file dokumen"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 rounded-lg"
                >
                  <Plus size={18} />
                </Button>
                <Textarea
                  rows={1}
                  className="min-h-[40px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
                  placeholder="Ketik konsultasi atau riset hukum..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button
                  size="icon"
                  aria-label="Kirim pertanyaan"
                  onClick={() => handleSend()}
                  disabled={!input.trim() && !attachment}
                  className="shrink-0 rounded-lg"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
