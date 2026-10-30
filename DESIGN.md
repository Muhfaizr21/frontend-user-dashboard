# DESIGN.md: Direktori Personel & Organisasi

## Design Read
Reading this as: aplikasi web direktori personel dan struktur organisasi for tim operasional internal & reviewer teknis, in a Swiss Archival Ledger style, dial ENERGY 2 / RHYTHM 2 / MOTION 1.

## 1. Identitas & Karakter Visual
- **Nama Gaya:** Swiss Archival Ledger (Buku Besar Arsip Organisasi).
- **Kepribadian:** Presisi, jujur terhadap data, terstruktur seperti indeks arsip cetak, tanpa dekorasi kosmetik yang tidak memiliki fungsi informasi.
- **Dials:**
  - `ENERGY: 2` (Kontras tajam antara tipografi serif editorial pada judul dan tabel data berbatas garis 1px yang tegas).
  - `RHYTHM: 2` (Komposisi bervariasi secara fungsional: bar kontrol padat di atas, grid kartu 2-kolom atau tabel di tengah, dan panel navigasi halaman di bawah).
  - `MOTION: 1` (Hanya transisi hover dan fokus yang fungsional; tidak ada animasi berulang tanpa henti dan mematuhi `prefers-reduced-motion`).

## 2. Alasan Keputusan Visual (R-31 One-Line Reasons)
- **Palet Warna:** Kertas arsip hangat (`#F9F8F5`) dan tinta karbon (`#111315`) mengurangi silau layar saat membaca tabel data, dipadukan satu aksen terakota tua (`#9A3412`) khusus untuk penanda fokus dan filter aktif (rasio kontras >= 6.88:1, lulus WCAG AA).
- **Tipografi:** `Instrument Serif` memberikan karakter manusiawi pada nama personel dan judul halaman, `Plus Jakarta Sans` menjaga keterbacaan label antarmuka, dan `JetBrains Mono` menyelaraskan karakter email, ID numerik, serta koordinat geografis.
- **Layout 2-Kolom Grid & Tabel:** Menampilkan 2 kartu per baris pada layar >= 480px agar informasi perusahaan dan kontak langsung terbaca berdampingan tanpa perlu membuka modal terlebih dahulu, dan turun ke 1 kolom pada ponsel sempit (< 480px) demi mencegah teks terpotong.
- **Penggunaan Kartu & Tabel:** Kartu dipakai untuk membaca ringkasan mandat organisasi secara menyeluruh, sedangkan mode tabel dipakai untuk membandingkan dan mengurutkan kolom (`ASC`/`DESC`) secara cepat.
- **Ikon:** Hanya menggunakan ikon penunjuk fungsi nyata (pencarian, surat/email, telepon, lokasi peta, urutan kolom) dengan `aria-hidden="true"`, tanpa ikon kosmetik seperti bintang atau kilauan.

