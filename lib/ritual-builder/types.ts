export type BuilderGoal =
  | "cleansing"
  | "tone"
  | "glow"
  | "lymph"
  | "lift"
  | "recovery"
  | "scalp"
  | "body";

export type TimeBudget = 15 | 30 | 60;

export type SessionTime = "morning" | "midday" | "evening";

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export const WEEKDAYS: Weekday[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: "Пн",
  tue: "Вт",
  wed: "Ср",
  thu: "Чт",
  fri: "Пт",
  sat: "Сб",
  sun: "Вс",
};

export type DeviceSchedule = {
  deviceSlug: string;
  modeName: string;
  days: Weekday[];
};

// Сохраняется в profiles.custom_schedule (JSONB), см. миграцию 009.
export type CustomSchedule = {
  goals: BuilderGoal[];
  timeMinutes: TimeBudget;
  sessionTimes: SessionTime[];
  deviceSchedules: DeviceSchedule[];
};
