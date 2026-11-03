# Aneka POS - Toko Aneka Usaha (Pappa - Takalar)

Aplikasi Point of Sales (POS) dan manajemen inventaris modern & minimalis untuk Toko Aneka Usaha (Pappa, Takalar &bull; ATK & Percetakan Digital). Dirancang khusus untuk mempermudah transaksi kasir saat jam sibuk pagi hari dan memantau stok barang agar tidak kehabisan stok mendadak.

## Fitur Utama

1. **Sistem Login Kasir & Multi-User Shift (`<LoginScreen />`):**
   * **Akun Demo Bawaan:**
     * **Kasir 01 (Karyawan):** PIN `1234` (Role: Kasir)
     * **Bapak Hasrul (Owner Toko):** PIN `9999` (Role: Owner / Admin)
   * **Numpad Layar Sentuh & Keyboard Fisik:** Dilengkapi papan angka tablet yang ramah sentuhan, animasi titik PIN, validasi kesalahan, dan tombol ganti pengguna/logout.
   * **Struk Terverifikasi Kasir:** Setiap nota cetak mencatat nama petugas kasir yang sedang bertugas.

2. **Perpindahan Halaman Halus (*Smooth Page Transitions*):**
   * Transisi antar-halaman (Kasir, Riwayat, Inventaris) menggunakan animasi *fade-in slide* GPU-accelerated (180ms) yang mulus dan mendukung standar aksesibilitas `prefers-reduced-motion`.

3. **Pembersihan Riwayat Transaksi:**
   * Di tab **Riwayat Transaksi**, kasir atau pemilik toko dapat menekan tombol **"Bersihkan Riwayat"** untuk mengosongkan arsip penjualan dengan konfirmasi keamanan.
   * Metrik KPI omzet otomatis kembali ke Rp 0 dan menampilkan *empty state* yang rapi.

4. **Fitur Edit & Hapus Produk pada Inventaris:**
   * Tombol **"Edit"** di setiap baris tabel inventaris.
   * Modal edit lengkap untuk mengubah nama barang, kategori, harga jual, sisa stok, batas minimum restok, dan URL/file foto produk.
   * Opsi **"Hapus Barang"** dengan konfirmasi keamanan.

5. **Kasir (POS) & Cetak Nota:**
   * Katalog produk dengan foto asli toko lokal.
   * Pembayaran Tunai (kalkulator uang pas & kembalian) dan QRIS digital.
   * Struk berlogo resmi Toko Aneka Usaha (Pappa - Takalar).

6. **Dukungan Dark Mode & Tampilan Modern Minimalis:**
   * Sakelar mode terang/gelap pada bilah navigasi dengan penyimpanan preferensi di `LocalStorage`.

## Cara Menjalankan

```bash
# Menjalankan server development
npm run dev

# Membangun versi produksi
npm run build

# Menjalankan preview build produksi
npm run preview
```
