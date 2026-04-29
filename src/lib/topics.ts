import {
  BookOpen,
  GitBranch,
  Sparkles,
  GitMerge,
  ArrowUpDown,
  Layers,
  Link,
  RotateCw,
  Minimize2,
  Target,
  Shuffle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const topics: Topic[] = [
  {
    id: "subject-verb-agreement",
    name: "Subject-Verb Agreement",
    description:
      "Pelajari kesesuaian antara subjek dan kata kerja dalam kalimat, termasuk aturan singular/plural dan subject-verb concord.",
    icon: BookOpen,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    id: "clause-vs-phrase",
    name: "Clause vs Phrase",
    description:
      "Beda antara klausa (memiliki subjek dan kata kerja) dengan frase (tidak memiliki kata kerja utama) dalam kalimat.",
    icon: GitBranch,
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
  },
  {
    id: "subjunctive",
    name: "Subjunctive",
    description:
      "Penggunaan bentuk kata kerja subjunctive dalam kalimat kondisi, permintaan, dan saran formal.",
    icon: Sparkles,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    id: "conditional",
    name: "Conditional",
    description:
      "Kalimat kondisional tipe 0, 1, 2, dan 3 termasuk mixed conditionals dan inverted conditionals.",
    icon: GitMerge,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    id: "inversion",
    name: "Inversion",
    description:
      "Pembalikan urutan subjek dan kata kerja setelah kata negatif, adverbial, dan dalam kalimat formal.",
    icon: ArrowUpDown,
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
  },
  {
    id: "parallel-structure",
    name: "Parallel Structure",
    description:
      "Menjaga konsistensi bentuk gramatikal dalam daftar, perbandingan, dan konstruksi paralel lainnya.",
    icon: Layers,
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
  },
  {
    id: "relative-clause",
    name: "Relative Clause",
    description:
      "Penggunaan relative pronoun (who, whom, whose, which, that) dan relative adverb dalam kalimat.",
    icon: Link,
    color: "text-cyan-700",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
  },
  {
    id: "gerund-vs-infinitive",
    name: "Gerund vs Infinitive",
    description:
      "Kapan menggunakan gerund (verb + -ing) dan kapan menggunakan infinitive (to + verb) setelah kata kerja tertentu.",
    icon: RotateCw,
    color: "text-lime-700",
    bgColor: "bg-lime-50",
    borderColor: "border-lime-200",
  },
  {
    id: "reduced-clause",
    name: "Reduced Clause",
    description:
      "Menyederhanakan adjective clause dan adverb clause menjadi frase yang lebih ringkas.",
    icon: Minimize2,
    color: "text-sky-700",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
  },
  {
    id: "modifier",
    name: "Modifier",
    description:
      "Penempatan modifier yang tepat, dangling modifier, dan squinting modifier dalam kalimat.",
    icon: Target,
    color: "text-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
  },
];

export const randomTopic: Topic = {
  id: "random",
  name: "Latihan Acak",
  description:
    "Latihan dengan pertanyaan acak dari semua topik grammar TOEFL. Cocok untuk persiapan menyeluruh!",
  icon: Shuffle,
  color: "text-gray-700",
  bgColor: "bg-gray-50",
  borderColor: "border-gray-200",
};

export function getTopicById(id: string): Topic | undefined {
  if (id === "random") return randomTopic;
  return topics.find((t) => t.id === id);
}
