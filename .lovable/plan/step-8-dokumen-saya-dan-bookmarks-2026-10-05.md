# Step 8 — Dokumen Saya dan Bookmarks

## Hasil yang dibangun

- Tambahkan area **Dokumen Saya** di dashboard dengan statistik, tab tipe, pencarian, filter status/folder, pengurutan, pilihan grid/list, pagination, dan pilihan banyak dokumen.
- Tambahkan pengelolaan folder bertingkat: buat, ganti nama, breadcrumb, pindahkan dokumen, dan hapus folder dengan dokumen dipindahkan ke root.
- Tambahkan detail dokumen dengan metadata, pratinjau teks yang aman, riwayat versi bila tersedia, unduh, edit bila didukung, ganti nama, pindah, dan hapus permanen dengan konfirmasi.
- Ganti halaman Favorit lama dengan **Bookmarks** untuk referensi riset hukum, lengkap dengan pencarian, filter, urutkan, buka sumber/dokumen, hapus, dan empty state.
- Integrasikan navigasi ke `/dashboard/documents` dan `/dashboard/bookmarks`; pertahankan URL lama melalui redirect agar tautan yang ada tidak rusak.

## Data dan keamanan

- Buat tabel `folders`, `documents`, dan `document_tags` dengan GRANT eksplisit serta RLS owner-only.
- Hubungkan dokumen drafting yang sudah ada ke katalog Dokumen Saya tanpa memindahkan atau menghapus data lama; metadata koleksi disimpan secara aditif agar fitur drafting tetap stabil.
- Gunakan `legal_research_bookmarks` yang sudah ada untuk bookmark riset, lalu tambahkan constraint unik per pengguna dan dokumen bila belum tersedia.
- Semua operasi membaca identitas pengguna dari sesi server, bukan dari input browser. Validasi kepemilikan dokumen/folder, cegah siklus folder, dan batasi URL/path file privat.
- Tidak menambahkan data demo ke area privat pengguna.

## Struktur halaman

- `/dashboard/documents` — daftar utama dokumen dan folder.
- `/dashboard/documents/$documentId` — detail dokumen.
- `/dashboard/documents/folder/$folderId` — isi folder dengan breadcrumb.
- `/dashboard/bookmarks` — bookmark dokumen hukum.
- Semua halaman berada di bawah perlindungan login dashboard yang sudah ada.

## Detail teknis

- Gunakan server functions terautentikasi untuk daftar, rename, move, tag, delete, folder CRUD, bulk actions, detail, dan bookmarks.
- Pertahankan `legal_documents` serta `contract_analyses` sebagai sumber asli; katalog `documents` menjadi indeks terpadu dengan referensi sumber yang nullable dan unik.
- Gunakan komponen reusable: `DocumentCard`, `DocumentList`, `DocumentFilters`, `FolderCard`, `FolderBreadcrumb`, dialog create/rename/move, `BulkActionsBar`, `BookmarkCard`, empty state, dan preview.
- Unduhan dokumen hasil drafting dibuat dari konten yang sudah dimiliki pengguna. File privat hanya memakai signed URL singkat jika path storage tersedia; format yang tidak didukung menampilkan pesan dan tombol unduh.
- Bulk download hanya ditawarkan untuk item yang dapat dibuat/diambil dengan aman; operasi move, tag, dan delete tetap tersedia untuk pilihan aktif.

## Verifikasi

- Jalankan pemeriksaan build dan pengujian terfokus.
- Uji alur login → Dokumen Saya → buat folder → pindahkan/rename/buka dokumen → bulk action → hapus folder ke root.
- Uji Bookmarks: tampil, cari/filter/urutkan, buka, dan hapus.
- Verifikasi tampilan desktop dan mobile, status loading/empty/error, serta isolasi data antar pengguna melalui RLS.
