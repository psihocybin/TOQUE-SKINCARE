// Дни недели — общий тип для конструктора ритуала (lib/actions/rituals.ts)
// и недельного календаря (/ritual-home, /home). Всё остальное, что раньше
// здесь жило (CustomSchedule и связанные типы), принадлежало старой системе
// profiles.custom_schedule — retired в пользу таблицы rituals, см.
// lib/actions/rituals.ts.
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
