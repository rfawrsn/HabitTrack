# HabitTrack

HabitTrack adalah aplikasi Expo Go untuk mahasiswa yang ingin melacak kebiasaan harian, memantau progres, dan mendokumentasikan pencapaian dengan foto. Seluruh teks antarmuka menggunakan Bahasa Indonesia.

## Cara Menjalankan

1. Pasang dependensi:
   ```
   npm install
   ```
2. Jalankan server pengembangan:
   ```
   npx expo start
   ```
3. Di HP Android, pasang aplikasi **Expo Go** dari Play Store, lalu pindai kode QR yang muncul di terminal. HP dan komputer harus berada di jaringan Wi-Fi yang sama.

## Fitur

- **Autentikasi:** daftar dan masuk dengan nama, email, dan kata sandi. Validasi input, pencegahan email ganda, dan sesi tersimpan di perangkat.
- **Beranda:** kebiasaan hari ini, persentase penyelesaian, dan progres harian.
- **Kebiasaan:** tambah, ubah, hapus, dan tandai selesai.
- **Riwayat:** progres 30 hari terakhir dan rekor streak per kebiasaan.
- **Kamera:** ambil foto dengan pratinjau langsung, ulangi, simpan dengan keterangan dan kaitan kebiasaan, lihat galeri, dan hapus foto.
- **Profil:** data akun, statistik, dan tombol keluar.

## Pemetaan Modul

| Modul | Implementasi |
| --- | --- |
| M2 | Tata letak responsif, navigasi tab, komponen UI ulang pakai (`components/ui`), label aksesibilitas |
| M3 | `context/AuthContext.tsx`, `components/auth/AuthGate.tsx`, `services/auth/tokenStorage.ts` (SecureStore) |
| M4 | Axios di `services/http/apiClient.ts`, DTO di `types/api.ts`, layanan API di `services/api/` |
| M5 | Token Bearer dikirim lewat interseptor Axios; endpoint dilindungi di `services/mock/mockRoutes.ts` |
| M6 | Status loading, error, dan sukses; timeout 8 detik; retry GET hingga 2 kali; cache offline dan banner offline |
| M7 | `expo-camera` dengan izin, pratinjau langsung, ambil, ulangi, dan tampilan foto (`components/camera/`) |

## API Tiruan (Mock API)

Tidak ada backend nyata. Aplikasi memakai Axios dengan adaptor kustom (`services/mock/mockAdapter.ts`) yang mengarahkan setiap permintaan ke handler lokal. Permintaan tetap melewati alur HTTP sungguhan: header, JSON, kode status, dan error Axios. Data disimpan di AsyncStorage pada koleksi `habittrack:mock:<nama>`.

Kata sandi tidak pernah disimpan dalam bentuk teks biasa. Aplikasi memakai SHA-256 dengan salt acak (`expo-crypto`). Token sesi disimpan di SecureStore pada Android.

## Keputusan Penyimpanan

Pengguna meminta AsyncStorage untuk akun, kebiasaan, dan riwayat, serta SecureStore untuk token. Karena itu aplikasi ini tidak memakai basis data Supabase yang tersedia di proyek. Jika aplikasi nanti perlu data bersama antarperangkat, ganti lapisan mock dengan backend sungguhan.

## Panduan Demo

1. Daftar akun baru, lalu coba mendaftar lagi dengan email yang sama untuk melihat pesan duplikasi.
2. Tambah dua kebiasaan di tab **Kebiasaan**, lalu tandai salah satunya selesai dari **Beranda**.
3. Buka **Riwayat** untuk melihat persentase harian dan streak.
4. Buka **Kamera**, izinkan akses kamera, ambil foto, ulangi, lalu simpan dengan keterangan.
5. Buka **Galeri** di tab kamera untuk melihat dan menghapus foto.
6. Di **Profil**, tekan **Keluar** untuk menghapus sesi.
