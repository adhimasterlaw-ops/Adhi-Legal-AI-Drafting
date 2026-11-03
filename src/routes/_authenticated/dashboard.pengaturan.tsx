import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  User,
  CreditCard,
  Shield,
  Sliders,
  Receipt,
  Bell,
  Camera,
  Smartphone,
  Moon,
  Globe,
  Download,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PasswordStrength } from "@/components/auth/PasswordStrength";

type Tab = "profil" | "subscription" | "keamanan" | "preferensi" | "billing" | "notifications";

export function SettingsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("profil");

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Pengaturan Akun</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola profil, langganan, keamanan, dan preferensi sistem Anda.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="space-y-1">
          {[
            { id: "profil" as Tab, label: "Profil", icon: User },
            { id: "subscription" as Tab, label: "Subscription", icon: CreditCard },
            { id: "keamanan" as Tab, label: "Keamanan", icon: Shield },
            { id: "preferensi" as Tab, label: "Preferensi", icon: Sliders },
            { id: "billing" as Tab, label: "Billing", icon: Receipt },
            { id: "notifications" as Tab, label: "Notifications", icon: Bell },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                tab === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </aside>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          {tab === "profil" && <ProfileForm user={user} />}
          {tab === "subscription" && <SubscriptionTab />}
          {tab === "keamanan" && <SecurityTab />}
          {tab === "preferensi" && <PreferencesTab />}
          {tab === "billing" && <BillingTab />}
          {tab === "notifications" && <NotificationsTab />}
        </div>
      </div>
    </section>
  );
}

function ProfileForm({ user }: { user: any }) {
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name ?? "Advokat Adhi");
  const [phone, setPhone] = useState("+62 812-3456-7890");
  const [profession, setProfession] = useState("Advokat / Konsultan Hukum");
  const [institution, setInstitution] = useState("Kantor Hukum Nusantara");
  const [bio, setBio] = useState("Spesialis Hukum Perdata, Korporasi, dan Penyelesaian Sengketa.");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Profil berhasil diperbarui.");
    }, 600);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold">Informasi Profil</h2>
        <p className="text-sm text-muted-foreground">Perbarui data diri dan informasi profesional Anda.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative grid size-20 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground font-bold text-xl">
          {fullName.charAt(0)}
          <button
            type="button"
            aria-label="Ganti Avatar"
            title="Ganti Avatar"
            onClick={() => toast.info("Fitur unggah avatar segera hadir.")}
            className="absolute bottom-0 right-0 grid size-7 place-items-center rounded-full bg-primary text-primary-foreground shadow"
          >
            <Camera size={13} />
          </button>
        </div>
        <div>
          <p className="font-semibold">{fullName}</p>
          <p className="text-xs text-muted-foreground">{user?.email ?? "adhi.masterlaw@gmail.com"}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Lengkap</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <div className="flex gap-2">
            <Input value={user?.email ?? "adhi.masterlaw@gmail.com"} readOnly className="bg-muted" />
            <Button type="button" variant="outline" onClick={() => toast.info("Hubungi dukungan untuk mengganti email.")}>
              Ganti
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">No. HP</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Profesi</label>
          <Select value={profession} onValueChange={setProfession}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Advokat / Konsultan Hukum">Advokat / Konsultan Hukum</SelectItem>
              <SelectItem value="Inhouse Counsel">Inhouse Counsel</SelectItem>
              <SelectItem value="Notaris / PPAT">Notaris / PPAT</SelectItem>
              <SelectItem value="Mahasiswa Hukum">Mahasiswa Hukum</SelectItem>
              <SelectItem value="Lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Instansi / Kantor Hukum</label>
        <Input value={institution} onChange={(e) => setInstitution(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Bio Singkat</label>
        <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
}

function SubscriptionTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold">Langganan Anda</h2>
        <p className="text-sm text-muted-foreground">Kelola paket langganan dan kuota pemakaian AI.</p>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold">Pro Legal Plan</span>
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                Active
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Pembaharuan otomatis berikutnya pada 18 November 2026</p>
          </div>
          <Button variant="outline" onClick={() => toast.info("Paket Anda sudah merupakan paket Pro.")}>
            Kelola Langganan
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-md bg-card p-3 border border-border">
            <p className="text-xs text-muted-foreground">Chat AI Bulan Ini</p>
            <p className="mt-1 font-display text-lg font-bold">234 / 300</p>
            <Progress className="mt-2" value={78} />
          </div>
          <div className="rounded-md bg-card p-3 border border-border">
            <p className="text-xs text-muted-foreground">Analisis Kontrak</p>
            <p className="mt-1 font-display text-lg font-bold">12 / 50</p>
            <Progress className="mt-2" value={24} />
          </div>
          <div className="rounded-md bg-card p-3 border border-border">
            <p className="text-xs text-muted-foreground">Storage Cloud</p>
            <p className="mt-1 font-display text-lg font-bold">245 MB / 1 GB</p>
            <Progress className="mt-2" value={24} />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-display font-bold">Pilihan Paket Lainnya</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border p-5 bg-card">
            <h4 className="font-display font-bold">Enterprise</h4>
            <p className="mt-1 text-xs text-muted-foreground">Untuk firma hukum besar dengan kolaborasi tim tak terbatas.</p>
            <p className="mt-4 font-display text-2xl font-bold">Rp 749rb <span className="text-xs font-normal text-muted-foreground">/ bulan</span></p>
            <Button className="mt-5 w-full" variant="outline" onClick={() => toast.success("Permintaan upgrade Enterprise dikirim.")}>
              Upgrade ke Enterprise
            </Button>
          </div>
          <div className="rounded-lg border border-border p-5 bg-card">
            <h4 className="font-display font-bold">Free</h4>
            <p className="mt-1 text-xs text-muted-foreground">Paket dasar untuk eksplorasi fitur hukum.</p>
            <p className="mt-4 font-display text-2xl font-bold">Rp 0</p>
            <Button className="mt-5 w-full" variant="ghost" disabled>
              Paket Dasar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [tfa, setTfa] = useState(false);

  function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast.error("Konfirmasi password baru tidak sesuai.");
      return;
    }
    toast.success("Password berhasil diperbarui.");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handlePasswordUpdate} className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold">Ganti Password</h2>
          <p className="text-sm text-muted-foreground">Pastikan akun Anda menggunakan password yang kuat.</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password Saat Ini</label>
          <Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password Baru</label>
          <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} required />
          <PasswordStrength password={newPw} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Konfirmasi Password Baru</label>
          <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required />
        </div>
        <Button type="submit">Update Password</Button>
      </form>

      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold">Autentikasi Dua Faktor (2FA)</h3>
            <p className="text-xs text-muted-foreground">Tambahkan lapisan keamanan ekstra dengan aplikasi authenticator.</p>
          </div>
          <Switch checked={tfa} onCheckedChange={(val) => { setTfa(val); toast.success(val ? "2FA diaktifkan." : "2FA dinonaktifkan."); }} />
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold">Sesi Aktif</h3>
            <p className="text-xs text-muted-foreground">Perangkat yang saat ini masuk ke akun Anda.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("Semua sesi lain berhasil dikeluarkan.")}>
            Logout dari Semua Device
          </Button>
        </div>
        <div className="rounded-md border border-border divide-y divide-border text-sm">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <Smartphone className="text-primary" size={20} />
              <div>
                <p className="font-medium">Chrome di macOS</p>
                <p className="text-xs text-muted-foreground">Jakarta, Indonesia · Aktif sekarang</p>
              </div>
            </div>
            <Badge variant="secondary">Sesi Ini</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreferencesTab() {
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState("id");
  const [emailNotif, setEmailNotif] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold">Preferensi Sistem</h2>
        <p className="text-sm text-muted-foreground">Sesuaikan tampilan dan pengaturan privasi Anda.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <Moon size={18} className="text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Mode Gelap</p>
              <p className="text-xs text-muted-foreground">Gunakan tema gelap antarmuka</p>
            </div>
          </div>
          <Switch checked={darkMode} onCheckedChange={(val) => { setDarkMode(val); toast.success("Tema diperbarui."); }} />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-border">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Bahasa</p>
              <p className="text-xs text-muted-foreground">Pilih bahasa tampilan aplikasi</p>
            </div>
          </div>
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Indonesia</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-border">
          <div>
            <p className="font-medium text-sm">Notifikasi Email</p>
            <p className="text-xs text-muted-foreground">Terima ringkasan aktivitas hukum via email</p>
          </div>
          <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-border">
          <div>
            <p className="font-medium text-sm">Pelacakan Analitik</p>
            <p className="text-xs text-muted-foreground">Bantu tingkatkan kualitas layanan</p>
          </div>
          <Switch checked={analytics} onCheckedChange={setAnalytics} />
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="font-display font-bold">Data dan Akun</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => toast.success("Arsip data Anda sedang disiapkan untuk diunduh.")}>
            <Download />
            Ekspor Data Saya (ZIP)
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 />
                Hapus Akun
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini permanen dan akan menghapus seluruh dokumen, analisis, dan riwayat obrolan Anda dari server.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => toast.error("Fitur penghapusan akun memerlukan konfirmasi email.")} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Hapus Permanen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold">Riwayat Pembayaran & Billing</h2>
        <p className="text-sm text-muted-foreground">Lihat dan unduh faktur langganan Anda.</p>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-3">No. Invoice</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Paket</th>
              <th className="p-3">Jumlah</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-3 font-mono text-xs">INV-2026-1018</td>
              <td className="p-3">18 Okt 2026</td>
              <td className="p-3">Pro Legal Plan (Bulanan)</td>
              <td className="p-3">Rp 299.000</td>
              <td className="p-3"><Badge variant="secondary">Lunas</Badge></td>
              <td className="p-3 text-right">
                <Button variant="ghost" size="sm" onClick={() => toast.success("Faktur diunduh.")}>
                  Unduh PDF
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [n1, setN1] = useState(true);
  const [n2, setN2] = useState(true);
  const [n3, setN3] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold">Pengaturan Notifikasi</h2>
        <p className="text-sm text-muted-foreground">Pilih pemberitahuan apa saja yang ingin Anda terima.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-medium text-sm">Pembaruan Dokumen & Analisis</p>
            <p className="text-xs text-muted-foreground">Notifikasi saat analisis kontrak atau draf selesai.</p>
          </div>
          <Switch checked={n1} onCheckedChange={setN1} />
        </div>
        <div className="flex items-center justify-between py-2 border-t border-border">
          <div>
            <p className="font-medium text-sm">Peringatan Kuota AI</p>
            <p className="text-xs text-muted-foreground">Peringatan saat kuota pemakaian mencapai 80%.</p>
          </div>
          <Switch checked={n2} onCheckedChange={setN2} />
        </div>
        <div className="flex items-center justify-between py-2 border-t border-border">
          <div>
            <p className="font-medium text-sm">Buletin & Riset Hukum Terbaru</p>
            <p className="text-xs text-muted-foreground">Informasi putusan MA terbaru dan regulasi baru.</p>
          </div>
          <Switch checked={n3} onCheckedChange={setN3} />
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/pengaturan")({
  head: () => ({
    meta: [
      { title: "Pengaturan & Profil — LegalAI Indonesia" },
      { name: "description", content: "Kelola profil, langganan, dan keamanan akun Anda." },
      { property: "og:title", content: "Pengaturan & Profil — LegalAI Indonesia" },
      { property: "og:description", content: "Kelola profil, langganan, dan keamanan akun Anda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});
