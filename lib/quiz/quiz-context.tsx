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
  | "QUANTUM"
  | "LYRA"
  | "SYLVA";

export type AgeGroup = "18-24" | "25-34" | "35-44" | "45-54" | "55+";
export type Goal = "cleansing" | "tone" | "glow" | "puffiness" | "all";
export type SkinType = "normal" | "dry" | "oily" | "combo" | "sensitive";
export type Experience = "beginner" | "familiar" | "experienced" | "expert";
export type PreferredTime = "morning" | "evening" | "flexible";
export type Frequency = "low" | "medium" | "daily";

export type QuizAnswers = {
  // Все выбранные устройства (порядок = порядок выбора).
  devices: DeviceId[];
  // Первое выбранное — главное устройство, пишется в profiles.device
  // (legacy-поле, используется всеми существующими одиночными экранами).
  primaryDevice: DeviceId | null;
  name: string;
  ageGroup: AgeGroup | null;
  goal: Goal | null;
  skinType: SkinType | null;
  experience: Experience | null;
  preferredTime: PreferredTime | null;
  frequency: Frequency | null;
  wantsBaselinePhoto: boolean;
};

export const STORAGE_KEY = "toque_quiz_answers";
export const QUIZ_TOTAL_STEPS = 7;

const defaultAnswers: QuizAnswers = {
  devices: [],
  primaryDevice: null,
  name: "",
  ageGroup: null,
  goal: null,
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
  // Добавляет/убирает устройство из мультиселекта шага 1. primaryDevice
  // всегда равен первому выбранному (порядок = порядок клика).
  toggleDevice: (id: DeviceId) => void;
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
  if (Array.isArray(value)) return value.length > 0;
  // booleans (wantsBaselinePhoto) — заполнены по факту значения
  return true;
}

// Сопоставление шагов 1–7 с ключами, по которым шаг считается заполненным.
// Порядок шагов (редизайн квиза): устройство → имя → цель → тип кожи →
// опыт → возраст → время и ритм. Шаг 1 — devices (мультиселект, минимум
// одно устройство). Шаг 7 — preferredTime+frequency (baseline-фото
// опционально).
const STEP_REQUIRED_KEYS: Record<number, ReadonlyArray<keyof QuizAnswers>> = {
  1: ["devices"],
  2: ["name"],
  3: ["goal"],
  4: ["skinType"],
  5: ["experience"],
  6: ["ageGroup"],
  7: ["preferredTime", "frequency"],
};

// Поля где значение либо string-enum, либо null. typeof null === "object", поэтому
// нельзя проверять через typeof v === typeof defaultAnswers[key] — это бы отбросило
// все валидные строки и оставило бы только дефолтные null.
const NULLABLE_STRING_KEYS = [
  "primaryDevice",
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
  if (typeof s.wantsBaselinePhoto === "boolean")
    out.wantsBaselinePhoto = s.wantsBaselinePhoto;

  if (Array.isArray(s.devices)) {
    out.devices = s.devices.filter(
      (d): d is DeviceId => typeof d === "string",
    );
  }

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

  const toggleDevice = useCallback((id: DeviceId) => {
    setAnswers((prev) => {
      const isSelected = prev.devices.includes(id);
      const nextDevices = isSelected
        ? prev.devices.filter((d) => d !== id)
        : [...prev.devices, id];
      return {
        ...prev,
        devices: nextDevices,
        primaryDevice: nextDevices[0] ?? null,
      };
    });
  }, []);

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
      toggleDevice,
      resetQuiz,
      isStepComplete,
      getCurrentStep,
    }),
    [
      answers,
      setAnswer,
      getAnswer,
      toggleDevice,
      resetQuiz,
      isStepComplete,
      getCurrentStep,
    ],
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
