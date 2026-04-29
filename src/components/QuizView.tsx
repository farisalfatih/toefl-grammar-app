"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  ArrowRight,
  Loader2,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import type { Question } from "@/lib/store";

const OPTION_LABELS = ["A", "B", "C", "D", "E"] as const;
const OPTION_KEYS = ["a", "b", "c", "d", "e"] as const;

function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  isSubmitted,
}: {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  isSubmitted: boolean;
}) {
  const selectAnswer = useAppStore((s) => s.selectAnswer);
  const submitAnswer = useAppStore((s) => s.submitAnswer);
  const nextQuestion = useAppStore((s) => s.nextQuestion);

  const progressValue = ((questionIndex + 1) / totalQuestions) * 100;
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Progress Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-emerald-700">
            Pertanyaan {questionIndex + 1} dari {totalQuestions}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progressValue)}%
          </span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="shadow-lg border-emerald-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-base sm:text-lg leading-relaxed font-medium text-foreground">
            <span className="text-emerald-600 font-bold mr-2">
              Q{questionIndex + 1}.
            </span>
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Options */}
          <div className="space-y-2">
            {OPTION_KEYS.map((key) => {
              const label = OPTION_LABELS[OPTION_KEYS.indexOf(key)];
              const optionText = question.options[key];
              const isSelected = selectedAnswer === key;
              const isCorrectOption = question.correctAnswer === key;

              let optionClass =
                "flex items-start gap-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ";

              if (isSubmitted) {
                if (isCorrectOption) {
                  optionClass += "border-emerald-500 bg-emerald-50";
                } else if (isSelected && !isCorrectOption) {
                  optionClass += "border-red-500 bg-red-50";
                } else {
                  optionClass += "border-muted bg-muted/30 opacity-60";
                }
              } else if (isSelected) {
                optionClass += "border-emerald-500 bg-emerald-50";
              } else {
                optionClass +=
                  "border-muted hover:border-emerald-300 hover:bg-emerald-50/50";
              }

              return (
                <motion.button
                  key={key}
                  onClick={() => !isSubmitted && selectAnswer(key)}
                  disabled={isSubmitted}
                  whileHover={!isSubmitted ? { scale: 1.01 } : undefined}
                  whileTap={!isSubmitted ? { scale: 0.99 } : undefined}
                  className={optionClass}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border-2 transition-colors ${
                      isSubmitted && isCorrectOption
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : isSubmitted && isSelected && !isCorrectOption
                        ? "border-red-500 bg-red-500 text-white"
                        : isSelected
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {isSubmitted && isCorrectOption ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isSubmitted && isSelected && !isCorrectOption ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      label
                    )}
                  </span>
                  <span
                    className={`text-sm sm:text-base text-left pt-1 ${
                      isSubmitted && isCorrectOption
                        ? "text-emerald-800 font-medium"
                        : isSubmitted && isSelected && !isCorrectOption
                        ? "text-red-800"
                        : "text-foreground"
                    }`}
                  >
                    {optionText}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Submit Button */}
          {!isSubmitted && (
            <Button
              onClick={submitAnswer}
              disabled={!selectedAnswer}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              size="lg"
            >
              Kirim Jawaban
            </Button>
          )}

          {/* Feedback */}
          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Result Badge */}
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg mb-3 ${
                    isCorrect
                      ? "bg-emerald-50 border border-emerald-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800">
                        Benar! Hebat! 🎉
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        Kurang tepat. Jawaban yang benar:{" "}
                        <span className="font-bold uppercase">
                          {question.correctAnswer}
                        </span>
                      </span>
                    </>
                  )}
                </div>

                {/* Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">
                    💡 Penjelasan
                  </p>
                  <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-line">
                    {question.explanation}
                  </p>
                </div>

                {/* Next Button */}
                <Button
                  onClick={nextQuestion}
                  className="w-full h-11 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  size="lg"
                >
                  {questionIndex >= totalQuestions - 1
                    ? "Lihat Skor"
                    : "Pertanyaan Berikutnya"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function QuizView() {
  const {
    token,
    currentTopic,
    currentTopicName,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    isAnswerSubmitted,
    isLoading,
    error,
    questionCount,
    startQuiz,
    setQuestions,
    setQuizLoading,
    setQuizError,
    resetQuiz,
  } = useAppStore();

  const fetchQuestions = useCallback(async () => {
    if (!currentTopic || !token) return;

    setQuizLoading(true);
    setQuizError(null);

    try {
      const res = await fetch("/api/questions/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic: currentTopic, count: questionCount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setQuizError(data.error || "Gagal menghasilkan pertanyaan");
        return;
      }

      if (!data.questions || data.questions.length === 0) {
        setQuizError("Tidak ada pertanyaan yang dihasilkan. Coba lagi.");
        return;
      }

      setQuestions(data.questions);
    } catch {
      setQuizError("Gagal terhubung ke server. Coba lagi.");
    }
  }, [currentTopic, token, questionCount, setQuestions, setQuizLoading, setQuizError]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const currentQuestion = questions[currentQuestionIndex];

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
          <div className="text-center">
            <p className="text-sm font-semibold text-emerald-900 truncate max-w-[200px] sm:max-w-none">
              {currentTopicName}
            </p>
          </div>
          <div className="w-20" /> {/* Spacer for balance */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Loading State */}
        {isLoading && !currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
            <p className="text-lg font-semibold text-emerald-900">
              Membuat Pertanyaan
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              AI sedang membuat pertanyaan grammar untuk Anda...
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 max-w-md mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-2">
              Oops! Terjadi Kesalahan
            </p>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {error}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetQuiz}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Kembali
              </Button>
              <Button
                onClick={fetchQuestions}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Coba Lagi
              </Button>
            </div>
          </motion.div>
        )}

        {/* Questions */}
        {!isLoading && currentQuestion && (
          <AnimatePresence mode="wait">
            <QuestionCard
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              selectedAnswer={selectedAnswer}
              isSubmitted={isAnswerSubmitted}
            />
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
