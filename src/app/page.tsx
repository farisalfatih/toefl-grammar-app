"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useAppStore } from "@/lib/store";
import LoginView from "@/components/LoginView";
import TopicSelectView from "@/components/TopicSelectView";
import QuizView from "@/components/QuizView";
import ScoreView from "@/components/ScoreView";

function useMounted() {
  const mounted = useRef(false);
  const subscribe = (onStoreChange: () => void) => onStoreChange;
  return useSyncExternalStore(
    subscribe,
    () => {
      mounted.current = true;
      return true;
    },
    () => false
  );
}

export default function Home() {
  const { currentView, setAuth, setView } = useAppStore();
  const mounted = useMounted();

  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem("toefl_token");
      const savedUsername = localStorage.getItem("toefl_username");

      if (savedToken) {
        try {
          const res = await fetch("/api/auth/verify", {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          const data = await res.json();
          if (data.valid) {
            setAuth(savedToken, savedUsername || data.username);
          } else {
            localStorage.removeItem("toefl_token");
            localStorage.removeItem("toefl_username");
            setView("login");
          }
        } catch {
          if (savedUsername) {
            setAuth(savedToken, savedUsername);
          }
        }
      }
    };

    verifyToken();
  }, [setAuth, setView]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  switch (currentView) {
    case "login":
      return <LoginView />;
    case "topics":
      return <TopicSelectView />;
    case "quiz":
      return <QuizView />;
    case "score":
      return <ScoreView />;
    default:
      return <LoginView />;
  }
}
