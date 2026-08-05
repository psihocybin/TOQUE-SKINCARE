// Комбо-протоколы: последовательность процедур на нескольких устройствах
// за один сеанс. deviceSlug/modeName здесь — свободный текст для отображения
// (не завязаны на lib/content/protocols.ts modes), чтобы можно было описать
// последовательность даже для устройств без детального протокола.

export type ComboProtocol = {
  devices: string[];
  name: string;
  totalMinutes: number;
  sequence: {
    deviceSlug: string;
    modeName: string;
    durationMinutes: number;
    note: string;
  }[];
};

export const comboProtocols: ComboProtocol[] = [
  {
    devices: ["nuo", "elara"],
    name: "Чистка + лифтинг",
    totalMinutes: 20,
    sequence: [
      {
        deviceSlug: "nuo",
        modeName: "Cleaning",
        durationMinutes: 5,
        note: "Начинаем с очищения",
      },
      {
        deviceSlug: "nuo",
        modeName: "Ion-",
        durationMinutes: 5,
        note: "Дезинкрустация",
      },
      {
        deviceSlug: "elara",
        modeName: "RED",
        durationMinutes: 7,
        note: "Лифтинг на чистую кожу",
      },
      {
        deviceSlug: "elara",
        modeName: "BLUE",
        durationMinutes: 3,
        note: "Финальный баланс",
      },
    ],
  },
  {
    devices: ["nuo", "anima"],
    name: "Чистка + световая терапия",
    totalMinutes: 25,
    sequence: [
      {
        deviceSlug: "nuo",
        modeName: "Cleaning",
        durationMinutes: 5,
        note: "Сначала очищение",
      },
      {
        deviceSlug: "nuo",
        modeName: "Ion+",
        durationMinutes: 5,
        note: "Подготовка к фототерапии",
      },
      {
        deviceSlug: "anima",
        modeName: "Красный + NIR",
        durationMinutes: 15,
        note: "LED после очищения — максимальный эффект",
      },
    ],
  },
  {
    devices: ["nuo", "elara", "anima"],
    name: "Полный протокол",
    totalMinutes: 35,
    sequence: [
      {
        deviceSlug: "nuo",
        modeName: "Cleaning",
        durationMinutes: 5,
        note: "Очищение",
      },
      {
        deviceSlug: "nuo",
        modeName: "Ion+",
        durationMinutes: 5,
        note: "Ионофорез с сывороткой",
      },
      {
        deviceSlug: "elara",
        modeName: "RED",
        durationMinutes: 10,
        note: "Лифтинг",
      },
      {
        deviceSlug: "anima",
        modeName: "Красный + NIR",
        durationMinutes: 15,
        note: "Финальная фототерапия",
      },
    ],
  },
  {
    devices: ["aura", "nuo"],
    name: "Чистка + массаж",
    totalMinutes: 20,
    sequence: [
      {
        deviceSlug: "nuo",
        modeName: "Cleaning",
        durationMinutes: 5,
        note: "Сначала очищение",
      },
      {
        deviceSlug: "aura",
        modeName: "Нагрев + красный LED",
        durationMinutes: 10,
        note: "Массаж после очищения",
      },
    ],
  },
];

export function findComboProtocol(
  devices: string[],
): ComboProtocol | undefined {
  return comboProtocols.find((c) => c.devices.every((d) => devices.includes(d)));
}
