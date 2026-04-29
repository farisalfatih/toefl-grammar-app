"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  RefreshCw,
  BookOpen,
  Target,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";

export default function ScoreView() {
  const {
    currentTopicName,
    userAnswers,
    currentTopic,
    questionCount,
    startQuiz,
    resetQuiz,
  } = useAppStore();

  const totalQuestions = userAnswers.length;
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  let message = "";
  let emoji = "";
  let messageColor = "";
  if (percentage === 100) {
    message = "Sempurna! Kamu menguasai topik ini!";
    emoji = "🏆";
    messageColor = "text-emerald-700";
  } else if (percentage >= 80) {
    message = "Hebat! Hampir sempurna!";
    emoji = "🌟";
    messageColor = "text-emerald-700";
  } else if (percentage >= 60) {
    message = "Bagus! Terus berlatih!";
    emoji = "💪";
    messageColor = "text-amber-700";
  } else if (percentage >= 40) {
    message = "Lumayan! Perlu lebih banyak latihan.";
    emoji = "📚";
    messageColor = "text-orange-700";
  } else {
    message = "Jangan menyerah! Pelajari lagi materinya.";
    emoji = "🎯";
    messageColor = "text-red-700";
  }

  const OPTION_LABELS: Record<string, string> = {
    a: "A",
    b: "B",
    c: "C",
    d: "D",
    e: "E",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetQuiz}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali
          </Button>
          <span className="text-sm font-semibold text-emerald-900">
            Hasil Latihan
          </span>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Score Summary Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl border-emerald-100 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-3"
              >
                <span className="text-4xl">{emoji}</span>
              </motion.div>
              <h2 className="text-2xl font-bold">{percentage}%</h2>
              <p className="text-white/80 text-sm mt-1">
                {correctCount} dari {totalQuestions} jawaban benar
              </p>
            </div>
            <CardContent className="p-6">
              <p className={`text-center font-medium ${messageColor} mb-4`}>
                {message}
              </p>
              <p className="text-center text-sm text-muted-foreground mb-4">
                Topik: <span className="font-medium text-foreground">{currentTopicName}</span>
              </p>
              <Progress value={percentage} className="h-3 mb-6" />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={resetQuiz}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Pilih Topik
                </Button>
                <Button
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => {
                    if (currentTopic) {
                      startQuiz(currentTopic, currentTopicName || "", questionCount);
                    }
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Coba Lagi
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Answers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-emerald-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Detail Jawaban
          </h3>
          <div className="space-y-3">
            {userAnswers.map((answer, index) => (
              <motion.div
                key={answer.questionId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card
                  className={`border ${
                    answer.isCorrect
                      ? "border-emerald-200"
                      : "border-red-200"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-2">
                      {answer.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <CardTitle className="text-sm leading-relaxed font-medium">
                        {index + 1}. {answer.question}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="text-muted-foreground">
                        Jawaban Anda:{" "}
                        <Badge
                          variant={
                            answer.isCorrect ? "default" : "destructive"
                          }
                          className={
                            answer.isCorrect
                              ? "bg-emerald-600 hover:bg-emerald-700 text-xs"
                              : "text-xs"
                          }
                        >
                          {OPTION_LABELS[answer.userAnswer] || answer.userAnswer}
                        </Badge>
                      </span>
                      {!answer.isCorrect && (
                        <span className="text-muted-foreground">
                          Benar:{" "}
                          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                            {OPTION_LABELS[answer.correctAnswer] || answer.correctAnswer}
                          </Badge>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                      {answer.explanation}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex justify-center gap-3 pb-8"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={resetQuiz}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Kembali ke Topik
          </Button>
          {currentTopic && (
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => {
                startQuiz(currentTopic, currentTopicName || "", questionCount);
              }}
            >
              <Star className="w-4 h-4 mr-2" />
              Ulangi Latihan
            </Button>
          )}
        </motion.div>
      </main>
    </div>
  );
}
