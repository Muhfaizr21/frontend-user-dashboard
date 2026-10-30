# Frontend User Dashboard (React.js + TypeScript + TailwindCSS)

Aplikasi Single Page Application (SPA) **User Dashboard** untuk menampilkan, mencari, menyaring, mengurutkan, dan memeriksa rincian data pengguna serta organisasi dari public API (`https://jsonplaceholder.typicode.com/users`).

Project ini dibangun menggunakan **React 19**, **Vite**, **TypeScript**, dan **TailwindCSS v4** dengan menerapkan prinsip **Clean Code**, **SOLID Principles**, serta **Modular Feature-Based Architecture**. Seluruh komponen UI dibuat secara mandiri (*custom-built*) tanpa menggunakan template dashboard jadi maupun library komponen instan.

---

## Daftar Isi

1. [Ringkasan Fitur & Ketentuan Teknis](#1-ringkasan-fitur--ketentuan-teknis)
2. [Tech Stack & Tools](#2-tech-stack--tools)
3. [Cara Menjalankan Project di Lokal](#3-cara-menjalankan-project-di-lokal)
4. [Jawaban Pertanyaan Pemahaman (WAJIB)](#4-jawaban-pertanyaan-pemahaman-wajib)
   - [4.1. State Management & Lifecycle](#41-state-management--lifecycle)
   - [4.2. Struktur Folder](#42-struktur-folder)
   - [4.3. Optimasi Kinerja (Performance) untuk 10.000 Data User](#43-optimasi-kinerja-performance-untuk-10000-data-user)
5. [Penerapan Prinsip Clean Code & SOLID](#5-penerapan-prinsip-clean-code--solid)

---

## 1. Ringkasan Fitur & Ketentuan Teknis

| Fitur Wajib / Tambahan | Status | Implementasi Teknis |
| :--- | :---: | :--- |
| **Daftar Pengguna (Grid Card & Tabel)** | Selesai | Pengguna dapat beralih tampilan antara **2-Column Grid Card** (`UserGridCard.tsx`) dan **Tabel Direktori Interaktif** (`UserTable.tsx`). |
| **Fitur Pencarian Realtime (Search)** | Selesai | Pencarian langsung (*client-side*) berdasarkan **nama** atau **email** (case-insensitive), dilengkapi shortcut keyboard `/` atau `Cmd/Ctrl + K` dan filter wilayah kota domisili. |
| **Pengurutan Kolom (`ASC` / `DESC`) & Pagination** | Selesai | Mendukung pengurutan naik/turun (`ASC`/`DESC`) langsung dari klik header kolom tabel maupun *custom popover dropdown*, serta pagination dinamis (**5, 10, atau 15 data per halaman**). |
| **Modal Detail Pengguna** | Selesai | Saat pengguna diklik, muncul modal rincian (`UserDetailModal.tsx`) yang menampilkan kontak lengkap (beserta fitur *copy to clipboard*), alamat lengkap (`street`, `suite`, `city`, `zipcode`), tautan koordinat Google Maps (`lat`, `lng`), dan profil perusahaan (`name`, `catchPhrase`, `bs`). |
| **Loading & Friendly Error Handling** | Selesai | Menampilkan *Loading Skeleton* sesuai mode tampilan saat data dimuat, pesan error yang ramah pengguna saat koneksi gagal, tombol **Muat Ulang Data (Retry)**, serta tombol **Uji Error API** di header untuk simulasi kegagalan jaringan. |

---

## 2. Tech Stack & Tools

- **Core Framework:** React 19 + TypeScript (`strict: true`)
- **Build Tool:** Vite 6
- **Styling:** TailwindCSS v4 (Custom UI components tanpa template dashboard jadi, terverifikasi standar kontras WCAG AA)
- **Testing:** Vitest + React Testing Library + `@testing-library/user-event`

---

## 3. Cara Menjalankan Project di Lokal

Pastikan **Node.js** (versi 18 ke atas) telah terpasang di komputer Anda:

```bash
# 1. Clone repository
git clone https://github.com/Muhfaizr21/frontend-user-dashboard.git
cd frontend-user-dashboard

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev

# 4. Jalankan unit & integration tests
npm run test

# 5. Build untuk production
npm run build
```

---

## 4. Jawaban Pertanyaan Pemahaman (WAJIB)

### 4.1. State Management & Lifecycle

> **Pertanyaan:** *Bagaimana cara Anda melakukan fetching data di React? Jika Anda menggunakan `useEffect`, jelaskan bagaimana cara Anda mencegah terjadinya memory leak atau pemanggilan API berulang (infinite loop).*

#### A. Mekanisme Fetching Data di React
Pada project ini, seluruh logika pengambilan data (*data fetching*) dipisahkan dari komponen presentasi UI dan dienkapsulasi ke dalam custom hook [`useUsers.ts`](src/features/users/hooks/useUsers.ts). Custom hook ini mengelola tiga state utama siklus hidup komunikasi jaringan:
1. `users`: Menyimpan array data pengguna yang berhasil dimuat.
2. `isLoading`: Menyimpan status boolean ketika proses HTTP request sedang berlangsung.
3. `error`: Menyimpan pesan kesalahan yang ramah pengguna apabila request gagal atau *timeout*.

Pengambilan data dilakukan di dalam `useEffect` dengan memanggil metode asinkron `repository.getAllUsers(abortController.signal)` yang meneruskan kontrak dari [`userRepository.ts`](src/features/users/services/userRepository.ts) ke lapisan HTTP client [`httpClient.ts`](src/shared/api/httpClient.ts).

#### B. Cara Mencegah Memory Leak & Race Condition pada `useEffect`
*Memory leak* dan *race condition* terjadi ketika komponen sudah di-*unmount* (atau ketika pengguna memicu request baru) sebelum request HTTP sebelumnya selesai, namun callback asinkron lama tetap mencoba memperbarui state React (`setUsers` / `setIsLoading`) atau menimpa data terbaru dengan respons lama yang datang terlambat.

Untuk mencegah hal tersebut, saya menerapkan **dua mekanisme pengaman** pada *cleanup function* `useEffect`:
1. **Pembatalan Request Jaringan dengan `AbortController`:**
   Setiap kali `useEffect` dijalankan, dibuat instance `new AbortController()`. Objek `abortController.signal` dikirimkan ke fungsi native `fetch(url, { signal })`. Saat komponen *unmount* atau ketika *dependency* berubah (misalnya pengguna menekan tombol *Retry*), fungsi cleanup `return () => abortController.abort()` langsung menghentikan koneksi HTTP yang masih berjalan di level browser.
2. **Pengecekan Status Siklus Hidup (`isMounted` & `signal.aborted`):**
   Sebelum memanggil `setUsers`, `setError`, atau `setIsLoading`, kode memeriksa `if (isMounted && !abortController.signal.aborted)`. Selain itu, di dalam blok `catch`, error yang berasal dari pembatalan sengaja (`AbortError` atau `err.isAborted`) langsung diabaikan (`return`) agar tidak memicu *state update* palsu.

```tsx
useEffect(() => {
  const abortController = new AbortController();
  let isMounted = true;

  async function fetchUsersData() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await repository.getAllUsers(abortController.signal);
      if (isMounted && !abortController.signal.aborted) {
        setUsers(data);
      }
    } catch (err: unknown) {
      // Abaikan error jika request sengaja dibatalkan saat cleanup/unmount
      if (err instanceof ApiError && err.isAborted) return;
      if (err instanceof DOMException && err.name === 'AbortError') return;

      if (isMounted && !abortController.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Gagal memuat data.');
      }
    } finally {
      if (isMounted && !abortController.signal.aborted) {
        setIsLoading(false);
      }
    }
  }

  void fetchUsersData();

  // Cleanup function: dijalankan saat komponen unmount atau sebelum efek berikutnya berjalan
  return () => {
    isMounted = false;
    abortController.abort();
  };
}, [repository, requestVersion, shouldFailNext]);
```

#### C. Cara Mencegah Pemanggilan API Berulang (Infinite Loop)
*Infinite loop* pada `useEffect` disebabkan oleh dua kesalahan umum:
1. Memasukkan state yang diperbarui di dalam `useEffect` (seperti `users`) ke dalam *dependency array*, sehingga setiap kali `setUsers(data)` selesai, `useEffect` terpanggil kembali tanpa henti.
2. Memasukkan objek atau fungsi yang dibuat ulang pada setiap kali komponen *render* (referensi memori baru di setiap render) ke dalam *dependency array*.

Cara saya mencegahnya:
- State hasil fetch (`users`, `isLoading`, `error`) **tidak dimasukkan** ke dalam dependency array.
- Objek `defaultUserRepository` diinisialisasi satu kali di luar siklus render komponen (sebagai *module singleton*), sehingga referensi memorinya selalu tetap.
- Untuk fitur *manual refetch / retry*, saya menggunakan counter bertipe primitif `requestVersion` (`number`) yang hanya bertambah nilainya ketika fungsi `refetch` (yang telah di-memoisasi dengan `useCallback`) dipanggil oleh aksi klik pengguna.

---

### 4.2. Struktur Folder

> **Pertanyaan:** *Mengapa Anda menstrukturisasi folder/file seperti yang ada di project Anda saat ini? Jelaskan alasannya.*

Project ini menggunakan struktur **Feature-Based Modular Architecture (Colocation)** yang memisahkan kode berdasarkan domain fitur (`features/users`) dan infrastruktur lintas-fitur (`shared`):

```text
src/
├── features/
│   └── users/                        # Modul mandiri untuk domain fitur "Users"
│       ├── __tests__/                # Unit & integration tests khusus fitur Users
│       │   └── UserDashboard.test.tsx
│       ├── components/               # Komponen UI spesifik fitur Users
│       │   ├── DirectoryHeader.tsx
│       │   ├── DirectoryStateFeedback.tsx
│       │   ├── PaginationBar.tsx
│       │   ├── SearchAndControls.tsx
│       │   ├── UserDashboardPage.tsx
│       │   ├── UserDetailModal.tsx
│       │   ├── UserGridCard.tsx
│       │   └── UserTable.tsx
│       ├── hooks/                    # Custom hooks pengelola state & bisnis fitur Users
│       │   ├── useUserDirectoryFilter.ts
│       │   └── useUsers.ts
│       ├── services/                 # Lapisan komunikasi data (Repository Pattern)
│       │   └── userRepository.ts
│       ├── types/                    # Kontrak TypeScript & entitas domain User
│       │   └── user.types.ts
│       └── utils/                    # Pure functions (filtering, sorting, formatting)
│           └── userFilter.ts
├── shared/                           # Modul generik yang dapat dipakai ulang oleh fitur apa pun
│   ├── api/                          # Wrapper HTTP client generik dengan timeout & AbortSignal
│   │   └── httpClient.ts
│   ├── components/                   # Komponen UI umum (ErrorBoundary, CustomSelect)
│   │   ├── CustomSelect.tsx
│   │   └── ErrorBoundary.tsx
│   └── hooks/                        # Custom hooks utilitas umum (useDebounce, useKeyboardShortcut)
│       ├── useDebounce.ts
│       └── useKeyboardShortcut.ts
├── test/                             # Setup pengujian Vitest & Testing Library
│   └── setup.ts
├── App.tsx                           # Root application & ErrorBoundary wrapper
├── main.tsx                          # Entry point DOM React
└── index.css                         # Konfigurasi design tokens & base styles TailwindCSS v4
```

#### Alasan Pemilihan Struktur Ini:
1. **High Cohesion & Colocation (Kemudahan Maintenance):**
   Semua file yang saling berkaitan dalam fitur direktori pengguna (mulai dari tipe data, pemanggilan API, custom hooks, komponen tabel/kartu, hingga unit test) dikelompokkan dalam satu tempat (`src/features/users`). Developer tidak perlu melompat-lompat antar folder global yang terpisah jauh saat mengembangkan atau men-*debug* satu fitur.
2. **Separation of Concerns (Pemisahan Tanggung Jawab yang Jelas):**
   - **UI Layer (`components/`):** Fokus murni pada tampilan dan aksesibilitas, bebas dari logika `fetch` atau manipulasi array yang rumit.
   - **State & Logic Layer (`hooks/` & `utils/`):** Mengelola state pencarian, sorting, pagination, dan *lifecycle* data. Fungsi murni di `utils/userFilter.ts` dapat diuji secara langsung tanpa perlu me-render DOM.
   - **Data Access Layer (`services/` & `shared/api/`):** Menangani detail protokol HTTP dan pemetaan respons API.
3. **Skalabilitas Project:**
   Apabila aplikasi ini berkembang di masa depan (misalnya ditambah fitur *Role Management*, *Activity Logs*, atau *Organization Settings*), kita cukup menambahkan folder baru di bawah `src/features/` tanpa membuat folder global `/components` menjadi penuh sesak dan sulit dikelola.

---

### 4.3. Optimasi Kinerja (Performance) untuk 10.000 Data User

> **Pertanyaan:** *Anggaplah API tiba-tiba mengembalikan 10.000 data user sekaligus dan membuat aplikasi lag saat diketik di kolom pencarian. Pendekatan apa (fitur React apa) yang akan Anda gunakan untuk mengatasi lag tersebut?*

Ketika API mengembalikan 10.000 data sekaligus dan pengguna mengetik di kotak pencarian, *lag* (input terasa lambat/macet) disebabkan oleh dua faktor utama:
1. **Main-Thread CPU Blocking:** Menjalankan iterasi `.filter()` dan `.sort()` terhadap 10.000 item di setiap ketikan tombol secara sinkron akan menahan proses update karakter pada elemen `<input>`.
2. **Excessive DOM Reconciliation & Painting:** Meminta React me-render dan browser menggambar 10.000 node DOM kartu/baris tabel secara bersamaan pada setiap ketikan sangat membebani memori dan layout engine browser.

Untuk mengatasi masalah tersebut, pendekatan dan fitur React yang saya gunakan adalah:

#### 1. Concurrent Rendering dengan `useTransition` atau `useDeferredValue` (Fitur Bawaan React 18/19)
Dengan `useTransition` (yang telah diimplementasikan langsung di [`useUserDirectoryFilter.ts`](src/features/users/hooks/useUserDirectoryFilter.ts)) atau `useDeferredValue`, kita membagi pembaruan state menjadi dua tingkat prioritas:
- **Urgent State Update (`setSearchQuery`):** Memperbarui teks di dalam kolom `<input>` secara instan pada saat tombol ditekan, sehingga ketikan pengguna tetap responsif tanpa jeda.
- **Non-Urgent Transition Update (`startTransition(() => setDeferredQuery(value))`):** Menandai proses pemfilteran dan pembaruan daftar pengguna sebagai transisi berprioritas rendah yang dapat diinterupsi (*interruptible*). Jika pengguna mengetik huruf baru sebelum React selesai me-render hasil filter huruf sebelumnya, React otomatis membatalkan pekerjaan render yang sudah usang dan langsung mengerjakan ketikan terbaru.

#### 2. Memoisasi Kalkulasi dan Komponen (`useMemo`, `useCallback`, dan `React.memo`)
- **`useMemo`:** Digunakan untuk menyimpan hasil pemfilteran dan pengurutan (`filteredUsers`) agar iterasi terhadap 10.000 data hanya dijalankan ulang ketika kata kunci pencarian (`deferredQuery`) atau kriteria urutan benar-benar berubah, bukan ketika state lain yang tidak berhubungan (seperti membuka modal detail `selectedUser` atau mengganti mode tampilan `viewMode`) berubah.
- **`React.memo` & `useCallback`:** Membungkus komponen item (`UserGridCard` dan baris `UserTable`) dengan `React.memo` serta menstabilkan fungsi callback `onSelectUser` dengan `useCallback`, sehingga item yang tetap berada di layar tidak di-render ulang tanpa alasan.

#### 3. Pembatasan Node DOM dengan List Virtualization (Windowing) atau Pagination
Sekalipun proses `.filter()` di JavaScript selesai dalam hitungan milidetik, me-mount 10.000 elemen HTML ke dalam DOM akan tetap membuat halaman melambat.
- **List Virtualization (`@tanstack/react-virtual` atau `react-window`):** Jika desain mengharuskan *infinite scroll* tanpa halaman, kita menggunakan teknik *windowing* yang hanya me-render sekitar **15 sampai 20 elemen** yang sedang masuk di area pandang layar (*viewport*) pengguna. Saat pengguna menggulir layar, node DOM yang keluar dari layar didaur ulang untuk menampilkan data berikutnya.
- **Client-Side Slicing / Pagination:** Seperti yang telah diterapkan pada project ini ([`PaginationBar.tsx`](src/features/users/components/PaginationBar.tsx)), data hasil filter dipotong menggunakan `.slice(start, start + pageSize)` di dalam `useMemo`, sehingga React hanya me-render 5, 10, atau 15 komponen ke dalam DOM pada satu waktu.

#### 4. Debouncing (`useDebounce`) & Pre-Indexed Search String
- **Custom Hook `useDebounce`:** Menunda eksekusi pemfilteran berat hingga pengguna selesai mengetik selama `150ms` hingga `250ms` ([`useDebounce.ts`](src/shared/hooks/useDebounce.ts)), mengurangi frekuensi eksekusi filter secara drastis saat pengguna mengetik cepat.
- **Pre-computing Search Index:** Saat 10.000 data pertama kali diterima dari API, kita dapat melakukan normalisasi `.toLowerCase()` satu kali saja ke dalam properti indeks pencarian (`searchText: "${user.name.toLowerCase()} ${user.email.toLowerCase()}"`), sehingga tidak perlu memanggil `.toLowerCase()` puluhan ribu kali pada setiap ketikan.

---

## 5. Penerapan Prinsip Clean Code & SOLID

1. **Single Responsibility Principle (SRP):** Setiap modul memiliki satu tanggung jawab tunggal: `httpClient.ts` khusus untuk protokol jaringan & *timeout*, `userRepository.ts` khusus untuk pengambilan data domain `User`, `useUsers.ts` khusus untuk siklus hidup state API, dan `userFilter.ts` khusus untuk fungsi murni pemfilteran/pengurutan.
2. **Open/Closed Principle (OCP):** Logika pengambilan data terbuka untuk ekstensi (misalnya menambahkan implementasi `GraphQLUserRepository` atau `MockUserRepository`) melalui kontrak `IUserRepository` tanpa perlu memodifikasi kode di dalam komponen UI maupun custom hook.
3. **Liskov Substitution Principle (LSP):** Komponen `<UserDashboardPage repository={...} />` dapat menerima implementasi `IUserRepository` mana pun (baik repository API asli maupun mock repository pada [`UserDashboard.test.tsx`](src/features/users/__tests__/UserDashboard.test.tsx)) dan berjalan secara konsisten.
4. **Interface Segregation Principle (ISP):** Setiap komponen menerima *interface props* yang spesifik terhadap kebutuhannya dan tidak dipaksa menerima objek state global yang besar.
5. **Dependency Inversion Principle (DIP):** Komponen tingkat tinggi (`UserDashboardPage` dan `useUsers`) bergantung pada abstraksi [`IUserRepository`](src/features/users/types/user.types.ts), bukan bergantung langsung pada pemanggilan `fetch()` tingkat rendah.
