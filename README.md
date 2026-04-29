# TOEFL EPT Grammar Practice

**Author:** Mohammad Faris Al Fatih

## Overview

Aplikasi web interaktif untuk latihan grammar TOEFL EPT, dibangun dengan menggunakan AI untuk menghasilkan pertanyaan pilihan ganda secara dinamis. Sistem mengadopsi arsitektur modern dengan pendekatan full-stack monorepo, memisahkan antara business logic di sisi server dan state management di sisi klien.

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router) — Framework React dengan server-side rendering dan routing berbasis file system. Digunakan pendekatan Single Page Application (SPA) di mana seluruh view (Login, Topic Selection, Quiz, Score) dikelola melalui Zustand state management tanpa routing URL terpisah.
- **TypeScript 5** — Typed superset dari JavaScript yang digunakan di seluruh codebase untuk memastikan type safety dan mengurangi bug pada runtime.
- **Tailwind CSS 4** — Utility-first CSS framework untuk styling. Digunakan bersama shadcn/ui component library yang menyediakan komponen UI aksesibel berbasis Radix UI primitives.
- **Framer Motion** — Library animasi untuk React, digunakan untuk transisi halus antar view, micro-interactions pada tombol dan kartu, serta animasi loading states.
- **Zustand** — Lightweight state management library untuk mengelola auth state, quiz state, navigation, dan score history tanpa boilerplate yang berlebihan.

### Backend
- **Next.js API Routes** — Server-side API routes yang berjalan di Node.js runtime. Digunakan tiga endpoint utama:
  - `POST /api/auth/login` — Validasi kredensial dan issuance JWT token
  - `GET /api/auth/verify` — Verifikasi JWT token untuk auth guard
  - `POST /api/questions/generate` — Proxy ke Groq API untuk menghasilkan pertanyaan
- **Groq API** — AI inference service yang digunakan untuk menghasilkan pertanyaan grammar TOEFL secara dinamis. Model yang digunakan adalah `llama-3.3-70b-versatile` dengan response format JSON structured output. Setiap request mengirimkan system prompt yang berisi spesifikasi topik grammar, level kesulitan TOEFL, dan format output yang diharapkan (5 opsi A-E beserta penjelasan).
- **JWT (JSON Web Token)** — Implementasi autentikasi stateless menggunakan `jsonwebtoken` library. Token disimpan di localStorage klien dan dikirim melalui Authorization header pada setiap request ke API. Token berlaku 24 jam.
- **Environment Variables** — Konfigurasi kredensial auth dan API key disimpan di `.env.local` tanpa database. Pendekatan ini dipilih untuk kesederhanaan deployment pada skala kecil.

### Infrastructure
- **Docker** — Containerization menggunakan multi-stage build untuk mengoptimalkan ukuran image production:
  - **Stage 1 (deps):** Install dependencies menggunakan npm
  - **Stage 2 (builder):** Build Next.js standalone output
  - **Stage 3 (runner):** Minimal image dengan hanya runtime dependencies
- **Docker Compose** — Orchestration untuk menjalankan container dengan konfigurasi network yang terhubung ke Nginx Proxy Manager (reverse proxy). Tidak ada port yang di-expose ke host — akses hanya melalui reverse proxy.
- **Nginx Proxy Manager** — Digunakan sebagai reverse proxy untuk SSL termination, domain routing, dan load balancing. Container aplikasi terhubung ke network `proxy_default` milik NPM.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Client (Browser)                │
│  ┌──────────┐ ┌──────────┐ ┌───────┐ ┌────────┐ │
│  │  Login   │ │  Topics  │ │  Quiz │ │ Score  │ │
│  │  View    │ │  View    │ │  View │ │  View  │ │
│  └────┬─────┘ └────┬─────┘ └───┬───┘ └───┬────┘ │
│       └────────────┴───────────┴──────────┘      │
│                    Zustand Store                  │
└──────────────────────┬──────────────────────────┘
                       │ fetch()
┌──────────────────────▼──────────────────────────┐
│              Next.js API Routes                  │
│  ┌─────────────────┐ ┌────────────────────────┐ │
│  │  /api/auth/*    │ │ /api/questions/generate │ │
│  │  JWT Auth       │ │  Groq API Proxy        │ │
│  └─────────────────┘ └───────────┬────────────┘ │
└──────────────────────────────────┼──────────────┘
                                   │ HTTPS
┌──────────────────────────────────▼──────────────┐
│              Groq API (llama-3.3-70b)            │
│         AI Question Generation Service           │
└─────────────────────────────────────────────────┘
```

### State Management Flow
Aplikasi menggunakan Zustand sebagai single source of truth. Seluruh state (autentikasi, navigasi, quiz progress, skor) tersentralisasi dalam satu store. Perpindahan antar view dilakukan melalui perubahan state `currentView`, bukan URL routing. Score history disimpan di localStorage untuk persistensi sederhana.

### Authentication Flow
Login menggunakan JWT tanpa database — kredensial divalidasi terhadap environment variables. Setelah berhasil login, JWT token disimpan di localStorage dan otomatis diverifikasi saat aplikasi dimuat ulang (auto-login).

### Question Generation
Groq API dipanggil dari server-side API route (bukan langsung dari client) untuk menjaga keamanan API key. Prompt engineering digunakan secara spesifik untuk setiap topik grammar — termasuk deskripsi kaidah grammar, level kesulitan TOEFL, dan format output JSON yang tervalidasi. Hasil dari AI kemudian di-shuffle untuk menghindari pola jawaban yang bisa diprediksi.

---

## Topic Coverage

Aplikasi mencakup 10 topik grammar yang paling sering muncul di TOEFL EPT Structure & Written Expression:

| # | Topic | Deskripsi |
|---|-------|-----------|
| 1 | Subject-Verb Agreement | Kesesuaian subjek dan kata kerja, intervening phrases, collective nouns |
| 2 | Clause vs Phrase | Diferensiasi independent/dependent clause dengan berbagai jenis phrase |
| 3 | Subjunctive | Bentuk subjunctive setelah trigger verbs dan adjectives |
| 4 | Conditional | Type 0-3 dan mixed conditionals |
| 5 | Inversion | Pembalikan S-V setelah negative adverb dan restrictive expressions |
| 6 | Parallel Structure | Konsistensi bentuk gramatikal dalam correlative conjunctions |
| 7 | Relative Clause | Penggunaan who/whom/whose/which/that dan reduced forms |
| 8 | Gerund vs Infinitive | Kapan menggunakan gerund atau infinitive setelah specific verbs |
| 9 | Reduced Clause | Penyederhanaan adjective clause dan adverb clause |
| 10 | Modifier | Penempatan modifier, dangling modifier, misplaced modifier |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # JWT login endpoint
│   │   │   └── verify/route.ts     # JWT verification
│   │   └── questions/
│   │       └── generate/route.ts   # Groq API proxy
│   ├── globals.css                  # Global styles + Tailwind
│   ├── layout.tsx                   # Root layout + metadata
│   └── page.tsx                     # SPA entry point
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── LoginView.tsx                # Authentication view
│   ├── TopicSelectView.tsx          # Topic dashboard
│   ├── QuizView.tsx                 # Quiz interface
│   └── ScoreView.tsx                # Score summary
├── hooks/
│   ├── use-toast.ts                 # Toast notification hook
│   └── use-mobile.ts               # Responsive breakpoint hook
└── lib/
    ├── store.ts                     # Zustand global state
    ├── topics.ts                    # Topic definitions
    └── utils.ts                     # Utility functions
```

---

## Deployment

Aplikasi di-deploy sebagai Docker container tanpa port exposure langsung, terhubung ke Nginx Proxy Manager untuk SSL termination dan domain routing melalui shared Docker network (`proxy_default`).
