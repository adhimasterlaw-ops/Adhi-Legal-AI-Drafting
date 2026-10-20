# Dashboard Layout & Navigation

## Ringkasan

Membangun kerangka dashboard LegalAI Indonesia yang bersih dan responsif, menggunakan pola standar karena detail brief setelah “Struktur:” belum terkirim.

## Yang akan dibuat

- Layout dashboard bersama untuk seluruh halaman pengguna yang sudah login.
- Sidebar desktop yang dapat diciutkan menjadi deretan ikon, dengan logo dan penanda halaman aktif.
- Menu utama: Dashboard, Chat Hukum, Analisis Kontrak, Draft Dokumen, Riset Hukum, Riwayat, dan Favorit.
- Area bawah sidebar untuk Bantuan dan Pengaturan, ditambah ringkasan paket akun.
- Bilah atas dengan tombol buka/tutup sidebar, pencarian, notifikasi, dan menu profil pengguna.
- Navigasi mobile berbentuk panel geser yang dapat dibuka kembali dari bilah atas.
- Konten beranda dashboard berupa sapaan, pintasan fitur utama, statistik penggunaan, dan aktivitas terbaru sebagai tampilan tahap awal.
- Halaman tujuan sederhana untuk setiap menu agar semua navigasi aktif dan tidak menghasilkan tautan mati.
- Proses keluar yang membersihkan sesi dan kembali ke halaman login.

## Perilaku responsif

- Desktop menampilkan sidebar penuh atau mode ikon.
- Tablet dan ponsel menyembunyikan sidebar ke panel geser dengan tombol menu tetap terlihat.
- Judul, pencarian, profil, dan tombol tidak saling menimpa pada layar sempit.

## Teknis

- Menggunakan komponen sidebar dan kontrol antarmuka yang sudah tersedia.
- Layout ditempatkan pada area halaman yang terlindungi sehingga semua turunannya otomatis memakai navigasi yang sama.
- Data nama/email profil memakai sesi akun saat tersedia, dengan nilai pengganti yang aman.
- Setiap halaman baru mendapat metadata judul dan deskripsi yang unik.
