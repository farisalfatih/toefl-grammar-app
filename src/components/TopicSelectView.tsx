"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  LogOut,
  Trophy,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { topics, randomTopic, type Topic } from "@/lib/topics";

function TopicCard({
  topic,
  index,
}: {
  topic: Topic;
  index: number;
}) {
  const startQuiz = useAppStore((s) => s.startQuiz);
  const [questionCount, setQuestionCount] = useState(5);
  const Icon = topic.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card
        className={`group hover:shadow-lg transition-all duration-300 border ${topic.borderColor} h-full`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${topic.bgColor} flex items-center justify-center shrink-0`}
            >
              <Icon className={`w-5 h-5 ${topic.color}`} />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base font-semibold leading-tight">
                {topic.name}
              </CardTitle>
              <CardDescription className="text-xs mt-1 line-clamp-2">
                {topic.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {[5, 10, 15].map((num) => (
                <button
                  key={num}
                  onClick={() => setQuestionCount(num)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors font-medium ${
                    questionCount === num
                      ? "bg-emerald-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {num}
                </button>
              ))}
              <span className="text-xs text-muted-foreground ml-1">soal</span>
            </div>
            <Button
              size="sm"
              onClick={() => startQuiz(topic.id, topic.name, questionCount)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-3 text-xs"
            >
              Mulai
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function TopicSelectView() {
  const { username, logout, scoreHistory } = useAppStore();

  const totalSessions = scoreHistory.length;
  const avgScore =
    totalSessions > 0
      ? Math.round(
          scoreHistory.reduce((sum, s) => sum + s.percentage, 0) / totalSessions
        )
      : 0;
  const bestScore =
    totalSessions > 0
      ? Math.max(...scoreHistory.map((s) => s.percentage))
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="TOEFL Grammar" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-emerald-900 text-sm sm:text-base">
              TOEFL Grammar
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Halo, <span className="font-medium text-emerald-700">{username}</span>!
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">
            Pilih Topik Latihan
          </h1>
          <p className="text-muted-foreground mt-1">
            Latih kemampuan grammar TOEFL-mu dengan pertanyaan AI
          </p>
        </motion.div>

        {/* Stats Summary */}
        {totalSessions > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            <Card className="border-emerald-100 py-4">
              <CardContent className="flex flex-col items-center gap-1">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span className="text-2xl font-bold text-emerald-900">
                  {totalSessions}
                </span>
                <span className="text-xs text-muted-foreground">Sesi Latihan</span>
              </CardContent>
            </Card>
            <Card className="border-amber-100 py-4">
              <CardContent className="flex flex-col items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span className="text-2xl font-bold text-amber-900">
                  {bestScore}%
                </span>
                <span className="text-xs text-muted-foreground">Skor Tertinggi</span>
              </CardContent>
            </Card>
            <Card className="border-teal-100 py-4">
              <CardContent className="flex flex-col items-center gap-1">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                <span className="text-2xl font-bold text-teal-900">
                  {avgScore}%
                </span>
                <span className="text-xs text-muted-foreground">Rata-rata</span>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Topic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic, index) => (
            <TopicCard key={topic.id} topic={topic} index={index} />
          ))}
          <TopicCard topic={randomTopic} index={topics.length} />
        </div>

        {/* Recent History */}
        {totalSessions > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-lg font-semibold text-emerald-900 mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Riwayat Latihan Terakhir
            </h2>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {scoreHistory.slice(0, 10).map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-50 shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {record.topicName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {record.correctAnswers}/{record.totalQuestions} benar &bull;{" "}
                      {new Date(record.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant={
                      record.percentage >= 80
                        ? "default"
                        : record.percentage >= 60
                        ? "secondary"
                        : "destructive"
                    }
                    className={
                      record.percentage >= 80
                        ? "bg-emerald-600 hover:bg-emerald-700 ml-2"
                        : ""
                    }
                  >
                    {record.percentage}%
                  </Badge>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer Credit */}
        <footer className="mt-12 pb-6 text-center">
          <p className="text-xs text-muted-foreground">
            Made by <span className="font-semibold text-emerald-700">Mohammad Faris Al Fatih</span>
          </p>
        </footer>
      </main>
    </div>
  );
}
