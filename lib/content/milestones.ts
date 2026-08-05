export type MilestoneType = "procedures" | "streak" | "days_program" | "devices";

export type MilestoneDef = {
  id: string;
  title: string;
  description: string;
  requiredCount: number;
  type: MilestoneType;
};

export type Milestone = MilestoneDef & {
  earned: boolean;
};

export const MILESTONES: MilestoneDef[] = [
  {
    id: "first-step",
    title: "Первый шаг",
    description: "Завершите первую процедуру",
    requiredCount: 1,
    type: "procedures",
  },
  {
    id: "week-streak",
    title: "Неделя ритуала",
    description: "7 дней подряд без пропусков",
    requiredCount: 7,
    type: "streak",
  },
  {
    id: "ten-procedures",
    title: "10 процедур",
    description: "10 процедур всего",
    requiredCount: 10,
    type: "procedures",
  },
  {
    id: "month-with-toque",
    title: "Месяц с TOQUE",
    description: "30 дней программы",
    requiredCount: 30,
    type: "days_program",
  },
  {
    id: "thirty-procedures",
    title: "30 процедур",
    description: "30 процедур всего",
    requiredCount: 30,
    type: "procedures",
  },
  {
    id: "two-devices",
    title: "2 устройства",
    description: "Добавьте второе устройство",
    requiredCount: 2,
    type: "devices",
  },
  {
    id: "collector",
    title: "Коллекционер",
    description: "3 и более устройств",
    requiredCount: 3,
    type: "devices",
  },
];

export type MilestoneStats = {
  completedProcedures: number;
  streak: number;
  currentDay: number;
  devicesCount: number;
};

// earned считаем на лету по уже существующим данным профиля (процедуры,
// streak, день программы, количество устройств) — без отдельной таблицы
// achievements: она создана миграцией 009 на будущее, но писать в неё
// сейчас некому (нет триггера/джобы на "веха достигнута").
export function computeMilestones(stats: MilestoneStats): Milestone[] {
  return MILESTONES.map((m) => {
    const value =
      m.type === "procedures"
        ? stats.completedProcedures
        : m.type === "streak"
          ? stats.streak
          : m.type === "days_program"
            ? stats.currentDay
            : stats.devicesCount;
    return { ...m, earned: value >= m.requiredCount };
  });
}
