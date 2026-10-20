import { useRouter, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
export function LibraryError({ error }: { error: Error }) {
  const router = useRouter();
  return (
    <div role="alert" className="mx-auto max-w-lg space-y-4 p-8">
      <h1 className="font-display text-xl font-bold">Koleksi belum dapat dibuka</h1>
      <p className="text-sm text-muted-foreground">
        {error.message === "Unauthorized"
          ? "Sesi Anda berakhir. Silakan masuk kembali."
          : error.message}
      </p>
      <Button onClick={() => void router.invalidate()}>Coba lagi</Button>
      <Button asChild variant="outline">
        <Link to="/login">Masuk kembali</Link>
      </Button>
    </div>
  );
}
export function LibraryNotFound() {
  return (
    <p role="alert" className="p-8">
      Dokumen atau folder tidak ditemukan.
    </p>
  );
}
