import type { DocumentTemplate } from "./types";

const sharedVariables = [
  { name: "nama_pihak_1", label: "Nama Pihak Pertama", type: "text" as const, required: true },
  { name: "nama_pihak_2", label: "Nama Pihak Kedua", type: "text" as const, required: true },
  { name: "objek", label: "Objek atau Perihal", type: "textarea" as const, required: true },
  { name: "kronologi", label: "Kronologi", type: "textarea" as const, required: true },
];

export const documentTemplates: DocumentTemplate[] = [
  {
    id: "a0000000-0000-4000-8000-000000000001",
    name: "Somasi Pembayaran Utang",
    category: "Somasi",
    description: "Surat peringatan resmi untuk menagih pembayaran utang yang telah jatuh tempo.",
    isPremium: false,
    usageCount: 428,
    rating: 4.9,
    variablesSchema: sharedVariables,
    templateContent: `SOMASI\nNomor: {{nomor_surat}}\n\nKepada Yth.\n{{nama_pihak_2}}\n{{alamat_pihak_2}}\n\nPerihal: {{objek}}\n\nDengan hormat,\nKami bertindak untuk dan atas nama {{nama_pihak_1}}, beralamat di {{alamat_pihak_1}}. Berdasarkan hubungan hukum para pihak, terdapat kewajiban pembayaran sebesar {{jumlah_utang}} yang telah jatuh tempo.\n\nKronologi:\n{{kronologi}}\n\nMelalui surat ini, kami meminta Saudara menyelesaikan kewajiban tersebut selambat-lambatnya 7 (tujuh) hari kalender sejak surat diterima. Apabila tidak dipenuhi, klien kami berhak menempuh upaya hukum sesuai ketentuan yang berlaku.\n\n{{kota}}, {{tanggal_surat}}\nHormat kami,\n{{nama_pihak_1}}`,
  },
  {
    id: "a0000000-0000-4000-8000-000000000002",
    name: "Surat Kuasa Khusus",
    category: "Surat Kuasa",
    description: "Pemberian kuasa khusus untuk mewakili kepentingan hukum pada perkara tertentu.",
    isPremium: false,
    usageCount: 351,
    rating: 4.8,
    variablesSchema: sharedVariables,
    templateContent: `SURAT KUASA KHUSUS\n\nYang bertanda tangan di bawah ini:\n{{nama_pihak_1}}, beralamat di {{alamat_pihak_1}}, selanjutnya disebut PEMBERI KUASA.\n\nDengan ini memberikan kuasa khusus kepada:\n{{nama_pihak_2}}, beralamat di {{alamat_pihak_2}}, selanjutnya disebut PENERIMA KUASA.\n\nKHUSUS\nUntuk dan atas nama Pemberi Kuasa melakukan tindakan hukum terkait {{objek}}.\n\nRuang lingkup kuasa:\n{{kronologi}}\n\n{{kota}}, {{tanggal_surat}}\nPEMBERI KUASA                    PENERIMA KUASA`,
  },
  {
    id: "a0000000-0000-4000-8000-000000000003",
    name: "Perjanjian Kerja Sama",
    category: "Perjanjian",
    description:
      "Perjanjian kerja sama umum dengan hak, kewajiban, jangka waktu, dan penyelesaian sengketa.",
    isPremium: false,
    usageCount: 616,
    rating: 4.9,
    variablesSchema: sharedVariables,
    templateContent: `PERJANJIAN KERJA SAMA\n\nPada {{tanggal_surat}}, bertempat di {{kota}}, telah dibuat perjanjian antara:\n1. {{nama_pihak_1}}, beralamat di {{alamat_pihak_1}};\n2. {{nama_pihak_2}}, beralamat di {{alamat_pihak_2}}.\n\nPASAL 1\nOBJEK PERJANJIAN\n{{objek}}\n\nPASAL 2\nNILAI DAN PEMBAYARAN\nNilai kerja sama adalah {{jumlah_utang}}.\n\nPASAL 3\nJANGKA WAKTU\nBerlaku sejak {{tanggal_mulai}} sampai {{tanggal_berakhir}}.\n\nPASAL 4\nKETENTUAN LAIN\n{{kronologi}}`,
  },
  {
    id: "a0000000-0000-4000-8000-000000000004",
    name: "Perjanjian Sewa Menyewa",
    category: "Kontrak",
    description: "Kontrak sewa properti atau aset dengan ketentuan pembayaran dan penggunaan.",
    isPremium: true,
    usageCount: 289,
    rating: 4.7,
    variablesSchema: sharedVariables,
    templateContent: `PERJANJIAN SEWA MENYEWA\n\nPara pihak {{nama_pihak_1}} dan {{nama_pihak_2}} sepakat mengikatkan diri dalam sewa menyewa atas {{objek}} dengan nilai {{jumlah_utang}}.\n\nJangka waktu berlangsung sejak {{tanggal_mulai}} sampai {{tanggal_berakhir}}.\n\nKetentuan khusus:\n{{kronologi}}\n\nDibuat di {{kota}} pada {{tanggal_surat}}.`,
  },
  {
    id: "a0000000-0000-4000-8000-000000000005",
    name: "Gugatan Wanprestasi",
    category: "Gugatan",
    description:
      "Kerangka gugatan perdata atas cidera janji dengan posita dan petitum terstruktur.",
    isPremium: true,
    usageCount: 174,
    rating: 4.8,
    variablesSchema: sharedVariables,
    templateContent: `GUGATAN WANPRESTASI\n\nKepada Yth. Ketua Pengadilan Negeri {{kota}}\n\nPenggugat: {{nama_pihak_1}}, beralamat di {{alamat_pihak_1}}.\nTergugat: {{nama_pihak_2}}, beralamat di {{alamat_pihak_2}}.\n\nPOSITA\n{{kronologi}}\n\nObjek sengketa: {{objek}}\nNilai tuntutan: {{jumlah_utang}}\n\nPETITUM\nMemohon Majelis Hakim menyatakan Tergugat telah melakukan wanprestasi dan menghukum Tergugat memenuhi kewajibannya.`,
  },
  {
    id: "a0000000-0000-4000-8000-000000000006",
    name: "Berita Acara Kesepakatan",
    category: "Lainnya",
    description: "Catatan formal hasil pertemuan atau mediasi yang ditandatangani para pihak.",
    isPremium: false,
    usageCount: 203,
    rating: 4.7,
    variablesSchema: sharedVariables,
    templateContent: `BERITA ACARA KESEPAKATAN\n\nPada {{tanggal_surat}} di {{kota}}, {{nama_pihak_1}} dan {{nama_pihak_2}} telah membahas {{objek}}.\n\nPara pihak menerangkan dan menyepakati:\n{{kronologi}}\n\nBerita acara ini dibuat dalam keadaan sadar, tanpa paksaan, dan berlaku sejak ditandatangani.`,
  },
];
