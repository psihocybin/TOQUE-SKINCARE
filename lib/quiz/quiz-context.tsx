"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type DeviceId =
  | "NUO"
  | "NUO_PRO"
  | "LUMERA"
  | "ELARA"
  | "PULSAR"
  | "ANIMA"
  | "NOVA"
  | "AERIS"
  | "AURA"
  | "VIBE"
  | "QUANTUM";

export type AgeGroup = "25-34" | "35-44" | "45-54" | "55+";
export type Goal = "cleansing" | "tone" | "glow" | "puffiness" | "all";
export type SkinType = "normal" | "dry" | "oily" | "combo" | "sensitive";
export type Experience = "beginner" | "familiar" | "experienced" | "expert";
export type PreferredTime = "morning" | "evening" | "flexible";
export type Frequency = "low" | "medium" | "daily";

export type QuizAnswers = {
  device: DeviceId | null;
  name: string;
  ageGroup: AgeGroup | null;
  goal: Goal | null;
  isGift: boolean;
  skinType: SkinType | null;
  experience: Experience | null;
  preferredTime: PreferredTime | null;
  frequency: Frequency | null;
  wantsBaselinePhoto: boolean;
};

const STORAGE_KEY = "toque_quiz_answers";
export const QUIZ_TOTAL_STEPS = 7;

const defaultAnswers: QuizAnswers = {
  device: null,
  name: "",
  ageGroup: null,
  goal: null,
  isGift: false,
  skinType: null,
  experience: null,
  preferredTime: null,
  frequency: null,
  wantsBaselinePhoto: false,
};

type QuizContextValue = {
  answers: QuizAnswers;
  setAnswer: <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => void;
  getAnswer: <K extends keyof QuizAnswers>(key: K) => QuizAnswers[K];
  resetQuiz: () => void;
  isStepComplete: (step: number) => boolean;
  getCurrentStep: () => number;
};

const QuizContext = createContext<QuizContextValue | null>(null);

function isAnswered<K extends keyof QuizAnswers>(
  key: K,
  value: QuizAnswers[K],
): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  // booleans (isGift, wantsBaselinePhoto) — заполнены по факту значения
  return true;
}

// Сопоставление шагов 1–7 с ключами, по которым шаг считается заполненным.
// Шаг 4 — это goal (+ isGift — опциональный чекбокс), шаг 7 — preferredTime+frequency
// (baseline-фото опционально). Запись об опциональных полях оставлена в комментарии.
const STEP_REQUIRED_KEYS: Record<number, ReadonlyArray<keyof QuizAnswers>> = {
  1: ["device"],
  2: ["name"],
  3: ["ageGroup"],
  4: ["goal"],
  5: ["skinType"],
  6: ["experience"],
  7: ["preferredTime", "frequency"],
};

// Поля где значение либо string-enum, либо null. typeof null === "object", поэтому
// нельзя проверять через typeof v === typeof defaultAnswers[key] — это бы отбросило
// все валидные строки и оставило бы только дефолтные null.
const NULLABLE_STRING_KEYS = [
  "device",
  "ageGroup",
  "goal",
  "skinType",
  "experience",
  "preferredTime",
  "frequency",
] as const satisfies ReadonlyArray<keyof QuizAnswers>;

function mergeAnswers(stored: unknown): QuizAnswers {
  if (!stored || typeof stored !== "object") return defaultAnswers;
  const s = stored as Record<string, unknown>;
  const out: QuizAnswers = { ...defaultAnswers };

  if (typeof s.name === "string") out.name = s.name;
  if (typeof s.isGift === "boolean") out.isGift = s.isGift;
  if (typeof s.wantsBaselinePhoto === "boolean")
    out.wantsBaselinePhoto = s.wantsBaselinePhoto;

  for (const key of NULLABLE_STRING_KEYS) {
    const v = s[key];
    if (v === null || typeof v === "string") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (out as any)[key] = v;
    }
  }
  return out;
}

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<QuizAnswers>(defaultAnswers);
  // hydrated — state (а не useRef): нужно в deps записывающего useEffect, чтобы он
  // не сработал до завершения чтения из localStorage. Иначе на mount эффект-write
  // успевает перезаписать хранилище дефолтами раньше, чем эффект-read применит
  // загруженные answers (особенно заметно в dev из-за StrictMode и HMR-перемонтов).
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setAnswers(mergeAnswers(JSON.parse(raw)));
      }
    } catch {
      // localStorage может быть недоступен (privacy mode) — игнорируем.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // Тихо игнорируем (квота / privacy mode).
    }
  }, [answers, hydrated]);

  const setAnswer = useCallback(
    <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const getAnswer = useCallback(
    <K extends keyof QuizAnswers>(key: K): QuizAnswers[K] => answers[key],
    [answers],
  );

  const resetQuiz = useCallback(() => {
    setAnswers(defaultAnswers);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const isStepComplete = useCallback(
    (step: number) => {
      const keys = STEP_REQUIRED_KEYS[step];
      if (!keys) return false;
      return keys.every((k) => isAnswered(k, answers[k]));
    },
    [answers],
  );

  const getCurrentStep = useCallback(() => {
    for (let step = 1; step <= QUIZ_TOTAL_STEPS; step++) {
      if (!isStepComplete(step)) return step;
    }
    return QUIZ_TOTAL_STEPS;
  }, [isStepComplete]);

  const value = useMemo<QuizContextValue>(
    () => ({
      answers,
      setAnswer,
      getAnswer,
      resetQuiz,
      isStepComplete,
      getCurrentStep,
    }),
    [answers, setAnswer, getAnswer, resetQuiz, isStepComplete, getCurrentStep],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error(
      "useQuiz() должен использоваться внутри <QuizProvider> ((onboarding)/layout).",
    );
  }
  return ctx;
}
