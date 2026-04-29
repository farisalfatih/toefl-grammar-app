import { create } from "zustand";

export interface QuestionOption {
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
}

export interface Question {
  id: string;
  question: string;
  options: QuestionOption;
  correctAnswer: string;
  explanation: string;
}

export type ViewType = "login" | "topics" | "quiz" | "score";

export interface UserAnswer {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
}

export interface ScoreRecord {
  topicId: string;
  topicName: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  date: string;
}

interface AppState {
  // Auth
  token: string | null;
  username: string | null;
  setAuth: (token: string, username: string) => void;
  logout: () => void;

  // Navigation
  currentView: ViewType;
  setView: (view: ViewType) => void;

  // Quiz state
  currentTopic: string | null;
  currentTopicName: string | null;
  questionCount: number;
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  isAnswerSubmitted: boolean;
  userAnswers: UserAnswer[];
  isLoading: boolean;
  error: string | null;

  // Actions
  startQuiz: (topicId: string, topicName: string, count: number) => void;
  setQuestions: (questions: Question[]) => void;
  selectAnswer: (answer: string) => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  setQuizLoading: (loading: boolean) => void;
  setQuizError: (error: string | null) => void;

  // Score history
  scoreHistory: ScoreRecord[];
  addScoreRecord: (record: ScoreRecord) => void;
  resetQuiz: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  token: typeof window !== "undefined" ? localStorage.getItem("toefl_token") : null,
  username: typeof window !== "undefined" ? localStorage.getItem("toefl_username") : null,

  setAuth: (token, username) => {
    localStorage.setItem("toefl_token", token);
    localStorage.setItem("toefl_username", username);
    set({ token, username, currentView: "topics" });
  },

  logout: () => {
    localStorage.removeItem("toefl_token");
    localStorage.removeItem("toefl_username");
    set({
      token: null,
      username: null,
      currentView: "login",
      currentTopic: null,
      currentTopicName: null,
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isAnswerSubmitted: false,
      userAnswers: [],
      isLoading: false,
      error: null,
    });
  },

  // Navigation
  currentView: "login",
  setView: (view) => set({ currentView: view }),

  // Quiz state
  currentTopic: null,
  currentTopicName: null,
  questionCount: 5,
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswer: null,
  isAnswerSubmitted: false,
  userAnswers: [],
  isLoading: false,
  error: null,

  startQuiz: (topicId, topicName, count) => {
    set({
      currentTopic: topicId,
      currentTopicName: topicName,
      questionCount: count,
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isAnswerSubmitted: false,
      userAnswers: [],
      isLoading: true,
      error: null,
      currentView: "quiz",
    });
  },

  setQuestions: (questions) => set({ questions, isLoading: false }),

  selectAnswer: (answer) => set({ selectedAnswer: answer }),

  submitAnswer: () => {
    const state = get();
    if (!state.selectedAnswer || state.isAnswerSubmitted) return;

    const currentQuestion = state.questions[state.currentQuestionIndex];
    if (!currentQuestion) return;

    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      userAnswer: state.selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation,
      isCorrect: state.selectedAnswer === currentQuestion.correctAnswer,
    };

    set({
      isAnswerSubmitted: true,
      userAnswers: [...state.userAnswers, userAnswer],
    });
  },

  nextQuestion: () => {
    const state = get();
    const isLastQuestion =
      state.currentQuestionIndex >= state.questions.length - 1;

    if (isLastQuestion) {
      // userAnswers already includes the last submitted answer from submitAnswer()
      const correctCount = state.userAnswers.filter((a) => a.isCorrect).length;

      const record: ScoreRecord = {
        topicId: state.currentTopic || "",
        topicName: state.currentTopicName || "",
        totalQuestions: state.questions.length,
        correctAnswers: correctCount,
        percentage: Math.round(
          (correctCount / state.questions.length) * 100
        ),
        date: new Date().toISOString(),
      };

      const history =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("toefl_scores") || "[]")
          : [];

      history.unshift(record);
      if (history.length > 20) history.pop();
      localStorage.setItem("toefl_scores", JSON.stringify(history));

      set({
        currentView: "score",
        scoreHistory: history,
      });
    } else {
      set({
        currentQuestionIndex: state.currentQuestionIndex + 1,
        selectedAnswer: null,
        isAnswerSubmitted: false,
      });
    }
  },

  setQuizLoading: (loading) => set({ isLoading: loading }),
  setQuizError: (error) => set({ error, isLoading: false }),

  // Score history
  scoreHistory:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("toefl_scores") || "[]")
      : [],

  addScoreRecord: (record) => {
    const history = [...get().scoreHistory, record];
    if (typeof window !== "undefined") {
      localStorage.setItem("toefl_scores", JSON.stringify(history));
    }
    set({ scoreHistory: history });
  },

  resetQuiz: () => {
    set({
      currentTopic: null,
      currentTopicName: null,
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isAnswerSubmitted: false,
      userAnswers: [],
      isLoading: false,
      error: null,
      currentView: "topics",
    });
  },
}));
