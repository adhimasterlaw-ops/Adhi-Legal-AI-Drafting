# Tahap 7 — Riset Hukum dengan Semantic Search

## Tujuan

Membangun halaman `/dashboard/research` untuk mencari peraturan dan yurisprudensi berdasarkan makna, bukan sekadar kecocokan kata. Versi awal menggunakan korpus contoh terkurasi yang jelas ditandai sebagai data demo. Alamat lama `/dashboard/riset-hukum` akan diarahkan ke halaman baru.

## Pengalaman pengguna

- Search bar besar dengan pencarian suara jika browser mendukung, tombol hapus, quick searches, loading skeleton, dan pesan gangguan/rate limit yang jelas.
- Filter jenis dokumen multi-pilih, kategori, rentang/preset tahun, status, badge filter aktif, reset, pengurutan, serta tampilan grid/list.
- Hasil responsif dengan snippet dan sorotan istilah relevan, metadata, pagination, bookmark, serta prefetch detail saat pengguna menunjuk hasil.
- Detail dokumen dalam modal lebar: metadata, naskah per pasal, daftar isi sticky dengan navigasi, aksi salin/bagikan/bookmark pasal, dokumen terkait, PDF, dan sitasi APA/MLA/Chicago/Bluebook.
- Saved searches dan alerts tersimpan privat per akun. Alert dapat diaktifkan/nonaktifkan dan dikelola sekarang; pengiriman email otomatis belum diaktifkan sampai sumber data rutin tersedia.

## Data dan keamanan

- Tambahkan tabel publik read-only untuk dokumen hukum dan potongan teks/embedding, serta tabel privat untuk bookmark, saved searches, dan alerts.
- Terapkan grant eksplisit, RLS, validasi, indeks, dan fungsi pencarian vector yang tetap menghormati akses baca.
- Sertakan sejumlah dokumen demo terkurasi beserta label/sumbernya agar pengalaman awal dapat diuji tanpa mengklaim korpus resmi lengkap.
- Semua operasi akun berjalan melalui fungsi server terautentikasi; kunci AI dan pembuatan embedding hanya berada di server.

## Implementasi teknis

- Gunakan model embedding default `google/gemini-embedding-2` melalui Lovable AI Gateway, dengan cache React Query dan debounce 300 ms.
- Pecah dokumen menjadi bagian pasal, cari kandidat dengan vector similarity, lalu bentuk snippet relevan dan rekomendasi terkait tanpa mengarang isi hukum.
- Gunakan search params tervalidasi untuk query, filter, sort, view, dan halaman agar pencarian dapat dibagikan serta dipulihkan saat refresh.
- Tambahkan komponen terpisah untuk search bar, filter bar, kartu/list hasil, modal detail, generator sitasi, saved searches, dan alerts.
- Pertahankan sistem visual navy/gold dan pola dashboard yang sudah ada, termasuk dukungan mobile dan reduced motion.

## Verifikasi

- Uji migrasi/linter, build, dan metadata halaman.
- Uji end-to-end sebagai pengguna login: quick search, semantic query, filter, sort, pagination, grid/list, detail/TOC, salin, PDF, sitasi, bookmark, saved search, serta pengelolaan alert.
- Pastikan data privat tidak terlihat lintas akun dan keadaan kosong/error tampil dengan benar.

## Batas Tahap 7

- Korpus produksi dari sumber resmi dan email alert terjadwal tidak termasuk sekarang; keduanya menunggu integrasi sumber hukum yang terus diperbarui.
- Dashboard analitik admin dan ekspor langsung ke EndNote/Mendeley tidak dibuat pada tahap ini; sitasi tetap dapat disalin.
