# Tahap 6 — Drafting Dokumen Hukum

## Yang akan dibangun

- Halaman `/dashboard/drafting` dengan statistik, pencarian, kategori, dan katalog template hukum; tautan lama `/dashboard/draft-dokumen` tetap diarahkan ke halaman baru.
- Detail template dalam dialog berisi contoh, kebutuhan data, dan estimasi waktu.
- Wizard lima langkah dengan validasi data para pihak, objek/perihal, kronologi, detail tambahan, ringkasan, dan pratinjau langsung.
- Pembuatan dokumen berbantuan AI dalam bahasa hukum Indonesia, dengan pesan kegagalan yang jelas dan input tetap tersimpan.
- Hasil dokumen dengan pencarian, penyuntingan kaya-format, hitung kata/karakter, simpan otomatis, serta ekspor DOCX dan PDF.
- Penyimpanan privat per pengguna untuk draft, dokumen final, versi revisi, duplikasi, pemulihan versi, dan pustaka dokumen.

## Alur pengguna

1. Pilih atau cari template.
2. Tinjau detail lalu gunakan template.
3. Isi wizard dan simpan draft kapan pun.
4. Tinjau pratinjau lalu buat dokumen dengan AI.
5. Edit, unduh, bagikan, duplikasi, atau pulihkan versi lama.

## Detail teknis

- Data template awal disediakan melalui migrasi; dokumen dan versi memakai akses pemilik saja.
- Pemanggilan AI, prompt, dan kunci tetap di server; gunakan model default, streaming, serta korelasi permintaan gateway.
- Ekspor dibuat di browser agar file privat tidak dipublikasikan; DOCX memakai library dokumen dan PDF memakai library yang sudah tersedia.
- UI mengikuti sistem desain dashboard, responsif pada desktop dan mobile, serta memiliki metadata halaman tersendiri.

## Verifikasi

- Pastikan kompilasi bersih.
- Uji alur nyata: daftar/masuk, pilih template, isi wizard, buat dokumen AI, edit, simpan, unduh, dan baca kembali dari pustaka.
