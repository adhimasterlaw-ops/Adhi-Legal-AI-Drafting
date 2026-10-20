import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createFolder,
  renameFolder,
  deleteFolder,
  renameLibraryDocument,
  moveLibraryDocuments,
  deleteLibraryDocuments,
  tagLibraryDocuments,
} from "@/lib/document-library.functions";
import { Choice, type LibraryAction } from "./LibraryControls";
import { folderTrail } from "./library-utils";
import type { DocumentFolder } from "./types";
const titles = {
  create: "Buat folder",
  rename: "Ganti nama dokumen",
  move: "Pindah ke folder",
  delete: "Hapus dokumen permanen?",
  tag: "Tambah tag",
  renameFolder: "Ganti nama folder",
  deleteFolder: "Hapus folder?",
};
export function LibraryDialogs({
  action,
  folders,
  parentId,
  onClose,
  onSuccess,
}: {
  action: LibraryAction;
  folders: DocumentFolder[];
  parentId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [value, setValue] = useState(action.name ?? "");
  const [folder, setFolder] = useState("root");
  const [pending, setPending] = useState(false);
  const create = useServerFn(createFolder),
    renameF = useServerFn(renameFolder),
    deleteF = useServerFn(deleteFolder),
    renameD = useServerFn(renameLibraryDocument),
    move = useServerFn(moveLibraryDocuments),
    remove = useServerFn(deleteLibraryDocuments),
    tag = useServerFn(tagLibraryDocuments);
  const client = useQueryClient();
  const deleting = action.kind === "delete" || action.kind === "deleteFolder";
  async function submit() {
    setPending(true);
    try {
      const id = action.ids[0];
      switch (action.kind) {
        case "create":
          await create({ data: { name: value.trim(), parentId } });
          break;
        case "renameFolder":
          if (!id) return;
          await renameF({ data: { id, name: value.trim() } });
          break;
        case "deleteFolder":
          if (!id) return;
          await deleteF({ data: { id } });
          break;
        case "rename":
          if (!id) return;
          await renameD({ data: { id, name: value.trim() } });
          break;
        case "move":
          await move({ data: { ids: action.ids, folderId: folder === "root" ? null : folder } });
          break;
        case "delete":
          await remove({ data: { ids: action.ids } });
          break;
        case "tag":
          await tag({ data: { ids: action.ids, tag: value.trim() } });
          break;
      }
      await client.invalidateQueries({ queryKey: ["document-library"] });
      await client.invalidateQueries({ queryKey: ["document-detail"] });
      toast.success("Perubahan berhasil disimpan.");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Perubahan gagal disimpan.");
    } finally {
      setPending(false);
    }
  }
  return (
    <Dialog open onOpenChange={(open) => !open && !pending && onClose()}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{titles[action.kind]}</DialogTitle>
          <DialogDescription>
            {action.kind === "delete"
              ? `${action.ids.length} dokumen beserta sumber drafting/analisis dan file privatnya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`
              : action.kind === "deleteFolder"
                ? "Dokumen dan subfolder dipindahkan ke Dokumen Saya (root). Tidak ada dokumen yang dihapus."
                : action.kind === "move"
                  ? `${action.ids.length} dokumen akan dipindahkan ke folder pilihan.`
                  : "Simpan perubahan pada koleksi pribadi Anda."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
          className="space-y-4"
        >
          {action.kind === "move" ? (
            <Choice
              label="Folder tujuan"
              value={folder}
              onChange={setFolder}
              options={[
                { value: "root", label: "Dokumen Saya (root)" },
                ...folders.map((f) => ({
                  value: f.id,
                  label: folderTrail(folders, f.id)
                    .map((p) => p.name)
                    .join(" / "),
                })),
              ]}
            />
          ) : (
            !deleting && (
              <Input
                autoFocus
                aria-label={action.kind === "tag" ? "Nama tag" : "Nama"}
                placeholder={action.kind === "tag" ? "Nama tag" : "Nama"}
                value={value}
                maxLength={action.kind === "tag" ? 40 : action.kind === "rename" ? 255 : 100}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            )
          )}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={pending} onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              variant={action.kind === "delete" ? "destructive" : "default"}
              disabled={pending || (!deleting && action.kind !== "move" && !value.trim())}
            >
              {pending
                ? "Menyimpan..."
                : action.kind === "deleteFolder"
                  ? "Pindahkan ke root & hapus folder"
                  : deleting
                    ? "Hapus permanen"
                    : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
